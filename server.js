const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const feedbackApiHandler = require("./api/feedback");
const teamUpdateApiHandler = require("./api/team-update");
const rsvpApiHandler = require("./api/rsvp");
const aiCommunicationDraftApiHandler = require("./api/ai/communication-draft");

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const RESEND_FROM_EMAIL = String(process.env.RESEND_FROM_EMAIL || "").trim();
const FEEDBACK_TO_EMAIL = "brendonjmoore@gmail.com";
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const assessmentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    overview: { type: "string" },
    relevance: { type: "string" },
    criteriaAssessments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          criterion: { type: "string" },
          status: {
            type: "string",
            enum: [
              "Evidenced",
              "Partially evidenced",
              "Not evidenced",
              "Needs review",
            ],
          },
          evidence: { type: "string" },
        },
        required: ["criterion", "status", "evidence"],
      },
    },
    findings: {
      type: "array",
      items: { type: "string" },
    },
    gaps: {
      type: "array",
      items: { type: "string" },
    },
    source: { type: "string" },
  },
  required: [
    "title",
    "overview",
    "relevance",
    "criteriaAssessments",
    "findings",
    "gaps",
    "source",
  ],
};

const quoteExtractionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentName: { type: "string" },
    quoteCount: { type: "integer" },
    overview: { type: "string" },
    quotes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          insurer: { type: "string" },
          premium: { type: "string" },
          excess: { type: "string" },
          coverage: {
            type: "array",
            items: { type: "string" },
          },
          exclusions: {
            type: "array",
            items: { type: "string" },
          },
          notes: { type: "string" },
          evidence: { type: "string" },
        },
        required: [
          "insurer",
          "premium",
          "excess",
          "coverage",
          "exclusions",
          "notes",
          "evidence",
        ],
      },
    },
  },
  required: ["documentName", "quoteCount", "overview", "quotes"],
};

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

const server = http.createServer(async (request, response) => {
  applyCorsHeaders(response);
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (
    request.method === "POST" &&
    requestUrl.pathname === "/api/summarize-document"
  ) {
    await handleAssessmentRequest(request, response);
    return;
  }

  if (
    request.method === "POST" &&
    requestUrl.pathname === "/api/extract-quotes"
  ) {
    await handleQuoteExtractionRequest(request, response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/feedback") {
    await invokeApiHandler(feedbackApiHandler, request, response, requestUrl);
    return;
  }

  if ((request.method === "POST" || request.method === "OPTIONS") && requestUrl.pathname === "/api/team-update") {
    await invokeApiHandler(teamUpdateApiHandler, request, response, requestUrl);
    return;
  }

  if ((request.method === "GET" || request.method === "POST" || request.method === "OPTIONS") && requestUrl.pathname === "/api/rsvp") {
    await invokeApiHandler(rsvpApiHandler, request, response, requestUrl);
    return;
  }

  if ((request.method === "POST" || request.method === "OPTIONS") && requestUrl.pathname === "/api/ai/communication-draft") {
    await invokeApiHandler(aiCommunicationDraftApiHandler, request, response, requestUrl);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/training-plan") {
    await handleTrainingPlanRequest(request, response);
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/config") {
    sendJson(response, 200, {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
    });
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  serveStaticFile(requestUrl.pathname, response);
});

server.listen(PORT, () => {
  console.log(`Football Team Board running at http://localhost:${PORT}`);
});

async function handleAssessmentRequest(request, response) {
  try {
    const payload = await readJsonBody(request);

    if (
      !payload.documentName ||
      !payload.matchTerm ||
      !Array.isArray(payload.complianceCriteria)
    ) {
      sendJson(response, 400, {
        error:
          "documentName, matchTerm, and complianceCriteria are required fields.",
      });
      return;
    }

    if (!OPENAI_API_KEY) {
      sendJson(response, 500, {
        error:
          "OPENAI_API_KEY is not configured. Add it to your server environment before using the assessment route.",
      });
      return;
    }

    const documentText =
      payload.documentText ||
      (await fetchSharePointDocumentText({
        sharepointUrl: payload.sharepointUrl,
        documentType: payload.documentType,
      }));

    const assessment = await requestOpenAIAssessment({
      documentName: payload.documentName,
      sharepointUrl: payload.sharepointUrl,
      matchTerm: payload.matchTerm,
      documentType: payload.documentType || "file",
      complianceCriteria: payload.complianceCriteria,
      documentText,
    });

    sendJson(response, 200, assessment);
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Assessment request failed.",
    });
  }
}

