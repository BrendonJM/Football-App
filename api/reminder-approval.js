const {
  assertSupabaseAdminConfig,
  buildRsvpBaseUrl,
  buildRsvpLink,
  buildTokenExpiry,
  createSecureToken,
  escapeHtml,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
  verifyReminderApprovalToken,
} = require("./_supabase-admin");
const { buildCalendarInviteAttachment, getCalendarMethod } = require("./_calendar-invite");

const RSVP_TABLE_NAME = "event_rsvps";
const EVENTS_TABLE_NAME = "team_events";
const CONTACTS_TABLE_NAME = "team_contacts";
const TEAMS_TABLE_NAME = "teams";
const DRAFTS_TABLE_NAME = "ai_communication_drafts";
const UPDATE_LOGS_TABLE_NAME = "event_update_logs";
const RESEND_SEND_DELAY_MS = 600;

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  const adminConfig = getSupabaseAdminConfig();

  try {
    assertSupabaseAdminConfig(adminConfig);
  } catch (error) {
    response.status(500).json({ error: error.message });
    return;
  }

  try {
    if (request.method === "GET") {
      const token = String(request.query?.token || "").trim();
      if (!token) {
        response.status(400).json({ error: "token is required." });
        return;
      }

      const context = await loadReminderApprovalContext({ adminConfig, token });
      response.status(200).json({
        ok: true,
        approval: buildApprovalResponse(context),
      });
      return;
    }

    if (request.method === "POST") {
      const token = String(request.body?.token || "").trim();
      const action = String(request.body?.action || "send").trim();

      if (!token) {
        response.status(400).json({ error: "token is required." });
        return;
      }

      const context = await loadReminderApprovalContext({ adminConfig, token });

      if (action === "dismiss") {
        await updateDraftStatus({
          adminConfig,
          draftRecord: context.draftRecord,
          status: "discarded",
        });
        response.status(200).json({
          ok: true,
          dismissed: true,
          message: "Reminder draft dismissed.",
        });
        return;
      }

      if (action !== "send") {
        response.status(400).json({ error: "action must be send or dismiss." });
        return;
      }

      const sendResult = await sendReminderApprovalNow({ adminConfig, context });
      response.status(200).json({
        ok: true,
        ...sendResult,
      });
      return;
    }

    response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("[Reminder Approval] Request failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(500).json({
      error: error?.message || "Reminder approval failed.",
    });
  }
};

async function loadReminderApprovalContext({ adminConfig, token }) {
  const payload = verifyReminderApprovalToken(token);

  const draftRows = await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: DRAFTS_TABLE_NAME,
    query: {
      select: "*",
      id: `eq.${payload.draftId}`,
      event_id: `eq.${payload.eventId}`,
    },
  });

  const draftRecord = Array.isArray(draftRows) ? draftRows[0] : null;

  if (!draftRecord || draftRecord.status !== "pending_review" || !["scheduled_reminder", "event_cancellation"].includes(draftRecord.draft_type)) {
    throw new Error("That approval draft is no longer available.");
  }

  const eventRows = await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: EVENTS_TABLE_NAME,
    query: {
      select: "*",
      id: `eq.${draftRecord.event_id}`,
      team_id: `eq.${draftRecord.team_id}`,
    },
  });

  const eventRecord = Array.isArray(eventRows) ? eventRows[0] : null;
  if (!eventRecord) {
    throw new Error("That event could not be found.");
  }

  const [teamRows, contactRows, rsvpRows] = await Promise.all([
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: TEAMS_TABLE_NAME,
      query: {
        select: "id,team_name",
        id: `eq.${draftRecord.team_id}`,
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: CONTACTS_TABLE_NAME,
      query: {
        select: "*",
        team_id: `eq.${draftRecord.team_id}`,
        user_id: `eq.${draftRecord.user_id}`,
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: RSVP_TABLE_NAME,
      query: {
        select: "*",
        event_id: `eq.${draftRecord.event_id}`,
      },
    }),
  ]);

  const teamRecord = Array.isArray(teamRows) ? teamRows[0] : null;
  const contacts = Array.isArray(contactRows) ? contactRows : [];
  const rsvps = Array.isArray(rsvpRows) ? rsvpRows : [];
  const recipients = getReminderRecipientsForDraft({
    contacts,
    rsvps,
    group: draftRecord.draft_json?.recipients?.suggested_group || "non_responders",
  }).filter((contact) => String(contact.email || "").trim());

  return {
    token,
    draftRecord,
    eventRecord,
    teamRecord,
    contacts,
    rsvps,
    recipients,
  };
}

