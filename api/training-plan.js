const trainingPlanSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    ageRange: { type: "string" },
    focusArea: { type: "string" },
    totalMinutes: { type: "integer" },
    sessionGoals: {
      type: "array",
      items: { type: "string" },
    },
    equipment: {
      type: "array",
      items: { type: "string" },
    },
    blocks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          durationMinutes: { type: "integer" },
          purpose: { type: "string" },
          setup: { type: "string" },
          coachingPoints: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "title",
          "durationMinutes",
          "purpose",
          "setup",
          "coachingPoints",
        ],
      },
    },
    coachReminder: { type: "string" },
  },
  required: [
    "title",
    "summary",
    "ageRange",
    "focusArea",
    "totalMinutes",
    "sessionGoals",
    "equipment",
    "blocks",
    "coachReminder",
  ],
};

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const openaiApiKey = process.env.OPENAI_API_KEY || "";

  if (!openaiApiKey) {
    response.status(500).json({
      error: "OPENAI_API_KEY is not configured yet for training plan generation.",
    });
    return;
  }

  try {
    const payload = request.body || {};

    if (!payload.teamName || !payload.playersOnField || !payload.focusArea || !payload.ageRange) {
      response.status(400).json({
        error: "teamName, playersOnField, focusArea, and ageRange are required fields.",
      });
      return;
    }

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
                  "You are an experienced grassroots football coach educator. Create safe, age-appropriate one-hour football training plans that follow best practice, include a warm-up, and are practical for volunteer coaches. Return JSON only.",
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
                    teamName: String(payload.teamName),
                    playersOnField: Number(payload.playersOnField),
                    ageRange: String(payload.ageRange),
                    focusArea: String(payload.focusArea),
                    formation: String(payload.formation || ""),
                    squadSize: Number(payload.squadSize || 0),
                    variationSeed: String(payload.variationSeed || ""),
                    previousPlanTitle: String(payload.previousPlanTitle || ""),
                    requirements: [
                      "Create a football training plan that totals exactly 60 minutes.",
                      "Include a warm-up inside that 60-minute total.",
                      "Theme the session clearly around the chosen focus area.",
                      "Make the practices age-appropriate for the supplied age range.",
                      "Return 4 or 5 session blocks with exact durationMinutes values.",
                      "Vary the plan when a previous title is provided so the coach gets a fresh option.",
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
            name: "training_plan",
            strict: true,
            schema: trainingPlanSchema,
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
      throw new Error("OpenAI did not return structured training plan text.");
    }

    response.status(200).json(JSON.parse(outputText));
  } catch (error) {
    console.error("[Training] Plan generation failed", {
      error,
      message: error?.message || String(error),
    });
    response.status(500).json({
      error: error?.message || "Training plan request failed.",
    });
  }
};

function extractOutputText(responseJson) {
  return (responseJson.output || [])
    .flatMap((item) => item.content || [])
    .filter((contentItem) => contentItem.type === "output_text")
    .map((contentItem) => contentItem.text || "")
    .join("")
    .trim();
}