async function handleQuoteExtractionRequest(request, response) {
  try {
    const payload = await readJsonBody(request);

    if (!payload.documentName || (!payload.documentText && !payload.pdfBase64)) {
      sendJson(response, 400, {
        error: "documentName and either documentText or pdfBase64 are required fields.",
      });
      return;
    }

    const documentText =
      payload.documentText ||
      extractPdfTextFromBase64({
        documentName: payload.documentName,
        pdfBase64: payload.pdfBase64,
      });

    const extraction = OPENAI_API_KEY
      ? await requestQuoteExtraction({
          documentName: payload.documentName,
          documentText,
          documentType: payload.documentType || "pdf",
        })
      : buildHeuristicQuoteExtraction({
          documentName: payload.documentName,
          documentText,
          documentType: payload.documentType || "pdf",
        });

    sendJson(response, 200, extraction);
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Quote extraction request failed.",
    });
  }
}

async function handleFeedbackRequest(request, response) {
  try {
    const payload = await readJsonBody(request);
    const message = String(payload.message || "").trim();
    const userEmail = String(payload.userEmail || "").trim();
    const page = String(payload.page || "").trim();
    const appName = String(payload.app || "TeamPro").trim();

    if (!message) {
      sendJson(response, 400, {
        error: "Feedback message is required.",
      });
      return;
    }

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      console.warn("[Feedback] Resend is not fully configured", {
        hasApiKey: Boolean(RESEND_API_KEY),
        hasFromEmail: Boolean(RESEND_FROM_EMAIL),
      });
      sendJson(response, 500, {
        error: "Email sending is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL for TeamPro email sending.",
      });
      return;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [FEEDBACK_TO_EMAIL],
        subject: `${appName} feedback`,
        text: buildFeedbackText({ message, userEmail, page, appName }),
        html: buildFeedbackHtml({ message, userEmail, page, appName }),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend request failed: ${errorText}`);
    }

    const resendJson = await resendResponse.json();
    sendJson(response, 200, {
      ok: true,
      id: resendJson.id || null,
    });
  } catch (error) {
    console.error("[Feedback] Email send failed", {
      error,
      message: error.message || String(error),
      hasApiKey: Boolean(RESEND_API_KEY),
      fromEmail: RESEND_FROM_EMAIL || null,
    });
    sendJson(response, 500, {
      error: error.message || "Feedback email failed to send.",
    });
  }
}

async function handleTrainingPlanRequest(request, response) {
  try {
    const payload = await readJsonBody(request);

    if (!payload.teamName || !payload.playersOnField || !payload.focusArea || !payload.ageRange) {
      sendJson(response, 400, {
        error: "teamName, playersOnField, focusArea, and ageRange are required fields.",
      });
      return;
    }

    if (!OPENAI_API_KEY) {
      sendJson(response, 500, {
        error: "OPENAI_API_KEY is not configured yet for training plan generation.",
      });
      return;
    }

    const plan = await requestTrainingPlan({
      teamName: String(payload.teamName),
      playersOnField: Number(payload.playersOnField),
      ageRange: String(payload.ageRange),
      focusArea: String(payload.focusArea),
      formation: String(payload.formation || ""),
      squadSize: Number(payload.squadSize || 0),
      variationSeed: String(payload.variationSeed || ""),
      previousPlanTitle: String(payload.previousPlanTitle || ""),
    });

    sendJson(response, 200, plan);
  } catch (error) {
    console.error("[Training] Plan generation failed", {
      error,
      message: error?.message || String(error),
    });
    sendJson(response, 500, {
      error: error?.message || "Training plan request failed.",
    });
  }
}

async function handleTeamUpdateRequest(request, response) {
  try {
    const payload = await readJsonBody(request);
    const teamName = String(payload.teamName || "TeamPro").trim();
    const messageText = String(payload.messageText || "").trim();
    const eventRecord = payload.event || {};
    const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
    const emailRecipients = recipients
      .map((recipient) => ({
        name: String(recipient.name || "").trim(),
        email: String(recipient.email || "").trim(),
      }))
      .filter((recipient) => recipient.email);

    if (!eventRecord.eventTitle || !messageText) {
      sendJson(response, 400, {
        error: "event and messageText are required.",
      });
      return;
    }

    if (!emailRecipients.length) {
      sendJson(response, 400, {
        error: "Select at least one contact with an email address.",
      });
      return;
    }

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      console.warn("[Updates] Resend is not fully configured", {
        hasApiKey: Boolean(RESEND_API_KEY),
        hasFromEmail: Boolean(RESEND_FROM_EMAIL),
      });
      sendJson(response, 200, {
        ok: true,
        sent: false,
        warning: "Email sending is not configured yet. The message preview is ready to copy instead.",
        subject: buildTeamUpdateSubject(teamName, eventRecord),
      });
      return;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: emailRecipients.map((recipient) => recipient.email),
        subject: buildTeamUpdateSubject(teamName, eventRecord),
        text: messageText,
        html: buildTeamUpdateHtml({
          teamName,
          eventRecord,
          messageText,
        }),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend request failed: ${errorText}`);
    }

    const resendJson = await resendResponse.json();
    sendJson(response, 200, {
      ok: true,
      sent: true,
      id: resendJson.id || null,
      subject: buildTeamUpdateSubject(teamName, eventRecord),
    });
  } catch (error) {
    console.error("[Updates] Email send failed", {
      error,
      message: error?.message || String(error),
      hasApiKey: Boolean(RESEND_API_KEY),
      fromEmail: RESEND_FROM_EMAIL || null,
    });
    sendJson(response, 500, {
      error: error?.message || "Event update email failed to send.",
    });
  }
}