function buildApprovalResponse({ token, draftRecord, eventRecord, teamRecord, recipients, rsvps }) {
  const baseUrl = buildRsvpBaseUrl(process.env.TEAMPRO_APP_BASE_URL || "https://www.teampro.co.nz");
  const summary = summariseRsvps(rsvps);
  const approvalLabel = formatApprovalLabel(draftRecord);
  return {
    token,
    teamName: teamRecord?.team_name || "TeamPro team",
    eventTitle: eventRecord.event_title || "Untitled event",
    eventDate: eventRecord.event_date || "",
    eventTime: formatEventTimeRange(eventRecord.start_time, eventRecord.end_time),
    location: eventRecord.location || "",
    notes: eventRecord.notes || "",
    reminderType: draftRecord.reminder_type || "",
    draftType: draftRecord.draft_type || "scheduled_reminder",
    approvalLabel,
    subject: draftRecord.draft_json?.message?.email_subject || buildSubject(teamRecord?.team_name || "TeamPro team", eventRecord),
    messageText: draftRecord.draft_json?.message?.email_body || "",
    recipientCount: recipients.length,
    recipientNames: recipients.slice(0, 10).map((contact) => contact.contact_name || "Contact"),
    rsvpSummary: summary,
    reviewUrl: `${baseUrl}/?page=comms&eventId=${encodeURIComponent(eventRecord.id)}&draftId=${encodeURIComponent(draftRecord.id)}`,
  };
}

async function sendReminderApprovalNow({ adminConfig, context }) {
  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();

  if (!resendApiKey || !resendFromEmail) {
    throw new Error("Email sending is not configured yet.");
  }

  const { draftRecord, eventRecord, teamRecord, recipients } = context;

  if (!recipients.length) {
    throw new Error("No matching recipients are available for this approval.");
  }

  const includeRsvp = draftRecord.draft_json?.rsvp?.rsvp_required !== false;
  const rsvpRows = includeRsvp
    ? await ensureEventRsvps({
        adminConfig,
        userId: draftRecord.user_id,
        teamId: draftRecord.team_id,
        eventRecord,
        emailContacts: recipients,
      })
    : [];
  const rsvpsByContactId = groupRowsByContactId(rsvpRows);
  const subject = draftRecord.draft_json?.message?.email_subject || buildSubject(teamRecord?.team_name || "TeamPro team", eventRecord);
  const baseUrl = buildRsvpBaseUrl(process.env.TEAMPRO_APP_BASE_URL || "https://www.teampro.co.nz");
  const sendResults = [];

  for (let index = 0; index < recipients.length; index += 1) {
    const contact = recipients[index];
    const sendResult = await sendResendEmail({
      resendApiKey,
      resendFromEmail,
      subject,
      contact,
      teamName: teamRecord?.team_name || "TeamPro team",
      eventRecord,
      messageText: draftRecord.draft_json?.message?.email_body || "",
      rsvpRows: rsvpsByContactId[contact.id] || [],
      baseUrl,
      includeRsvp,
    });
    sendResults.push(sendResult);
    if (index < recipients.length - 1) {
      await wait(RESEND_SEND_DELAY_MS);
    }
  }

  const sentResults = sendResults.filter((result) => result.ok);
  const failedResults = sendResults.filter((result) => !result.ok);

  if (sentResults.length > 0) {
    await Promise.all([
      updateDraftStatus({
        adminConfig,
        draftRecord,
        status: "used",
      }),
      ...(draftRecord.draft_type === "scheduled_reminder"
        ? [markEventAsSent({
            adminConfig,
            eventRecord,
          })]
        : []),
      createEventUpdateLog({
        adminConfig,
        draftRecord,
        subject,
        messageText: draftRecord.draft_json?.message?.email_body || "",
        recipientCount: recipients.length,
      }),
    ]);
  }

  console.info("[Reminder Approval] Send summary", {
    draftId: draftRecord.id,
    eventId: eventRecord.id,
    sentCount: sentResults.length,
    failedCount: failedResults.length,
  });

  return {
    sent: sentResults.length > 0,
    partialSuccess: sentResults.length > 0 && failedResults.length > 0,
    sentCount: sentResults.length,
    failedCount: failedResults.length,
    sendResults,
    failedResults,
    message: buildEmailSendStatusMessage(sentResults.length, failedResults.length, draftRecord),
  };
}

