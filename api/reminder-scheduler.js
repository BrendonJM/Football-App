const {
  assertSupabaseAdminConfig,
  buildRsvpBaseUrl,
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
const UPDATE_LOGS_TABLE_NAME = "event_update_logs";
const USER_SETTINGS_TABLE_NAME = "user_settings";
const TEAMS_TABLE_NAME = "teams";
const TIME_ZONE = "Pacific/Auckland";

const reminderDraftSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intent_type: {
      type: "string",
      enum: ["send_reminder"],
    },
    confidence: { type: "number" },
    event_action: {
      type: "object",
      additionalProperties: false,
      properties: {
        create_new_event: { type: "boolean" },
        update_existing_event: { type: "boolean" },
        cancel_existing_event: { type: "boolean" },
        suggested_event_title: { type: "string" },
        event_type: {
          type: "string",
          enum: ["training", "game", "tournament", "other"],
        },
        event_date: { type: ["string", "null"] },
        start_time: { type: ["string", "null"] },
        end_time: { type: ["string", "null"] },
        location: { type: ["string", "null"] },
        notes: { type: "string" },
      },
      required: [
        "create_new_event",
        "update_existing_event",
        "cancel_existing_event",
        "suggested_event_title",
        "event_type",
        "event_date",
        "start_time",
        "end_time",
        "location",
        "notes",
      ],
    },
    message: {
      type: "object",
      additionalProperties: false,
      properties: {
        email_subject: { type: "string" },
        email_body: { type: "string" },
        sms_body: { type: "string" },
      },
      required: ["email_subject", "email_body", "sms_body"],
    },
    rsvp: {
      type: "object",
      additionalProperties: false,
      properties: {
        rsvp_required: { type: "boolean" },
        suggested_deadline: { type: ["string", "null"] },
      },
      required: ["rsvp_required", "suggested_deadline"],
    },
    recipients: {
      type: "object",
      additionalProperties: false,
      properties: {
        suggested_group: {
          type: "string",
          enum: ["all_contacts", "non_responders", "available_players", "unavailable_players", "custom"],
        },
      },
      required: ["suggested_group"],
    },
    follow_up: {
      type: "object",
      additionalProperties: false,
      properties: {
        reminder_recommended: { type: "boolean" },
        suggested_reminder_timing: { type: ["string", "null"] },
      },
      required: ["reminder_recommended", "suggested_reminder_timing"],
    },
    missing_information: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "intent_type",
    "confidence",
    "event_action",
    "message",
    "rsvp",
    "recipients",
    "follow_up",
    "missing_information",
  ],
};

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (!["GET", "POST"].includes(request.method)) {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const adminConfig = getSupabaseAdminConfig();

  try {
    assertSupabaseAdminConfig(adminConfig);
    await assertSchedulerAccess({ request, adminConfig });

    const runResult = await runReminderScheduler({ adminConfig });
    response.status(200).json({
      ok: true,
      ...runResult,
    });
  } catch (error) {
    console.error("[Reminder Scheduler] Execution failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(error?.statusCode || 500).json({
      error: error?.message || "Reminder scheduler failed.",
    });
  }
};

async function assertSchedulerAccess({ request, adminConfig }) {
  const cronHeader = String(request.headers["x-vercel-cron"] || "").trim();
  const cronSecret = String(process.env.CRON_SECRET || "").trim();
  const authHeader = String(request.headers.authorization || "").trim();
  const payload = request.body || {};
  const accessToken = String(payload.accessToken || "").trim();

  if (cronHeader) {
    return;
  }

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return;
  }

  if (accessToken) {
    await fetchAuthenticatedUser({
      supabaseUrl: adminConfig.supabaseUrl,
      supabaseAnonKey: adminConfig.supabaseAnonKey,
      accessToken,
    });
    return;
  }

  const error = new Error("Reminder scheduler access is not authorised.");
  error.statusCode = 401;
  throw error;
}