async function requestOpenAIAssessment({
  documentName,
  sharepointUrl,
  matchTerm,
  documentType,
  complianceCriteria,
  documentText,
}) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are an insurance broker compliance reviewer. Assess the supplied document conservatively against the criteria. Use only evidence from the supplied text. Return JSON only.",
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
                  documentName,
                  sharepointUrl: sharepointUrl || "Not provided",
                  matchTerm,
                  documentType,
                  complianceCriteria,
                  documentText,
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
          name: "compliance_assessment",
          strict: true,
          schema: assessmentSchema,
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
    throw new Error("OpenAI did not return structured assessment text.");
  }

  return JSON.parse(outputText);
}

async function requestQuoteExtraction({
  documentName,
  documentText,
  documentType,
}) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You extract insurer quotes from a single insurance document. Detect when one document contains multiple quotes. Use only evidence in the supplied text. Return JSON only.",
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
                  documentName,
                  documentType,
                  task:
                    "Identify every distinct insurer quote in this document. If several quotes appear in one PDF, return each of them separately.",
                  standardCriteria: ["What is covered", "Cost"],
                  documentText,
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
          name: "quote_extraction",
          strict: true,
          schema: quoteExtractionSchema,
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
    throw new Error("OpenAI did not return structured quote extraction text.");
  }

  return JSON.parse(outputText);
}

async function requestTrainingPlan({
  teamName,
  playersOnField,
  ageRange,
  focusArea,
  formation,
  squadSize,
  variationSeed,
  previousPlanTitle,
}) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
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
                  teamName,
                  playersOnField,
                  ageRange,
                  focusArea,
                  formation: formation || "Not specified",
                  squadSize,
                  variationSeed,
                  previousPlanTitle: previousPlanTitle || "None",
                  requirements: [
                    "Create a football training plan that totals exactly 60 minutes.",
                    "Include a warm-up inside that 60-minute total.",
                    "Theme the session clearly around the chosen focus area.",
                    "If the focus area is Mixed, blend 2 or 3 complementary themes across the session rather than sticking to one narrow topic.",
                    "Make the practices age-appropriate for the supplied age range.",
                    "Use metres, not yards.",
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

  return JSON.parse(outputText);
}

function extractPdfTextFromBase64({ documentName, pdfBase64 }) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-pdf-"));
  const pdfPath = path.join(tempDir, sanitizeFileName(documentName || "upload.pdf"));

  try {
    fs.writeFileSync(pdfPath, Buffer.from(pdfBase64, "base64"));
    return extractPdfTextWithPython(pdfPath);
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore temp cleanup failures.
    }
  }
}

function extractPdfTextWithPython(pdfPath) {
  const pythonCandidates = [
    process.env.CODEX_PYTHON_PATH,
    path.join(
      os.homedir(),
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
    ),
    "python3",
  ].filter(Boolean);

  const script = `
from pathlib import Path
from pypdf import PdfReader
import sys
pdf_path = Path(sys.argv[1])
reader = PdfReader(str(pdf_path))
parts = []
for page in reader.pages:
    parts.append(page.extract_text() or "")
print("\\n\\n".join(parts))
`.trim();

  for (const pythonPath of pythonCandidates) {
    const result = spawnSync(pythonPath, ["-c", script, pdfPath], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });

    if (result.status === 0 && result.stdout.trim()) {
      return result.stdout;
    }
  }

  throw new Error(
    "PDF text extraction is not available. Ensure pypdf is installed or provide extracted document text.",
  );
}