async function updateDraftStatus({ adminConfig, draftRecord, status }) {
  await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: DRAFTS_TABLE_NAME,
    method: "PATCH",
    query: {
      id: `eq.${draftRecord.id}`,
      select: "id",
    },
    headers: {
      Prefer: "return=representation",
    },
    body: {
      status,
      reviewed_at: new Date().toISOString(),
    },
  });
}

async function markEventAsSent({ adminConfig, eventRecord }) {
  await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: EVENTS_TABLE_NAME,
    method: "PATCH",
    query: {
      id: `eq.${eventRecord.id}`,
      select: "id",
    },
    headers: {
      Prefer: "return=representation",
    },
    body: {
      status: "sent",
    },
  });
}

async function createEventUpdateLog({ adminConfig, draftRecord, subject, messageText, recipientCount }) {
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
      id: createSecureToken(),
      user_id: draftRecord.user_id,
      team_id: draftRecord.team_id,
      event_id: draftRecord.event_id,
      delivery_method: "email",
      recipient_count: recipientCount,
      subject,
      message_text: messageText,
    },
  });
}

function getReminderRecipientsForDraft({ contacts, rsvps, group }) {
  const emailContacts = contacts.filter((contact) => String(contact.email || "").trim());

  switch (group) {
    case "all_contacts":
      return emailContacts;
    case "available_players": {
      const yesIds = new Set(rsvps.filter((row) => row.response === "yes").map((row) => row.contact_id));
      return emailContacts.filter((contact) => yesIds.has(contact.id));
    }
    case "unavailable_players": {
      const noIds = new Set(rsvps.filter((row) => row.response === "no").map((row) => row.contact_id));
      return emailContacts.filter((contact) => noIds.has(contact.id));
    }
    case "custom":
      return emailContacts;
    case "non_responders":
    default: {
      const rsvpsByContactId = new Map();
      rsvps.forEach((row) => {
        const rows = rsvpsByContactId.get(row.contact_id) || [];
        rows.push(row);
        rsvpsByContactId.set(row.contact_id, rows);
      });

      return emailContacts.filter((contact) => {
        const contactRsvps = rsvpsByContactId.get(contact.id) || [];
        if (!contactRsvps.length) {
          return true;
        }
        return contactRsvps.some((row) => row.response === "no_response");
      });
    }
  }
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

function buildEmailSendStatusMessage(sentCount, failedCount, draftRecord) {
  const label = draftRecord?.draft_type === "event_cancellation" ? "Cancellation message" : "Reminder";
  if (sentCount > 0 && failedCount > 0) {
    return `${label} sent to ${sentCount} contact${sentCount === 1 ? "" : "s"}. ${failedCount} failed due to send limits or delivery errors.`;
  }
  if (sentCount > 0) {
    return `${label} sent to ${sentCount} contact${sentCount === 1 ? "" : "s"}.`;
  }
  if (failedCount > 0) {
    return `${label} could not be sent. ${failedCount} contact${failedCount === 1 ? "" : "s"} failed due to send limits or delivery errors.`;
  }
  return `${label} did not send to any contacts.`;
}

function formatApprovalLabel(draftRecord) {
  if (draftRecord?.draft_type === "event_cancellation") {
    return "Cancellation message";
  }

  return `${formatReminderTypeLabel(draftRecord?.reminder_type)} reminder`;
}

function groupRowsByContactId(rows) {
  return rows.reduce((accumulator, row) => {
    const key = row.contact_id;
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(row);
    return accumulator;
  }, {});
}

function buildRsvpKey(contactId, playerName) {
  return `${contactId}::${playerName || ""}`;
}

async function ensureEventRsvps({ adminConfig, userId, teamId, eventRecord, emailContacts }) {
  const existingRsvpRows = await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: RSVP_TABLE_NAME,
    query: {
      select: "*",
      event_id: `eq.${eventRecord.id}`,
      contact_id: `in.(${emailContacts.map((contact) => contact.id).join(",")})`,
    },
  });

  const existingRsvpMap = new Map(
    (Array.isArray(existingRsvpRows) ? existingRsvpRows : []).map((row) => [buildRsvpKey(row.contact_id, row.player_name), row]),
  );

  const rsvpRows = [];

  for (const contact of emailContacts) {
    const linkedPlayers = Array.isArray(contact.linked_players) && contact.linked_players.length
      ? contact.linked_players
      : [null];

    for (const playerName of linkedPlayers) {
      const key = buildRsvpKey(contact.id, playerName);
      const existing = existingRsvpMap.get(key);
      const token = createSecureToken();
      const tokenExpiresAt = buildTokenExpiry(eventRecord.event_date);

      if (existing) {
        const updatedRows = await supabaseAdminRequest({
          supabaseUrl: adminConfig.supabaseUrl,
          serviceRoleKey: adminConfig.serviceRoleKey,
          tableName: RSVP_TABLE_NAME,
          method: "PATCH",
          query: {
            id: `eq.${existing.id}`,
            select: "*",
          },
          headers: {
            Prefer: "return=representation",
          },
          body: {
            token,
            token_expires_at: tokenExpiresAt,
          },
        });
        rsvpRows.push(Array.isArray(updatedRows) ? updatedRows[0] : updatedRows);
      } else {
        const createdRows = await supabaseAdminRequest({
          supabaseUrl: adminConfig.supabaseUrl,
          serviceRoleKey: adminConfig.serviceRoleKey,
          tableName: RSVP_TABLE_NAME,
          method: "POST",
          query: {
            select: "*",
          },
          headers: {
            Prefer: "return=representation",
          },
          body: {
            user_id: userId,
            team_id: teamId,
            event_id: eventRecord.id,
            contact_id: contact.id,
            player_name: playerName,
            response: "no_response",
            response_note: null,
            token,
            token_expires_at: tokenExpiresAt,
            responded_at: null,
          },
        });
        rsvpRows.push(Array.isArray(createdRows) ? createdRows[0] : createdRows);
      }
    }
  }

  return rsvpRows;
}