async function runReminderScheduler({ adminConfig }) {
  const now = new Date();
  const todayKey = dateKeyInTimeZone(now, TIME_ZONE);
  const dateCandidates = [
    todayKey,
    addDaysToDateKey(todayKey, 1),
    addDaysToDateKey(todayKey, 3),
  ];

  console.info("[Reminder Scheduler] Starting run", {
    todayKey,
    dateCandidates,
  });

  const eventRows = await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: EVENTS_TABLE_NAME,
    query: {
      select: "*",
      status: "in.(planned,sent)",
      event_date: `in.(${dateCandidates.join(",")})`,
      order: "event_date.asc,start_time.asc",
    },
  });

  const events = Array.isArray(eventRows) ? eventRows : [];
  console.info("[Reminder Scheduler] Events detected", {
    eventCount: events.length,
    eventIds: events.map((eventRecord) => eventRecord.id),
  });

  if (!events.length) {
    return {
      eventCount: 0,
      dueCount: 0,
      draftCount: 0,
      notifiedCount: 0,
      skippedCount: 0,
      duplicatesPrevented: 0,
      dueEvents: [],
    };
  }

  const teamIds = Array.from(new Set(events.map((eventRecord) => eventRecord.team_id).filter(Boolean)));
  const eventIds = events.map((eventRecord) => eventRecord.id).filter(Boolean);

  const userIds = Array.from(new Set(events.map((eventRecord) => eventRecord.user_id).filter(Boolean)));

  const [teamRows, contactRows, rsvpRows, existingDraftRows, userSettingsRows] = await Promise.all([
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: TEAMS_TABLE_NAME,
      query: {
        select: "id,team_name",
        id: `in.(${teamIds.join(",")})`,
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: CONTACTS_TABLE_NAME,
      query: {
        select: "*",
        team_id: `in.(${teamIds.join(",")})`,
        order: "contact_name.asc",
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: RSVP_TABLE_NAME,
      query: {
        select: "*",
        event_id: `in.(${eventIds.join(",")})`,
        order: "created_at.asc",
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: DRAFTS_TABLE_NAME,
      query: {
        select: "*",
        event_id: `in.(${eventIds.join(",")})`,
        draft_type: "eq.scheduled_reminder",
        order: "created_at.desc",
      },
    }),
    supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: USER_SETTINGS_TABLE_NAME,
      query: {
        select: "*",
        user_id: `in.(${userIds.join(",")})`,
      },
    }),
  ]);

  const contactsByTeamId = groupBy((Array.isArray(contactRows) ? contactRows : []), "team_id");
  const teamNameByTeamId = Object.fromEntries(
    (Array.isArray(teamRows) ? teamRows : [])
      .filter((row) => row?.id)
      .map((row) => [row.id, row.team_name || "TeamPro team"]),
  );
  const rsvpsByEventId = groupBy((Array.isArray(rsvpRows) ? rsvpRows : []), "event_id");
  const userSettingsByUserId = Object.fromEntries(
    (Array.isArray(userSettingsRows) ? userSettingsRows : [])
      .filter((row) => row?.user_id)
      .map((row) => [row.user_id, row]),
  );
  const draftsByEventReminder = new Map(
    (Array.isArray(existingDraftRows) ? existingDraftRows : [])
      .filter((draft) => draft.event_id && draft.reminder_type)
      .map((draft) => [`${draft.event_id}::${draft.reminder_type}`, draft]),
  );

  let dueCount = 0;
  let draftCount = 0;
  let notifiedCount = 0;
  let skippedCount = 0;
  let duplicatesPrevented = 0;
  const dueEvents = [];

  for (const eventRecord of events) {
    const dueReminderTypes = getDueReminderTypes({
      eventRecord,
      userSettings: userSettingsByUserId[eventRecord.user_id] || null,
      todayKey,
      now,
    });

    if (!dueReminderTypes.length) {
      skippedCount += 1;
      continue;
    }

    dueEvents.push({
      eventId: eventRecord.id,
      eventTitle: eventRecord.event_title,
      dueReminderTypes,
    });

    const teamContacts = (contactsByTeamId[eventRecord.team_id] || []).filter((contact) =>
      String(contact.email || "").trim(),
    );
    const eventRsvps = rsvpsByEventId[eventRecord.id] || [];

    for (const reminderType of dueReminderTypes) {
      dueCount += 1;
      const draftKey = `${eventRecord.id}::${reminderType}`;
      const existingDraft = draftsByEventReminder.get(draftKey);

      if (existingDraft) {
        duplicatesPrevented += 1;
        console.info("[Reminder Scheduler] Duplicate prevented", {
          eventId: eventRecord.id,
          reminderType,
          draftId: existingDraft.id,
        });

        if (!existingDraft.admin_notified_at) {
          const notifyResult = await notifyAdminForReminderDraft({
            adminConfig,
            draftRow: existingDraft,
            eventRecord,
            teamName: teamNameByTeamId[eventRecord.team_id] || "TeamPro team",
            teamContacts,
            eventRsvps,
          });
          if (notifyResult.notified) {
            notifiedCount += 1;
          }
        }
        continue;
      }

      const reminderRecipients = getReminderRecipientsForEvent({ contacts: teamContacts, rsvps: eventRsvps });
      if (!reminderRecipients.length) {
        console.info("[Reminder Scheduler] No reminder recipients", {
          eventId: eventRecord.id,
          reminderType,
        });
        skippedCount += 1;
        continue;
      }

      const draftJson = await buildReminderDraftJson({
        eventRecord,
        teamContacts,
        reminderRecipients,
        eventRsvps,
        reminderType,
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
          user_id: eventRecord.user_id,
          team_id: eventRecord.team_id,
          event_id: eventRecord.id,
          raw_prompt: buildScheduledDraftPrompt(eventRecord, reminderType),
          draft_json: draftJson,
          status: "pending_review",
          draft_type: "scheduled_reminder",
          reminder_type: reminderType,
          scheduled_for: buildScheduledReminderTimestamp(eventRecord, reminderType),
          admin_notified_at: null,
          reviewed_at: null,
        },
      });

      const createdDraft = Array.isArray(createdRows) ? createdRows[0] : createdRows;
      draftsByEventReminder.set(draftKey, createdDraft);
      draftCount += 1;
      console.info("[Reminder Scheduler] Draft created", {
        eventId: eventRecord.id,
        reminderType,
        draftId: createdDraft?.id || null,
      });

      const notifyResult = await notifyAdminForReminderDraft({
        adminConfig,
        draftRow: createdDraft,
        eventRecord,
        teamName: teamNameByTeamId[eventRecord.team_id] || "TeamPro team",
        teamContacts,
        eventRsvps,
      });

      if (notifyResult.notified) {
        notifiedCount += 1;
      }
    }
  }

  return {
    eventCount: events.length,
    dueCount,
    draftCount,
    notifiedCount,
    skippedCount,
    duplicatesPrevented,
    dueEvents,
  };
}

