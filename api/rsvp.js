const {
  assertSupabaseAdminConfig,
  escapeHtml,
  fetchAdminUserById,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
} = require("./_supabase-admin");

const RSVP_TABLE_NAME = "event_rsvps";

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  try {
    const adminConfig = getSupabaseAdminConfig();
    assertSupabaseAdminConfig(adminConfig);

    if (request.method === "GET") {
      const token = String(request.query?.token || "").trim();

      if (!token) {
        response.status(400).json({ error: "token is required." });
        return;
      }

      const detail = await getRsvpDetail({ adminConfig, token });

      if (!detail) {
        response.status(404).json({ error: "RSVP link not found." });
        return;
      }

      if (detail.token_expires_at && new Date(detail.token_expires_at).getTime() < Date.now()) {
        response.status(410).json({ error: "This RSVP link has expired." });
        return;
      }

      response.status(200).json({
        ok: true,
        rsvp: detail,
      });
      return;
    }

    if (request.method === "POST") {
      const payload = request.body || {};
      const token = String(payload.token || "").trim();
      const responseValue = String(payload.response || "").trim();
      const responseNote = String(payload.responseNote || "").trim();
      const accessToken = String(payload.accessToken || "").trim();

      if (!token || !["yes", "no", "maybe", "no_response"].includes(responseValue)) {
        response.status(400).json({
          error: "token and a valid response are required.",
        });
        return;
      }

      const detail = await getRsvpDetail({ adminConfig, token });

      if (!detail) {
        response.status(404).json({ error: "RSVP link not found." });
        return;
      }

      if (detail.token_expires_at && new Date(detail.token_expires_at).getTime() < Date.now()) {
        response.status(410).json({ error: "This RSVP link has expired." });
        return;
      }

      const isPublicUpdate = !accessToken;

      if (!isPublicUpdate) {
        const user = await fetchAuthenticatedUser({
          supabaseUrl: adminConfig.supabaseUrl,
          supabaseAnonKey: adminConfig.supabaseAnonKey,
          accessToken,
        });

        if (user.id !== detail.user_id) {
          response.status(403).json({ error: "You cannot update another user’s RSVP data." });
          return;
        }
      }

      const updatedRows = await supabaseAdminRequest({
        supabaseUrl: adminConfig.supabaseUrl,
        serviceRoleKey: adminConfig.serviceRoleKey,
        tableName: RSVP_TABLE_NAME,
        method: "PATCH",
        query: {
          id: `eq.${detail.id}`,
          select: "*",
        },
        headers: {
          Prefer: "return=representation",
        },
        body: {
          response: responseValue,
          response_note: responseNote || null,
          responded_at: responseValue === "no_response" ? null : new Date().toISOString(),
        },
      });

      const updatedRsvp = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

      if (responseValue !== "no_response") {
        void notifyOwnerOfRsvpResponse({
          adminConfig,
          detail,
          updatedRsvp,
        }).catch((error) => {
          console.warn("[RSVP] Owner notification failed", {
            error,
            message: error?.message || String(error),
            rsvpId: detail.id,
            ownerUserId: detail.user_id,
          });
        });
      }

      response.status(200).json({
        ok: true,
        rsvp: updatedRsvp,
      });
      return;
    }

    response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("[RSVP] Request failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(500).json({
      error: error?.message || "RSVP request failed.",
    });
  }
};

async function notifyOwnerOfRsvpResponse({ adminConfig, detail, updatedRsvp }) {
  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[RSVP] Owner notification skipped because Resend is not fully configured", {
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
    });
    return;
  }

  const ownerUser = await fetchAdminUserById({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    userId: detail.user_id,
  });

  const ownerEmail = String(ownerUser?.email || "").trim();

  if (!ownerEmail) {
    console.warn("[RSVP] Owner notification skipped because the signed-in user has no email address", {
      ownerUserId: detail.user_id,
      rsvpId: detail.id,
    });
    return;
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [ownerEmail],
      subject: buildOwnerNotificationSubject(detail),
      text: buildOwnerNotificationText(detail, updatedRsvp),
      html: buildOwnerNotificationHtml(detail, updatedRsvp),
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    throw new Error(`Resend request failed: ${errorText}`);
  }

  const resendJson = await resendResponse.json().catch(() => ({}));
  console.info("[RSVP] Owner notification sent", {
    ownerUserId: detail.user_id,
    ownerEmail,
    rsvpId: detail.id,
    resendId: resendJson?.id || null,
    response: updatedRsvp?.response || detail.response,
  });
}

