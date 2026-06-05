const {
  assertSupabaseAdminConfig,
  buildRsvpBaseUrl,
  createReminderApprovalToken,
  escapeHtml,
  fetchAdminUserById,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
} = require("./_supabase-admin");

const EVENTS_TABLE_NAME = "team_events";
const CONTACTS_TABLE_NAME = "team_contacts";
const RSVP_TABLE_NAME = "event_rsvps";
const DRAFTS_TABLE_NAME = "ai_communication_drafts";
const TEAMS_TABLE_NAME = "teams";
const UPDATE_LOGS_TABLE_NAME = "event_update_logs";

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const adminConfig = getSupabaseAdminConfig();
  const payload = request.body || {};
  const accessToken = String(payload.accessToken || "").trim();
  const teamId = String(payload.teamId || "").trim();
  const eventId = String(payload.eventId || "").trim();
  const baseUrl = buildRsvpBaseUrl(payload.baseUrl || process.env.TEAMPRO_APP_BASE_URL || "https://www.teampro.co.nz");

  if (!accessToken || !teamId || !eventId) {
    response.status(400).json({
      error: "accessToken, teamId, and eventId are required.",
    });
    return;
  }

  try {
    assertSupabaseAdminConfig(adminConfig);

    const user = await fetchAuthenticatedUser({
      supabaseUrl: adminConfig.supabaseUrl,
      supabaseAnonKey: adminConfig.supabaseAnonKey,
      accessToken,
    });

    const [teamRows, eventRows, contactRows, rsvpRows, existingDraftRows] = await Promise.all([
      supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: TEAMS_TABLE_NAME,
        query: {
          select: "id,team_name,user_id",
          id: `eq.${teamId}`,
          user_id: `eq.${user.id}`,
        },
      }),
      supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: EVENTS_TABLE_NAME,
        query: {
          select: "*",
          id: `eq.${eventId}`,
          team_id: `eq.${teamId}`,
          user_id: `eq.${user.id}`,
        },
      }),
      supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: CONTACTS_TABLE_NAME,
        query: {
          select: "*",
          team_id: `eq.${teamId}`,
          user_id: `eq.${user.id}`,
          order: "contact_name.asc",
        },
      }),
      supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: RSVP_TABLE_NAME,
        query: {
          select: "*",
          event_id: `eq.${eventId}`,
          order: "created_at.asc",
        },
      }),
      supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: DRAFTS_TABLE_NAME,
        query: {
          select: "*",
          event_id: `eq.${eventId}`,
          draft_type: "eq.event_cancellation",
          status: "eq.pending_review",
          order: "created_at.desc",
        },
      }),
    ]);

    const teamRecord = Array.isArray(teamRows) ? teamRows[0] : null;
    const eventRecord = Array.isArray(eventRows) ? eventRows[0] : null;
    const teamContacts = Array.isArray(contactRows) ? contactRows : [];
    const eventRsvps = Array.isArray(rsvpRows) ? rsvpRows : [];
    const existingDraft = Array.isArray(existingDraftRows) ? existingDraftRows[0] : existingDraftRows;

    if (!teamRecord || !eventRecord) {
      response.status(404).json({ error: "The team or event could not be found for this account." });
      return;
    }

    if (eventRecord.status !== "cancelled") {
      response.status(400).json({ error: "Only cancelled events can generate a cancellation approval." });
      return;
    }

    const recipients = getAllContactRecipients(teamContacts);
    if (!recipients.length) {
      response.status(400).json({ error: "No contacts with email addresses are available for this team." });
      return;
    }

    if (existingDraft) {
      const notifyResult = !existingDraft.admin_notified_at
        ? await notifyAdminForCancellationDraft({
            adminConfig,
            draftRow: existingDraft,
            eventRecord,
            teamName: teamRecord.team_name || "TeamPro team",
            recipientContacts: recipients,
            eventRsvps,
            baseUrl,
          })
        : { notified: false };

      response.status(200).json({
        ok: true,
        duplicate: true,
        notified: Boolean(notifyResult.notified),
        draftCreated: false,
        draftId: existingDraft.id,
      });
      return;
    }

    const draftJson = buildCancellationDraftJson({
      teamName: teamRecord.team_name || "TeamPro team",
      eventRecord,
      recipientContacts: recipients,
    });

    const createdRows = await supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: DRAFTS_TABLE_NAME,
      method: "POST",
      query: {
        select: "*",
      },
      headers: {
        Prefer: "return=representation",
      },
      body: {
        user_id: user.id,
        team_id: teamId,
        event_id: eventId,
        raw_prompt: `Automatic cancellation draft for ${eventRecord.event_title}`,
        draft_json: draftJson,
        status: "pending_review",
        draft_type: "event_cancellation",
        reminder_type: null,
        scheduled_for: new Date().toISOString(),
        admin_notified_at: null,
        reviewed_at: null,
      },
    });

    const createdDraft = Array.isArray(createdRows) ? createdRows[0] : createdRows;
    const notifyResult = await notifyAdminForCancellationDraft({
      adminConfig,
      draftRow: createdDraft,
      eventRecord,
      teamName: teamRecord.team_name || "TeamPro team",
      recipientContacts: recipients,
      eventRsvps,
      baseUrl,
    });

    response.status(200).json({
      ok: true,
      duplicate: false,
      notified: Boolean(notifyResult.notified),
      draftCreated: true,
      draftId: createdDraft.id,
    });
  } catch (error) {
    console.error("[Event Cancellation] Request failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(error?.statusCode || 500).json({
      error: error?.message || "Cancellation approval failed.",
    });
  }
};