async function sendResendEmail({
  resendApiKey,
  resendFromEmail,
  subject,
  contact,
  teamName,
  eventRecord,
  messageText,
  rsvpRows,
  baseUrl,
  includeRsvp,
}) {
  try {
    const calendarAttachment = buildCalendarInviteAttachment({
      eventRecord,
      teamName,
      contact,
      messageText,
      fromEmail: resendFromEmail,
      includeRsvp,
      baseUrl,
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [String(contact.email).trim()],
        subject,
        text: buildUpdateText({
          teamName,
          eventRecord,
          contact,
          messageText,
          rsvpRows,
          baseUrl,
          includeRsvp,
        }),
        html: buildUpdateHtml({
          teamName,
          eventRecord,
          contact,
          messageText,
          rsvpRows,
          baseUrl,
          includeRsvp,
        }),
        attachments: [calendarAttachment],
      }),
    });

    const rawText = await resendResponse.text();
    let responseJson = null;
    if (rawText) {
      try {
        responseJson = JSON.parse(rawText);
      } catch (_error) {
        responseJson = { raw: rawText };
      }
    }

    if (!resendResponse.ok) {
      const errorMessage =
        responseJson?.message ||
        responseJson?.error ||
        responseJson?.name ||
        rawText ||
        resendResponse.statusText ||
        "Resend request failed.";
      return {
        ok: false,
        contactId: contact.id,
        email: contact.email,
        resendId: null,
        status: resendResponse.status,
        error:
          resendResponse.status === 429
            ? "Resend rate limit exceeded for this recipient."
            : errorMessage,
      };
    }

    return {
      ok: true,
      contactId: contact.id,
      email: contact.email,
      resendId: responseJson?.id || null,
      status: resendResponse.status,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      contactId: contact.id,
      email: contact.email,
      resendId: null,
      status: null,
      error: error?.message || "Resend request failed.",
    };
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function buildSubject(teamName, eventRecord) {
  return getCalendarMethod(eventRecord) === "CANCEL"
    ? `${teamName}: ${eventRecord.event_title} cancelled`
    : `${teamName} update: ${eventRecord.event_title}`;
}

