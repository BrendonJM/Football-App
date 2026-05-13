const {
  assertSupabaseAdminConfig,
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

      response.status(200).json({
        ok: true,
        rsvp: Array.isArray(updatedRows) ? updatedRows[0] : updatedRows,
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
        "event:team_events(id,event_title,event_date,event_time,location,notes,status)",
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
    event_date: row.event?.event_date || "",
    event_time: row.event?.event_time || "",
    location: row.event?.location || "",
    event_notes: row.event?.notes || "",
    contact_name: row.contact?.contact_name || "",
    contact_email: row.contact?.email || "",
  };
}