function getAllContactRecipients(contacts) {
  return (Array.isArray(contacts) ? contacts : []).filter((contact) => String(contact.email || "").trim());
}

function buildCancellationDraftJson({ teamName, eventRecord, recipientContacts }) {
  const eventTypeLabel = formatEventTypeLabel(eventRecord.event_type);
  const eventDate = formatEventDate(eventRecord.event_date);
  const eventTiming = formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "Time to be confirmed";
  const location = eventRecord.location || "Location to be confirmed";
  const notes = String(eventRecord.notes || "").trim();

  const emailBody = [
    `Hello ${teamName} families,`,
    "",
    `Please note that ${eventRecord.event_title} has been cancelled.`,
    "",
    `Event: ${eventRecord.event_title}`,
    `Type: ${eventTypeLabel}`,
    `Date: ${eventDate}`,
    `Time: ${eventTiming}`,
    `Location: ${location}`,
    notes ? `Notes: ${notes}` : null,
    "",
    "Please do not attend this session. We’ll share any replacement details if they are confirmed.",
    "",
    "Thanks,",
    teamName,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    intent_type: "cancel_event",
    confidence: 0.94,
    event_action: {
      create_new_event: false,
      update_existing_event: false,
      cancel_existing_event: true,
      suggested_event_title: eventRecord.event_title || "",
      event_type: eventRecord.event_type || "other",
      event_date: eventRecord.event_date || null,
      start_time: eventRecord.start_time || null,
      end_time: eventRecord.end_time || null,
      location: eventRecord.location || null,
      notes: eventRecord.notes || "",
    },
    message: {
      email_subject: `${teamName}: ${eventRecord.event_title} cancelled`,
      email_body: emailBody,
      sms_body: `${teamName}: ${eventRecord.event_title} on ${eventDate}${eventRecord.start_time ? ` at ${eventRecord.start_time}` : ""} has been cancelled.${eventRecord.location ? ` ${eventRecord.location}.` : ""}`,
    },
    rsvp: {
      rsvp_required: false,
      suggested_deadline: null,
    },
    recipients: {
      suggested_group: "all_contacts",
    },
    follow_up: {
      reminder_recommended: false,
      suggested_reminder_timing: null,
    },
    missing_information: [],
    meta: {
      approval_kind: "event_cancellation",
      recipient_count: recipientContacts.length,
    },
  };
}