async function getRsvpDetail({ adminConfig, token }) {
  const rows = await supabaseAdminRequest({
    supabaseUrl: adminConfig.supabaseUrl,
    serviceRoleKey: adminConfig.serviceRoleKey,
    tableName: RSVP_TABLE_NAME,
    query: {
      select: [
        "id",
        "user_id",
        "team_id",
        "event_id",
        "contact_id",
        "player_name",
        "response",
        "response_note",
        "token",
        "token_expires_at",
        "responded_at",
        "created_at",
        "updated_at",
        "team:teams(id,team_name)",
        "event:team_events(id,event_title,event_type,event_date,start_time,end_time,location,notes,status)",
        "contact:team_contacts(id,contact_name,email,phone,role)",
      ].join(","),
      token: `eq.${token}`,
      limit: "1",
    },
  });

  const row = Array.isArray(rows) ? rows[0] : rows;

  if (!row) {
    return null;
  }

  return {
    ...row,
    team_name: row.team?.team_name || "",
    event_title: row.event?.event_title || "",
    event_type: row.event?.event_type || "other",
    event_date: row.event?.event_date || "",
    start_time: row.event?.start_time || "",
    end_time: row.event?.end_time || "",
    location: row.event?.location || "",
    event_notes: row.event?.notes || "",
    contact_name: row.contact?.contact_name || "",
    contact_email: row.contact?.email || "",
    contact_phone: row.contact?.phone || "",
  };
}

function buildOwnerNotificationSubject(detail) {
  return `${detail.contact_name || "A contact"} responded to ${detail.event_title || "your event"}`;
}

function buildOwnerNotificationText(detail, updatedRsvp) {
  const responseLabel = formatResponseLabel(updatedRsvp?.response || detail.response);
  const note = String(updatedRsvp?.response_note || detail.response_note || "").trim();

  return [
    "A TeamPro RSVP has been updated.",
    "",
    `Contact: ${detail.contact_name || "Unknown contact"}`,
    detail.player_name ? `Linked player: ${detail.player_name}` : null,
    `Response: ${responseLabel}`,
    `Event: ${detail.event_title || "Untitled event"}`,
    `Date: ${detail.event_date || "To be confirmed"}`,
    `Time: ${buildEventTiming(detail) || "To be confirmed"}`,
    `Location: ${detail.location || "To be confirmed"}`,
    note ? `Note: ${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildOwnerNotificationHtml(detail, updatedRsvp) {
  const responseLabel = formatResponseLabel(updatedRsvp?.response || detail.response);
  const note = String(updatedRsvp?.response_note || detail.response_note || "").trim();

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">A TeamPro RSVP has been updated</h2>
      <p><strong>Contact:</strong> ${escapeHtml(detail.contact_name || "Unknown contact")}</p>
      ${detail.player_name ? `<p><strong>Linked player:</strong> ${escapeHtml(detail.player_name)}</p>` : ""}
      <p><strong>Response:</strong> ${escapeHtml(responseLabel)}</p>
      <p><strong>Event:</strong> ${escapeHtml(detail.event_title || "Untitled event")}</p>
      <p><strong>Date:</strong> ${escapeHtml(detail.event_date || "To be confirmed")}</p>
      <p><strong>Time:</strong> ${escapeHtml(buildEventTiming(detail) || "To be confirmed")}</p>
      <p><strong>Location:</strong> ${escapeHtml(detail.location || "To be confirmed")}</p>
      ${note ? `<p><strong>Note:</strong></p><div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(note)}</div>` : ""}
    </div>
  `;
}

function buildEventTiming(detail) {
  const start = String(detail.start_time || "").trim();
  const end = String(detail.end_time || "").trim();

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "";
}

function formatResponseLabel(value) {
  switch (String(value || "").trim()) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    case "maybe":
      return "Maybe";
    default:
      return "No response";
  }
}