function buildHeuristicQuoteExtraction({
  documentName,
  documentText,
  documentType,
}) {
  const sections = splitDocumentIntoQuoteSections(documentText);
  const quotes = sections.map((section, index) => buildHeuristicQuote(section, index));

  return {
    documentName,
    documentType,
    quoteCount: quotes.length,
    overview:
      quotes.length === 1
        ? "One insurer quote was identified in the supplied document."
        : `${quotes.length} insurer quotes were identified in the supplied document.`,
    quotes,
  };
}

function splitDocumentIntoQuoteSections(documentText) {
  const normalized = String(documentText || "")
    .replace(/\u00a0/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  const boundaries = [0];
  const patterns = [
    /(?:^|\n)(?=\d{1,2}\s+\w+\s+\d{4}\s*\nMax\s+Insurances)/gim,
  ];

  patterns.forEach((pattern) => {
    let match = pattern.exec(normalized);

    while (match) {
      boundaries.push(
        normalized[match.index] === "\n" ? match.index + 1 : match.index,
      );
      if (pattern.lastIndex === match.index) {
        pattern.lastIndex += 1;
      }
      match = pattern.exec(normalized);
    }
  });

  const uniqueBoundaries = [...new Set(boundaries)]
    .filter((offset) => offset >= 0 && offset < normalized.length)
    .sort((left, right) => left - right);

  if (uniqueBoundaries.length <= 1) {
    return [normalized];
  }

  return sliceSections(normalized, uniqueBoundaries);
}

function sliceSections(text, starts) {
  return starts
    .map((start, index) => {
      const end = index + 1 < starts.length ? starts[index + 1] : text.length;
      return text.slice(start, end).trim();
    })
    .filter(Boolean);
}

function buildHeuristicQuote(section, index) {
  const normalizedSection = String(section || "").replace(/\u00a0/g, " ");
  const insurer =
    matchFirst(normalizedSection, [
      /From Broker .*?\n([A-Z][A-Za-z0-9 &.-]{1,60})\s+[A-Z]{2,4}-\d+/s,
      /underwriter,\s*(Vero Insurance New Zealand Limited)/i,
      /\b(Ando)\b/,
      /\b(Vero Insurance(?: New Zealand Limited)?)\b/i,
    ]) || `Quote ${index + 1}`;

  const premium =
    matchTotalPremium(normalizedSection) ||
    matchMoney(normalizedSection, [/Total\s+\$?\s*([0-9,]+\.\d{2})/i]) ||
    matchMoney(normalizedSection, [/Total.*?\$?\s*([0-9,]+\.\d{2})/i]);
  const excess = matchMoney(normalizedSection, [
    /\bExcess(?:es)?\s+\$?\s*([0-9,]+(?:\.\d{2})?)/i,
  ]);
  const coverage = collectCoverageItems(normalizedSection);
  const exclusions = collectExclusions(normalizedSection);

  return {
    insurer: normalizeInsurerName(insurer),
    premium: premium ? formatMoneyString(premium) : "Not clearly identified",
    excess: excess ? formatMoneyString(excess) : "Not clearly identified",
    coverage,
    exclusions,
    notes:
      normalizedSection.includes("Comprehensive")
        ? "Comprehensive motor cover detected in the extracted text."
        : "Quote detected from the uploaded PDF.",
    evidence: normalizedSection.slice(0, 600).replace(/\s+/g, " ").trim(),
  };
}

function matchTotalPremium(section) {
  const totalLine = section.match(/Total[^\n]*/i);

  if (!totalLine) {
    return null;
  }

  const amounts = [...totalLine[0].matchAll(/\$?\s*([0-9,]+\.\d{2})/g)].map(
    (match) => Number(match[1].replace(/,/g, "")),
  );

  return amounts.length ? amounts[amounts.length - 1] : null;
}

function collectCoverageItems(section) {
  const items = [];

  if (/Comprehensive/i.test(section)) {
    items.push("Comprehensive cover");
  }

  if (/Agreed Value/i.test(section)) {
    items.push("Agreed value");
  }

  if (/Windscreen/i.test(section)) {
    items.push("Windscreen and window glass");
  }

  if (/Open Driver Policy/i.test(section)) {
    items.push("Open driver policy");
  }

  if (/Exclude all under 25yr Drivers/i.test(section)) {
    items.push("Under 25 drivers excluded");
  }

  return items;
}

function collectExclusions(section) {
  const exclusions = [];

  if (/International Licence/i.test(section)) {
    exclusions.push("International licence excess applies");
  }

  if (/Unnamed Drivers/i.test(section)) {
    exclusions.push("Unnamed drivers excess applies");
  }

  if (/Drivers aged:\s*20\s*&\s*Under/i.test(section)) {
    exclusions.push("Young driver excess applies");
  }

  return exclusions;
}

function matchFirst(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function matchMoney(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return Number(match[1].replace(/,/g, ""));
    }
  }

  return null;
}