async function notifyAdminForCancellationDraft({
  adminConfig,
  draftRow,
  eventRecord,
  teamName,
  recipientContacts,
  eventRsvps,
  baseUrl,
}) {
  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[Event Cancellation] Admin approval email skipped because Resend is not fully configured", {
      eventId: eventRecord.id,
      draftId: draftRow.id,
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
    });
    return { notified: false };
  }

  const ownerUser = await fetchAdminUserById({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    userId: eventRecord.user_id,
  });

  const ownerEmail = String(ownerUser?.email || "").trim();
  if (!ownerEmail) {
    console.warn("[Event Cancellation] Admin approval email skipped because no owner email was found", {
      eventId: eventRecord.id,
      draftId: draftRow.id,
      userId: eventRecord.user_id,
    });
    return { notified: false };
  }

  const approvalToken = createReminderApprovalToken({
    draftId: draftRow.id,
    eventId: eventRecord.id,
    teamId: eventRecord.team_id,
    expiresAt: buildAdminApprovalExpiry(eventRecord.event_date),
  });
  const approvalUrl = buildReminderApprovalPageUrl({ baseUrl, token: approvalToken });
  const reviewUrl = buildReminderReviewLink({ baseUrl, eventId: eventRecord.id, draftId: draftRow.id });
  const dismissUrl = buildReminderReviewLink({
    baseUrl,
    eventId: eventRecord.id,
    draftId: draftRow.id,
    draftAction: "dismiss",
  });
  const summary = summariseRsvps(eventRsvps);

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [ownerEmail],
      subject: `Review cancellation message: ${teamName || "TeamPro team"} - ${eventRecord.event_title}`,
      text: buildAdminCancellationEmailText({
        draftRow,
        eventRecord,
        teamName,
        recipientContacts,
        summary,
        approvalUrl,
        reviewUrl,
        dismissUrl,
      }),
      html: buildAdminCancellationEmailHtml({
        draftRow,
        eventRecord,
        teamName,
        recipientContacts,
        summary,
        approvalUrl,
        reviewUrl,
        dismissUrl,
      }),
    }),
  });

  if (!resendResponse.ok) {
    throw new Error(`Resend request failed: ${await resendResponse.text()}`);
  }

  const resendJson = await resendResponse.json().catch(() => ({}));
  console.info("[Event Cancellation] Admin approval email sent", {
    eventId: eventRecord.id,
    draftId: draftRow.id,
    ownerEmail,
    resendId: resendJson?.id || null,
  });

  await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: DRAFTS_TABLE_NAME,
    method: "PATCH",
    query: {
      id: `eq.${draftRow.id}`,
      select: "id",
    },
    headers: {
      Prefer: "return=representation",
    },
    body: {
      admin_notified_at: new Date().toISOString(),
    },
  });

  await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: UPDATE_LOGS_TABLE_NAME,
    method: "POST",
    query: {
      select: "id",
    },
    headers: {
      Prefer: "return=representation",
    },
    body: {
      user_id: eventRecord.user_id,
      team_id: eventRecord.team_id,
      event_id: eventRecord.id,
      delivery_method: "admin_review_email",
      recipient_count: recipientContacts.length,
      subject: `Review cancellation message: ${teamName || "TeamPro team"} - ${eventRecord.event_title}`,
      message_text: draftRow.draft_json?.message?.email_body || "",
    },
  });

  return { notified: true };
}

function buildAdminCancellationEmailText({ draftRow, eventRecord, teamName, recipientContacts, summary, approvalUrl, reviewUrl, dismissUrl }) {
  const recipientPreview = recipientContacts.length
    ? recipientContacts
        .slice(0, 8)
        .map((contact) => {
          const linked = Array.isArray(contact.linked_players) && contact.linked_players.length
            ? ` (${contact.linked_players.join(", ")})`
            : "";
          return `- ${contact.contact_name || "Contact"}${linked}${contact.email ? ` <${contact.email}>` : ""}`;
        })
        .join("\n")
    : "- No recipients suggested";

  return [
    "A TeamPro cancellation message is ready for review.",
    "Nothing has been sent to team members yet.",
    "",
    `Team: ${teamName || "TeamPro team"}`,
    `Event: ${eventRecord.event_title}`,
    `Date: ${eventRecord.event_date || "To be confirmed"}`,
    `Time: ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed"}`,
    `Location: ${eventRecord.location || "To be confirmed"}`,
    `Proposed recipients: ${recipientContacts.length}`,
    `RSVP summary: ${summary.yes} yes, ${summary.no} no, ${summary.maybe} maybe, ${summary.no_response} no response`,
    "",
    "Proposed recipients:",
    recipientPreview,
    "",
    draftRow.draft_json?.message?.email_body || "",
    "",
    `Open approval page: ${approvalUrl}`,
    `Review in Events: ${reviewUrl}`,
    `Dismiss: ${dismissUrl}`,
  ].join("\n");
}