function buildUpdateText({ teamName, eventRecord, contact, messageText, rsvpRows, baseUrl, includeRsvp }) {
  const isCancellation = getCalendarMethod(eventRecord) === "CANCEL";
  const lines = [
    isCancellation ? `${teamName} event cancelled` : `${teamName} update`,
    "",
    `Event: ${eventRecord.event_title}`,
    `Type: ${formatEventTypeLabel(eventRecord.event_type)}`,
    `Date: ${eventRecord.event_date || "To be confirmed"}`,
    `Time: ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed"}`,
    `Location: ${eventRecord.location || "To be confirmed"}`,
    eventRecord.notes ? `Notes: ${eventRecord.notes}` : null,
    "",
    messageText,
    "",
    includeRsvp && !isCancellation
      ? `Hello ${contact.contact_name || "there"}, you can RSVP without logging in:`
      : `Hello ${contact.contact_name || "there"},`,
  ].filter(Boolean);

  if (includeRsvp && !isCancellation) {
    rsvpRows.forEach((row) => {
      const fallbackLink = buildRsvpLink({ baseUrl, token: row.token });
      lines.push(
        "",
        row.player_name ? `Player: ${row.player_name}` : "Availability response",
        `Yes: ${buildRsvpLink({ baseUrl, token: row.token, response: "yes" })}`,
        `No: ${buildRsvpLink({ baseUrl, token: row.token, response: "no" })}`,
        `Maybe: ${buildRsvpLink({ baseUrl, token: row.token, response: "maybe" })}`,
        `Reply page: ${fallbackLink}`,
      );
    });

    lines.push("", "If you prefer, open any of the links above and add an optional note.");
  }

  return lines.join("\n");
}

function buildUpdateHtml({ teamName, eventRecord, contact, messageText, rsvpRows, baseUrl, includeRsvp }) {
  const isCancellation = getCalendarMethod(eventRecord) === "CANCEL";
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(teamName)} ${isCancellation ? "event cancelled" : "update"}</h2>
      <p>Hello ${escapeHtml(contact.contact_name || "there")},</p>
      <p><strong>Event:</strong> ${escapeHtml(String(eventRecord.event_title || ""))}</p>
      ${eventRecord.event_type ? `<p><strong>Type:</strong> ${escapeHtml(formatEventTypeLabel(String(eventRecord.event_type || "")))}</p>` : ""}
      ${eventRecord.event_date ? `<p><strong>Date:</strong> ${escapeHtml(String(eventRecord.event_date))}</p>` : ""}
      ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) ? `<p><strong>Time:</strong> ${escapeHtml(formatEventTimeRange(eventRecord.start_time, eventRecord.end_time))}</p>` : ""}
      ${eventRecord.location ? `<p><strong>Location:</strong> ${escapeHtml(String(eventRecord.location))}</p>` : ""}
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(messageText)}</div>
      ${
        includeRsvp && !isCancellation
          ? `<div style="margin-top: 20px;">
              <p style="margin-bottom: 8px;"><strong>RSVP without logging in</strong></p>
              ${rsvpRows
                .map((row) => {
                  const yesLink = buildRsvpLink({ baseUrl, token: row.token, response: "yes" });
                  const noLink = buildRsvpLink({ baseUrl, token: row.token, response: "no" });
                  const maybeLink = buildRsvpLink({ baseUrl, token: row.token, response: "maybe" });
                  const fallbackLink = buildRsvpLink({ baseUrl, token: row.token });
                  return `
                    <div style="margin: 16px 0; padding: 14px; border: 1px solid #d1d5db; border-radius: 14px;">
                      <p style="margin: 0 0 10px;"><strong>${escapeHtml(row.player_name || "Availability response")}</strong></p>
                      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                        <a href="${yesLink}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#1f7a45;color:#ffffff;text-decoration:none;font-weight:700;">Available / Yes</a>
                        <a href="${noLink}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#b42318;color:#ffffff;text-decoration:none;font-weight:700;">Unavailable / No</a>
                        <a href="${maybeLink}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#b69258;color:#111827;text-decoration:none;font-weight:700;">Maybe / Unsure</a>
                      </div>
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">
                        Fallback link: <a href="${fallbackLink}">${escapeHtml(fallbackLink)}</a>
                      </p>
                    </div>
                  `;
                })
                .join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

function formatEventTypeLabel(eventType) {
  return {
    training: "Training",
    game: "Game",
    tournament: "Tournament",
    other: "Other",
  }[eventType] || "Other";
}

function formatReminderTypeLabel(value) {
  return {
    reminder_3_day: "3-day",
    reminder_1_day: "1-day",
    reminder_same_day: "same-day",
  }[value] || "scheduled";
}

function formatEventTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  return startTime || "";
}
