const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
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
  const safePath = pathname === "/" ? "/index.html" : pathname;
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