function buildAdminCancellationEmailHtml({ draftRow, eventRecord, teamName, recipientContacts, summary, approvalUrl, reviewUrl, dismissUrl }) {
  const recipientList = recipientContacts.length
    ? recipientContacts
        .slice(0, 8)
        .map((contact) => {
          const linked = Array.isArray(contact.linked_players) && contact.linked_players.length
            ? ` (${contact.linked_players.join(", ")})`
            : "";
          return `<li>${escapeHtml(contact.contact_name || "Contact")}${linked ? escapeHtml(linked) : ""}${contact.email ? ` &lt;${escapeHtml(contact.email)}&gt;` : ""}</li>`;
        })
        .join("")
    : "<li>No recipients suggested</li>";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">A TeamPro cancellation message is ready for review</h2>
      <p>Nothing has been sent to team members yet.</p>
      <p><strong>Team:</strong> ${escapeHtml(teamName || "TeamPro team")}</p>
      <p><strong>Event:</strong> ${escapeHtml(eventRecord.event_title || "Untitled event")}</p>
      <p><strong>Date:</strong> ${escapeHtml(eventRecord.event_date || "To be confirmed")}</p>
      <p><strong>Time:</strong> ${escapeHtml(formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed")}</p>
      <p><strong>Location:</strong> ${escapeHtml(eventRecord.location || "To be confirmed")}</p>
      <p><strong>Proposed recipients:</strong> ${recipientContacts.length}</p>
      <p><strong>RSVP summary:</strong> ${summary.yes} yes, ${summary.no} no, ${summary.maybe} maybe, ${summary.no_response} no response</p>
      <p><strong>Proposed recipients:</strong></p>
      <ul>${recipientList}</ul>
      <div style="padding: 16px; border-radius: 16px; background: #f3f4f6; white-space: pre-wrap; margin: 16px 0;">${escapeHtml(draftRow.draft_json?.message?.email_body || "")}</div>
      <div style="margin-top: 24px;">
        <a href="${approvalUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #ddbb72; color: #111827; text-decoration: none; font-weight: 700; margin-right: 8px;">Accept &amp; Send</a>
        <a href="${reviewUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #1f2937; color: #f9fafb; text-decoration: none; font-weight: 700; margin-right: 8px;">Review in Events</a>
        <a href="${dismissUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: transparent; color: #6b7280; text-decoration: none; font-weight: 700;">Dismiss</a>
      </div>
    </div>
  `;
}

function buildReminderReviewLink({ baseUrl, eventId, draftId, draftAction = "", page = "comms" }) {
  const url = new URL(buildRsvpBaseUrl(baseUrl || "https://www.teampro.co.nz"));
  url.searchParams.set("page", page);
  url.searchParams.set("eventId", eventId);
  url.searchParams.set("draftId", draftId);
  if (draftAction) {
    url.searchParams.set("draftAction", draftAction);
  }
  return url.toString();
}

function buildReminderApprovalPageUrl({ baseUrl, token }) {
  const url = new URL(`${buildRsvpBaseUrl(baseUrl || "https://www.teampro.co.nz")}/reminder-approval`);
  url.searchParams.set("token", token);
  return url.toString();
}

function buildAdminApprovalExpiry(eventDate) {
  if (!eventDate) {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  }

  const parsed = new Date(`${eventDate}T23:59:59Z`);
  const fallback = Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
  return new Date(fallback + 1000 * 60 * 60 * 24 * 14).toISOString();
}

function summariseRsvps(rows) {
  return rows.reduce(
    (summary, row) => {
      const key = ["yes", "no", "maybe", "no_response"].includes(row.response) ? row.response : "no_response";
      summary[key] += 1;
      return summary;
    },
    { yes: 0, no: 0, maybe: 0, no_response: 0 },
  );
}

function formatEventTypeLabel(eventType) {
  return {
    training: "Training",
    game: "Game",
    tournament: "Tournament",
    other: "Other",
  }[eventType] || "Other";
}

function formatEventDate(dateValue) {
  if (!dateValue) {
    return "Date to be confirmed";
  }

  try {
    return new Intl.DateTimeFormat("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${dateValue}T12:00:00`));
  } catch (_error) {
    return dateValue;
  }
}

function formatEventTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  return startTime || endTime || "";
}