function getDueReminderTypes({ eventRecord, userSettings, todayKey, now }) {
  if (!eventRecord?.event_date) {
    return [];
  }

  const eventDateKey = eventRecord.event_date;
  const daysUntil = dayDifference(todayKey, eventDateKey);
  const reminder3DayEnabled = userSettings?.default_reminder_3_day_enabled !== false;
  const reminder1DayEnabled = userSettings?.default_reminder_1_day_enabled !== false;
  const reminderSameDayEnabled = userSettings?.default_reminder_same_day_enabled !== false;
  const types = [];

  if (daysUntil === 3 && reminder3DayEnabled) {
    types.push("reminder_3_day");
  }

  if (daysUntil === 1 && reminder1DayEnabled) {
    types.push("reminder_1_day");
  }

  if (daysUntil === 0 && reminderSameDayEnabled && !isEventFinished(eventRecord, now)) {
    types.push("reminder_same_day");
  }

  return types;
}

function getReminderRecipientsForEvent({ contacts, rsvps }) {
  const rsvpsByContactId = new Map();
  rsvps.forEach((row) => {
    const rows = rsvpsByContactId.get(row.contact_id) || [];
    rows.push(row);
    rsvpsByContactId.set(row.contact_id, rows);
  });

  return contacts.filter((contact) => {
    const contactRsvps = rsvpsByContactId.get(contact.id) || [];
    if (!contactRsvps.length) {
      return true;
    }
    return contactRsvps.some((row) => row.response === "no_response");
  });
}

async function buildReminderDraftJson({ eventRecord, teamContacts, reminderRecipients, eventRsvps, reminderType }) {
  const openaiApiKey = String(process.env.OPENAI_API_KEY || "").trim();

  if (!openaiApiKey) {
    return buildFallbackReminderDraft({
      eventRecord,
      reminderRecipients,
      eventRsvps,
      reminderType,
    });
  }

  try {
    return await requestReminderDraftFromOpenAI({
      openaiApiKey,
      eventRecord,
      teamContacts,
      reminderRecipients,
      eventRsvps,
      reminderType,
    });
  } catch (error) {
    console.warn("[Reminder Scheduler] OpenAI reminder draft failed, using fallback", {
      eventId: eventRecord.id,
      reminderType,
      error,
      message: error?.message || String(error),
    });
    return buildFallbackReminderDraft({
      eventRecord,
      reminderRecipients,
      eventRsvps,
      reminderType,
    });
  }
}