function normalizeInsurerName(value) {
  const cleaned = String(value || "").replace(/\s+/g, " ").trim();

  if (/^vero insurance new zealand limited$/i.test(cleaned)) {
    return "Vero";
  }

  if (/^ando$/i.test(cleaned)) {
    return "Ando";
  }

  return cleaned;
}

function formatMoneyString(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(value);
}

function sanitizeFileName(value) {
  return String(value || "upload.pdf").replace(/[^a-z0-9._-]+/gi, "_");
}

async function fetchSharePointDocumentText({ sharepointUrl, documentType }) {
  if (!sharepointUrl) {
    throw new Error(
      "No document text or SharePoint link was provided for assessment.",
    );
  }

  throw new Error(
    `Authenticated SharePoint retrieval is not configured yet for ${String(
      documentType || "file",
    ).toUpperCase()} documents. Add Microsoft Graph retrieval or provide extracted text first.`,
  );
}

function extractOutputText(responseJson) {
  const outputItems = Array.isArray(responseJson.output) ? responseJson.output : [];

  for (const item of outputItems) {
    const contentItems = Array.isArray(item.content) ? item.content : [];

    for (const content of contentItems) {
      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return "";
}

function buildFeedbackText({ message, userEmail, page, appName }) {
  return [
    `${appName} feedback received`,
    "",
    `From user: ${userEmail || "Not signed in"}`,
    `Current page: ${page || "Unknown"}`,
    "",
    "Feedback:",
    message,
  ].join("\n");
}

function buildFeedbackHtml({ message, userEmail, page, appName }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(appName)} feedback received</h2>
      <p><strong>From user:</strong> ${escapeHtml(userEmail || "Not signed in")}</p>
      <p><strong>Current page:</strong> ${escapeHtml(page || "Unknown")}</p>
      <p><strong>Feedback:</strong></p>
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;
}

function buildTeamUpdateSubject(teamName, eventRecord) {
  return `${teamName} update: ${eventRecord.eventTitle}`;
}

function buildTeamUpdateHtml({ teamName, eventRecord, messageText }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(teamName)} update</h2>
      <p><strong>Event:</strong> ${escapeHtml(String(eventRecord.eventTitle || ""))}</p>
      ${eventRecord.eventDate ? `<p><strong>Date:</strong> ${escapeHtml(String(eventRecord.eventDate))}</p>` : ""}
      ${eventRecord.eventTime ? `<p><strong>Time:</strong> ${escapeHtml(String(eventRecord.eventTime))}</p>` : ""}
      ${eventRecord.location ? `<p><strong>Location:</strong> ${escapeHtml(String(eventRecord.location))}</p>` : ""}
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(messageText)}</div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });
}

function serveStaticFile(pathname, response) {
  const safePath = pathname === "/" ? "/index.html" : (pathname === "/rsvp" ? "/rsvp.html" : pathname);
  const normalizedPath = path.normalize(safePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(rootDir, normalizedPath);

  if (!filePath.startsWith(rootDir)) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }

    response.writeHead(200, {
      "Content-Type":
        mimeTypes[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream",
    });
    response.end(content);
  });
}

async function invokeApiHandler(handler, request, response, requestUrl) {
  const parsedBody = request.method === "GET" || request.method === "OPTIONS"
    ? undefined
    : await readJsonBody(request).catch(() => ({}));

  const responseAdapter = createResponseAdapter(response);
  await handler(
    {
      method: request.method,
      headers: request.headers,
      body: parsedBody,
      query: Object.fromEntries(requestUrl.searchParams.entries()),
    },
    responseAdapter,
  );
}

function createResponseAdapter(response) {
  return {
    statusCode: 200,
    setHeader(name, value) {
      response.setHeader(name, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      sendJson(response, this.statusCode, payload);
    },
    end(payload) {
      response.writeHead(this.statusCode);
      response.end(payload);
    },
  };
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function applyCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
