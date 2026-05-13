const {
  assertSupabaseAdminConfig,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
} = require("../_supabase-admin");

const DRAFTS_TABLE_NAME = "ai_communication_drafts";
const TEAMS_TABLE_NAME = "teams";

const communicationDraftSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intent_type: {
      type: "string",
      enum: ["create_event", "update_event", "cancel_event", "send_reminder", "general_update"],
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
          enum: [
            "all_contacts",
            "non_responders",
            "available_players",
            "unavailable_players",
            "custom",
          ],
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

  const openaiApiKey = String(process.env.OPENAI_API_KEY || "").trim();
  const adminConfig = getSupabaseAdminConfig();

  if (!openaiApiKey) {
    response.status(500).json({
      error: "OPENAI_API_KEY is not configured yet for AI communication drafts.",
    });
    return;
  }

  try {
    assertSupabaseAdminConfig(adminConfig);

    const payload = request.body || {};
    const accessToken = String(payload.accessToken || "").trim();
    const teamId = String(payload.teamId || "").trim();
    const instruction = String(payload.instruction || "").trim();
    const teamName = String(payload.teamName || "").trim();

    if (!accessToken || !teamId || !instruction) {
      response.status(400).json({
        error: "accessToken, teamId, and instruction are required.",
      });
      return;
    }

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

    const teamRecord = Array.isArray(teamRows) ? teamRows[0] : null;

    if (!teamRecord) {
      response.status(404).json({
        error: "The selected team could not be found for this account.",
      });
      return;
    }

    const draft = await requestCommunicationDraft({
      openaiApiKey,
      teamName: teamRecord.team_name || teamName || "TeamPro team",
      instruction,
      contacts: Array.isArray(payload.contacts) ? payload.contacts : [],
      upcomingEvents: Array.isArray(payload.upcomingEvents) ? payload.upcomingEvents : [],
      selectedEventId: String(payload.selectedEventId || "").trim() || null,
    });

    const savedDraftRows = await supabaseAdminRequest({
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
        event_id: null,
        raw_prompt: instruction,
        draft_json: draft,
        status: "draft",
      },
    });

    const savedDraft = Array.isArray(savedDraftRows) ? savedDraftRows[0] : savedDraftRows;

    response.status(200).json({
      ok: true,
      draftId: savedDraft?.id || null,
      draft,
    });
  } catch (error) {
    console.error("[AI Draft] Communication draft generation failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(500).json({
      error: error?.message || "AI communication draft generation failed.",
    });
  }
};

async function requestCommunicationDraft({
  openaiApiKey,
  teamName,
  instruction,
  contacts,
  upcomingEvents,
  selectedEventId,
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
              text:
                "You are TeamPro's communication assistant for grassroots sports coaches. Convert a coach's plain-English instruction into a structured draft workflow. Never claim that a message has been sent. If important information is missing, flag it in missing_information. Return JSON only.",
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
                  teamName,
                  instruction,
                  selectedEventId,
                  contactsSummary: contacts,
                  upcomingEvents,
                  requirements: [
                    "Infer the likely communication intent.",
                    "Draft a parent-friendly email body and a concise SMS body.",
                    "If the coach appears to be cancelling or moving an event, note that clearly in event_action and missing_information.",
                    "If the instruction implies an attendance check, set rsvp_required to true.",
                    "Recommend the most sensible recipient group from the allowed enum.",
                    "Use NZ English and practical sideline-coach wording.",
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
          name: "communication_draft",
          strict: true,
          schema: communicationDraftSchema,
        },
      },
    }),
  });

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const responseJson = await apiResponse.json();
  const outputText = extractOutputText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI did not return structured communication draft text.");
  }

  return JSON.parse(outputText);
}

function extractOutputText(responseJson) {
  return (responseJson.output || [])
    .flatMap((item) => item.content || [])
    .filter((contentItem) => contentItem.type === "output_text")
    .map((contentItem) => contentItem.text || "")
    .join("")
    .trim();
}