async function requestReminderDraftFromOpenAI({
  openaiApiKey,
  eventRecord,
  teamContacts,
  reminderRecipients,
  eventRsvps,
  reminderType,
}) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You create concise parent-friendly sports team reminder drafts. Return JSON only.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(
                {
                  reminderType,
                  event: {
                    title: eventRecord.event_title,
                    type: eventRecord.event_type,
                    date: eventRecord.event_date,
                    startTime: eventRecord.start_time || null,
                    endTime: eventRecord.end_time || null,
                    location: eventRecord.location || null,
                    notes: eventRecord.notes || null,
                  },
                  teamContactCount: teamContacts.length,
                  reminderRecipientCount: reminderRecipients.length,
                  rsvpSummary: summariseRsvps(eventRsvps),
                  requirements: [
                    "Return a reminder draft only, not a new event.",
                    "Make the reminder sound parent-friendly and practical.",
                    "Include the event title, date, time, location, and a clear RSVP call to action.",
                    "If RSVP responses exist, mention the current attendance summary briefly.",
                    "Set recipients.suggested_group to non_responders.",
                    "Set rsvp.rsvp_required to true.",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "scheduled_reminder_draft",
          strict: true,
          schema: reminderDraftSchema,
        },
      },
    }),
  });

  if (!apiResponse.ok) {
    throw new Error(`OpenAI request failed: ${await apiResponse.text()}`);
  }

  const responseJson = await apiResponse.json();
  const outputText = extractOutputText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI did not return reminder draft text.");
  }

  return JSON.parse(outputText);
}

function buildFallbackReminderDraft({ eventRecord, reminderRecipients, eventRsvps, reminderType }) {
  const summary = summariseRsvps(eventRsvps);
  const timingLabel = formatReminderTypeLabel(reminderType);
  const bodyLines = [
    `Just a reminder about ${eventRecord.event_title}.`,
    "",
    `Date: ${eventRecord.event_date || "To be confirmed"}`,
    `Time: ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed"}`,
    `Location: ${eventRecord.location || "To be confirmed"}`,
    eventRecord.notes ? `Notes: ${eventRecord.notes}` : null,
    "",
    `Current RSVP summary: ${summary.yes} yes, ${summary.no} no, ${summary.maybe} maybe, ${summary.no_response} no response.`,
    "Please use the RSVP link in this reminder to confirm availability.",
  ].filter(Boolean);

  return {
    intent_type: "send_reminder",
    confidence: 0.72,
    event_action: {
      create_new_event: false,
      update_existing_event: false,
      cancel_existing_event: false,
      suggested_event_title: eventRecord.event_title || "",
      event_type: eventRecord.event_type || "other",
      event_date: eventRecord.event_date || null,
      start_time: eventRecord.start_time || null,
      end_time: eventRecord.end_time || null,
      location: eventRecord.location || null,
      notes: eventRecord.notes || "",
    },
    message: {
      email_subject: `${eventRecord.event_title} reminder (${timingLabel})`,
      email_body: bodyLines.join("\n"),
      sms_body: `${eventRecord.event_title} reminder: ${eventRecord.event_date || "Date TBC"}${eventRecord.start_time ? ` ${eventRecord.start_time}` : ""}${eventRecord.location ? `, ${eventRecord.location}` : ""}. Please RSVP.`,
    },
    rsvp: {
      rsvp_required: true,
      suggested_deadline: eventRecord.event_date || null,
    },
    recipients: {
      suggested_group: reminderRecipients.length ? "non_responders" : "all_contacts",
    },
    follow_up: {
      reminder_recommended: false,
      suggested_reminder_timing: null,
    },
    missing_information: [],
  };
}

