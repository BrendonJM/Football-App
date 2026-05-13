const {
  assertSupabaseAdminConfig,
  buildRsvpBaseUrl,
  buildRsvpLink,
  buildTokenExpiry,
  createSecureToken,
  escapeHtml,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
} = require("./_supabase-admin");

const RSVP_TABLE_NAME = "event_rsvps";
const EVENTS_TABLE_NAME = "team_events";
const CONTACTS_TABLE_NAME = "team_contacts";
const TEAMS_TABLE_NAME = "teams";

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

  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();
  const adminConfig = getSupabaseAdminConfig();
  const payload = request.body || {};
  const accessToken = String(payload.accessToken || "").trim();
  const eventId = String(payload.eventId || "").trim();
  const teamId = String(payload.teamId || "").trim();
  const baseUrl = buildRsvpBaseUrl(payload.baseUrl);
  const messageText = String(payload.messageText || "").trim();
  const contactIds = Array.isArray(payload.contactIds)
    ? payload.contactIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  if (!accessToken || !eventId || !teamId || !messageText) {
    response.status(400).json({
      error: "accessToken, eventId, teamId, and messageText are required.",
    });
    return;
  }

  if (!contactIds.length) {
    response.status(400).json({
      error: "Select at least one contact before sending an update.",
    });
    return;
  }

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[Updates] Resend is not fully configured", {
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
    });
    response.status(200).json({
      ok: true,
      sent: false,
      warning: "Email sending is not configured yet. The message preview is ready to copy instead.",
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

    const teamRows = await supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: TEAMS_TABLE_NAME,
      query: {
        select: "id,team_name,user_id",
        id: `eq.${teamId}`,
        user_id: `eq.${user.id}`,
      },
    });

    const eventRows = await supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: EVENTS_TABLE_NAME,
      query: {
        select: "*",
        id: `eq.${eventId}`,
        team_id: `eq.${teamId}`,
        user_id: `eq.${user.id}`,
      },
    });

    const contactRows = await supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: CONTACTS_TABLE_NAME,
      query: {
        select: "*",
        team_id: `eq.${teamId}`,
        user_id: `eq.${user.id}`,
        id: `in.(${contactIds.join(",")})`,
      },
    });

    const teamRecord = Array.isArray(teamRows) ? teamRows[0] : null;
    const eventRecord = Array.isArray(eventRows) ? eventRows[0] : null;

    if (!teamRecord || !eventRecord) {
      response.status(404).json({ error: "The team or event could not be found for this account." });
      return;
    }

    const selectedContacts = Array.isArray(contactRows) ? contactRows : [];
    const emailContacts = selectedContacts.filter((contact) => String(contact.email || "").trim());

    if (!emailContacts.length) {
      response.status(400).json({
        error: "Select at least one contact with an email address.",
      });
      return;
    }

    const existingRsvpRows = await supabaseAdminRequest({
      supabaseUrl: adminConfig.supabaseUrl,
      serviceRoleKey: adminConfig.serviceRoleKey,
      tableName: RSVP_TABLE_NAME,
      query: {
        select: "*",
        event_id: `eq.${eventId}`,
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
              user_id: user.id,
              team_id: teamId,
              event_id: eventId,
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

    const rsvpsByContactId = groupRowsByContactId(rsvpRows);
    const subject = buildSubject(teamRecord.team_name || payload.teamName || "TeamPro", eventRecord);
    const sendResults = [];

    for (const contact of emailContacts) {
      const rowsForContact = rsvpsByContactId[contact.id] || [];
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
            teamName: teamRecord.team_name || payload.teamName || "TeamPro",
            eventRecord,
            contact,
            messageText,
            rsvpRows: rowsForContact,
            baseUrl,
          }),
          html: buildUpdateHtml({
            teamName: teamRecord.team_name || payload.teamName || "TeamPro",
            eventRecord,
            contact,
            messageText,
            rsvpRows: rowsForContact,
            baseUrl,
          }),
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(`Resend request failed: ${errorText}`);
      }

      const resendJson = await resendResponse.json();
      sendResults.push({
        contactId: contact.id,
        email: contact.email,
        resendId: resendJson.id || null,
      });
    }

    response.status(200).json({
      ok: true,
      sent: true,
      subject,
      recipientCount: emailContacts.length,
      rsvps: rsvpRows,
      sendResults,
    });
  } catch (error) {
    console.error("[Updates] Email send failed", {
      error,
      message: error?.message || String(error),
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
      hasServiceRole: Boolean(adminConfig.serviceRoleKey),
    });
    response.status(500).json({
      error: error?.message || "Event update email failed to send.",
    });
  }
};

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

function buildSubject(teamName, eventRecord) {
  return `${teamName} update: ${eventRecord.event_title}`;
}

function buildUpdateText({ teamName, eventRecord, contact, messageText, rsvpRows, baseUrl }) {
  const lines = [
    `${teamName} update`,
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
    `Hello ${contact.contact_name || "there"}, you can RSVP without logging in:`,
  ].filter(Boolean);

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
  return lines.join("\n");
}

function buildUpdateHtml({ teamName, eventRecord, contact, messageText, rsvpRows, baseUrl }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(teamName)} update</h2>
      <p>Hello ${escapeHtml(contact.contact_name || "there")},</p>
      <p><strong>Event:</strong> ${escapeHtml(String(eventRecord.event_title || ""))}</p>
      ${eventRecord.event_type ? `<p><strong>Type:</strong> ${escapeHtml(formatEventTypeLabel(String(eventRecord.event_type || "")))}</p>` : ""}
      ${eventRecord.event_date ? `<p><strong>Date:</strong> ${escapeHtml(String(eventRecord.event_date))}</p>` : ""}
      ${formatEventTimeRange(eventRecord.start_time, eventRecord.end_time) ? `<p><strong>Time:</strong> ${escapeHtml(formatEventTimeRange(eventRecord.start_time, eventRecord.end_time))}</p>` : ""}
      ${eventRecord.location ? `<p><strong>Location:</strong> ${escapeHtml(String(eventRecord.location))}</p>` : ""}
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(messageText)}</div>
      <div style="margin-top: 20px;">
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
      </div>
    </div>
  `;
}

function formatEventTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }

  return startTime || "";
}

function formatEventTypeLabel(eventType) {
  return {
    training: "Training",
    game: "Game",
    tournament: "Tournament",
    other: "Other",
  }[eventType] || "Other";
}