async function notifyAdminForReminderDraft({ adminConfig, draftRow, eventRecord, teamName, teamContacts, eventRsvps }) {
  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[Reminder Scheduler] Admin review email skipped because Resend is not fully configured", {
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
    console.warn("[Reminder Scheduler] Admin review email skipped because no owner email was found", {
      eventId: eventRecord.id,
      draftId: draftRow.id,
      userId: eventRecord.user_id,
    });
    return { notified: false };
  }

  const baseUrl = buildAppBaseUrl();
  const reviewUrl = buildReminderReviewLink({ baseUrl, eventId: eventRecord.id, draftId: draftRow.id });
  const sendNowUrl = buildReminderReviewLink({
    baseUrl,
    eventId: eventRecord.id,
    draftId: draftRow.id,
    draftAction: "send",
  });
  const dismissUrl = buildReminderReviewLink({
    baseUrl,
    eventId: eventRecord.id,
    draftId: draftRow.id,
    draftAction: "dismiss",
  });
  const recipientContacts = getReminderRecipientsForEvent({ contacts: teamContacts, rsvps: eventRsvps });
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
      subject: `Review reminder draft: ${teamName || "TeamPro team"} - ${eventRecord.event_title}`,
      text: buildAdminReminderEmailText({
        draftRow,
        eventRecord,
        teamName,
        recipientContacts,
        summary,
        reviewUrl,
        sendNowUrl,
        dismissUrl,
      }),
      html: buildAdminReminderEmailHtml({
        draftRow,
        eventRecord,
        teamName,
        recipientContacts,
        summary,
        reviewUrl,
        sendNowUrl,
        dismissUrl,
      }),
    }),
  });

  if (!resendResponse.ok) {
    throw new Error(`Resend request failed: ${await resendResponse.text()}`);
  }

  const resendJson = await resendResponse.json().catch(() => ({}));
  console.info("[Reminder Scheduler] Admin review email sent", {
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
      subject: `Review reminder draft: ${teamName || "TeamPro team"} - ${eventRecord.event_title}`,
      message_text: draftRow.draft_json?.message?.email_body || "",
    },
  });

  return { notified: true };
}

function buildAdminReminderEmailText({ draftRow, eventRecord, teamName, recipientContacts, summary, reviewUrl, sendNowUrl, dismissUrl }) {
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
    "A TeamPro reminder draft is ready for review.",
    "Nothing has been sent to team members yet.",
    "",
    `Team: ${teamName || "TeamPro team"}`,
    `Event: ${eventRecord.event_title}`,
    `Date: ${eventRecord.event_date || "To be confirmed"}`,
    `Time: ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed"}`,
    `Location: ${eventRecord.location || "To be confirmed"}`,
    `Reminder type: ${formatReminderTypeLabel(draftRow.reminder_type)}`,
    `Proposed recipients: ${recipientContacts.length}`,
    `RSVP summary: ${summary.yes} yes, ${summary.no} no, ${summary.maybe} maybe, ${summary.no_response} no response`,
    "",
    "Proposed recipients:",
    recipientPreview,
    "",
    draftRow.draft_json?.message?.email_body || "",
    "",
    `Review & Send: ${reviewUrl}`,
    `Accept & Send now: ${sendNowUrl}`,
    `Dismiss: ${dismissUrl}`,
  ].join("\n");
}

function buildAdminReminderEmailHtml({ draftRow, eventRecord, teamName, recipientContacts, summary, reviewUrl, sendNowUrl, dismissUrl }) {
  const recipientPreview = recipientContacts.length
    ? recipientContacts
        .slice(0, 8)
        .map((contact) => {
          const linked = Array.isArray(contact.linked_players) && contact.linked_players.length
            ? ` <span style="color:#6b7280;">(${escapeHtml(contact.linked_players.join(", "))})</span>`
            : "";
          const email = contact.email ? ` <span style="color:#6b7280;">&lt;${escapeHtml(contact.email)}&gt;</span>` : "";
          return `<li><strong>${escapeHtml(contact.contact_name || "Contact")}</strong>${linked}${email}</li>`;
        })
        .join("")
    : "<li>No recipients suggested</li>";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">Reminder draft ready for review</h2>
      <p style="margin-top:0;color:#4b5563;">Nothing has been sent to team members yet. Review the draft first, then approve it from TeamPro.</p>
      <p><strong>Team:</strong> ${escapeHtml(teamName || "TeamPro team")}</p>
      <p><strong>Event:</strong> ${escapeHtml(eventRecord.event_title || "Untitled event")}</p>
      <p><strong>Date:</strong> ${escapeHtml(eventRecord.event_date || "To be confirmed")}</p>
      <p><strong>Time:</strong> ${escapeHtml(formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) || "To be confirmed")}</p>
      <p><strong>Location:</strong> ${escapeHtml(eventRecord.location || "To be confirmed")}</p>
      <p><strong>Reminder type:</strong> ${escapeHtml(formatReminderTypeLabel(draftRow.reminder_type))}</p>
      <p><strong>Proposed recipients:</strong> ${recipientContacts.length}</p>
      <p><strong>RSVP summary:</strong> ${summary.yes} yes, ${summary.no} no, ${summary.maybe} maybe, ${summary.no_response} no response</p>
      <div style="margin:14px 0;">
        <strong>Proposed recipients</strong>
        <ul style="margin:8px 0 0 18px;padding:0;">${recipientPreview}</ul>
      </div>
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(draftRow.draft_json?.message?.email_body || "")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:18px;">
        <a href="${reviewUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#b69258;color:#111827;text-decoration:none;font-weight:700;">Review &amp; Send</a>
        <a href="${sendNowUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#1f7a45;color:#ffffff;text-decoration:none;font-weight:700;">Accept &amp; Send</a>
        <a href="${dismissUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#e5e7eb;color:#111827;text-decoration:none;font-weight:700;">Dismiss</a>
      </div>
    </div>
  `;
}

function buildScheduledDraftPrompt(eventRecord, reminderType) {
  return `Automatic ${formatReminderTypeLabel(reminderType)} reminder draft for ${eventRecord.event_title}`;
}

function buildScheduledReminderTimestamp(eventRecord, reminderType) {
  const dateOffset = reminderType === "reminder_3_day" ? 3 : reminderType === "reminder_1_day" ? 1 : 0;
  const baseDate = new Date(`${eventRecord.event_date}T${eventRecord.start_time || "09:00"}:00`);
  if (Number.isNaN(baseDate.getTime())) {
    return new Date().toISOString();
  }
  baseDate.setDate(baseDate.getDate() - dateOffset);
  return baseDate.toISOString();
}

function buildAppBaseUrl() {
  return buildRsvpBaseUrl(process.env.TEAMPRO_APP_BASE_URL || "https://www.teampro.co.nz");
}

function buildReminderReviewLink({ baseUrl, eventId, draftId, draftAction = "" }) {
  const url = new URL(buildAppBaseUrl(baseUrl));
  url.searchParams.set("page", "comms");
  url.searchParams.set("eventId", eventId);
  url.searchParams.set("draftId", draftId);
  if (draftAction) {
    url.searchParams.set("draftAction", draftAction);
  }
  return url.toString();
}

function groupBy(rows, key) {
  return rows.reduce((accumulator, row) => {
    const groupKey = row?.[key];
    if (!groupKey) {
      return accumulator;
    }
    accumulator[groupKey] = accumulator[groupKey] || [];
    accumulator[groupKey].push(row);
    return accumulator;
  }, {});
}

function summariseRsvps(rsvps) {
  return {
    yes: rsvps.filter((row) => row.response === "yes").length,
    no: rsvps.filter((row) => row.response === "no").length,
    maybe: rsvps.filter((row) => row.response === "maybe").length,
    no_response: rsvps.filter((row) => row.response === "no_response").length,
  };
}

function dateKeyInTimeZone(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDaysToDateKey(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dayDifference(fromDateKey, toDateKey) {
  const from = new Date(`${fromDateKey}T00:00:00Z`);
  const to = new Date(`${toDateKey}T00:00:00Z`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function isEventFinished(eventRecord, now = new Date()) {
  const endDateTime = getEventEndDateTime(eventRecord);
  if (!endDateTime) {
    return false;
  }
  return endDateTime.getTime() < now.getTime();
}

function getEventEndDateTime(eventRecord) {
  if (!eventRecord?.event_date) {
    return null;
  }
  const timeValue = eventRecord.end_time || eventRecord.start_time || "23:59";
  const parsed = new Date(`${eventRecord.event_date}T${timeValue}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
  return startTime || endTime || "";
}

function extractOutputText(responseJson) {
  if (!responseJson || typeof responseJson !== "object") {
    return "";
  }

  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  const outputs = Array.isArray(responseJson.output) ? responseJson.output : [];
  for (const output of outputs) {
    const content = Array.isArray(output?.content) ? output.content : [];
    for (const item of content) {
      if (item?.type === "output_text" && typeof item.text === "string" && item.text.trim()) {
        return item.text.trim();
      }
    }
  }

  return "";
}
