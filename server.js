const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const rootDir = __dirname;
const storePath =
  process.env.RECOMMENDATION_STORE_PATH ||
  path.join(os.tmpdir(), "insurance-quote-recommendations.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const systemPrompt = `You are a commercial insurance underwriting and broking assistant operating under Australian and New Zealand insurance market standards.
You are a data-bound system.
You may ONLY use information explicitly present in the provided:
• Client risk information, and
• Structured insurance QUOTE information.
You must NEVER fabricate, infer, assume, estimate, extrapolate, normalise, or complete missing data.
Absence of information must always be treated as unknown, not implied.
ABSOLUTE ANTI-HALLUCINATION RULES (NON-NEGOTIABLE)
• Do NOT infer cover intent from risk descriptions
• Do NOT assume standard wordings, market norms, or typical policy structures
• Do NOT assume limits, excesses, endorsements, inclusions, or exclusions
• Do NOT fill blanks using "typical", "likely", or "industry standard" logic
• Do NOT recommend, compare, or summarise anything not explicitly present
• Do NOT rename, reword, normalise, or consolidate insurer or section terminology
• Do NOT invent totals or comparative statements
If a value is not explicitly stated, it must be omitted or shown as "—" or "To be confirmed" where instructed.
If information is unclear or incomplete, use it verbatim or omit it — do not interpret.
INPUT HANDLING REQUIREMENTS
You must correctly handle:
• Structured client risk summaries
• Structured quote schedules
• Multi-insurer quote datasets
• Partial or incomplete quote information
Preserve insurer-specific naming, class of risk names, and section structure exactly as provided.
STRICT TWO-PHASE EXECUTION (MANDATORY)
PHASE 1 — DATA VALIDATION & NORMALISATION ONLY
• No advice
• No opinions
• No recommendations
• No prose
• No summarisation
• No calculations (except where explicitly allowed later)
Validate and organise the provided risk and quote data internally.
Do not resolve inconsistencies.
Do not fill gaps.
If data is missing, leave it blank or mark as "—".
PHASE 2 — ADVISORY & DOCUMENT or WEB PAGE OUTPUT (CONTROLLED)
Only after Phase 1 is complete and internally validated:
Prepare a broker-ready insurance quote recommendation document or webpage using ONLY the validated data.
Before generating the output, you MUST internally confirm:
• Every numeric value is explicitly provided or calculated strictly per GST rules
• Every insurer referenced appears in the quote information
• Every recommended class of risk has a corresponding quoted premium
• No class of risk appears unless quoted
If any check fails, omit the affected item rather than guessing.
RECOMMENDATION LOGIC
(COHESION-FIRST, NO SPLITTING BY DEFAULT)
Definitions:
• "Programme" = all quoted classes of risk in scope
• "Complete insurer" = an insurer that has quoted every class of risk in scope
• "Section premium" = the premium shown for that class of risk (use Total Premium incl. GST if shown; otherwise use the premium as explicitly provided)
MANDATORY ORDER:
1. SINGLE-INSURER PROGRAMME RULE (DEFAULT)
• If one or more complete insurers exist:
– You MUST recommend ONE insurer for ALL classes of risk.
– Do NOT split recommendations across insurers.
2. SELECTION BETWEEN COMPLETE INSURERS
• If multiple complete insurers exist:
– Calculate each insurer's Programme Total by summing its section premiums across all classes of risk in scope.
– Recommend the complete insurer with the LOWEST Programme Total.
• If Programme Totals cannot be calculated due to missing premiums:
– Do NOT calculate totals.
– Recommend the complete insurer with the most complete premium data.
– If still tied or indeterminable, state that a single-insurer recommendation cannot be determined from the provided data and do not recommend.
3. SPLIT ONLY IF NO COMPLETE INSURER EXISTS
• Only if NO insurer has quoted every class of risk:
– Recommend the insurer with the LOWEST section premium for each class of risk.
– If only one insurer is quoted for a class, recommend that insurer.
– Exclude unquoted classes entirely.
4. NO CHERRY-PICKING (ALWAYS ON)
• Never assemble "best of each insurer" solutions when a complete insurer exists.
• Splitting is allowed only when unavoidable.
5. CLIENT-FACING RATIONALE CONSTRAINT
• Recommendation rationale must be price-based only.
• Do NOT mention coverage breadth, endorsements, conditions, claims handling, or service.
• For single-insurer recommendations, reference overall programme pricing only if explicitly calculated from provided data.
GST AND TOTALS RULES (NZ ONLY)
• GST rate is 15%
• If Total Premium (incl. GST) is shown:
– Company Premium = Total ÷ 1.15 (rounded to 2 decimals)
– GST = Total − Company Premium
• ND levies must NOT be included in totals unless explicitly stated
• TOTAL row must sum:
– Company Premium
– GST
– Total Premium
• If any component is missing, show "—" for the entire TOTAL row
OUTPUT REQUIREMENTS
(FINAL OUTPUT ONLY)
Use the structure of the provided Quote Summary template for both the web page output and PDF output.
The final output must follow this order and these section names exactly where the section can be supported by provided data:
TABLE FORMATTING RULES
• Every table requested below MUST be output as a plain-text pipe table.
• A pipe table is consecutive rows using " | " between cells.
• Do NOT use Markdown separator rows such as "--- | ---".
• Do NOT use prose where a table is requested.
• Where a section contains field/value pairs, options, classes of risk, insurers, premiums, limits, excesses, levies, fees, or comparison data, prefer a pipe table over prose unless the section wording below explicitly requires a sentence.
• Keep table cells compact. Use "—" where instructed for missing values.
• Put one blank line between each section heading and the table or text that follows it.
• Example:
Field | Value
Prepared for | Example Client
Prepared by | Example Adviser

1. Quote Summary
Include a compact metadata table with these rows:
Prepared for
Prepared by
Insured name
Quote date
Valid until
If a value is not explicitly provided, show "—".
Use the provided PREPARED FOR value for the Prepared for row.
Use the provided PREPARED BY value for the Prepared by row.

2. Basis of Advice
Use this heading exactly.
Include a short data-bound basis statement using only provided client risk information, quote information, disclosures, goals, priorities, or risk assessment wording.
If no basis information is provided, use:
Basis of advice: —

3. Covers we have quoted
Use a compact pipe table.
List only the quoted classes of risk exactly as named in the provided quote information.
Do not include any class of risk that is not quoted.

4. Excluded from the advice
Use a compact pipe table for exclusions from the scope of advice only if explicitly provided.
If none are provided, show:
Excluded from the advice: —

5. My Recommendation
Use a compact pipe table to state the recommended option or insurer strictly under the Recommendation Logic above.
The rationale must be price-based only.
Do not mention coverage breadth, endorsements, conditions, claims handling, insurer reputation, service, policy benefits, or qualitative factors unless those exact items are explicitly stated as the client's own priorities and are not used as recommendation rationale.
If the recommendation cannot be supported, state:
A recommendation cannot be determined from the provided quote information.

6. Policy detail
For each quoted class of risk, create a subsection using the class of risk name exactly as provided.
Under each subsection, include a compact table using only fields explicitly provided, preserving labels where possible:
Insured name
Address / Situation / Location
Sum insured / Limit
Selected excess
Occupied by / Type of risk
Interested party
Policy period
Coverage type
If a field is not explicitly provided, show "—".

7. Key Policy Benefit and Premium Comparison*
Include the following note exactly:
*This list is not extensive, so for a more comprehensive policy comparison please contact your Adviser. Refer to policy for full details of all conditions and benefits.
Only include a benefit comparison table if benefits, limits, excess differences, endorsements, imposed conditions, or coverage differences are explicitly present in the provided quote information.
This section mist always display as a table and must use this structure.  Each option must display as a new column in the table:
Class of Risk / Benefit
Option 1 - {Insurer Name}
Option 2 - {Insurer Name}
Option 3 - {Insurer Name}
Add or remove option columns to match the insurers explicitly quoted.
Do not create benefit rows from assumptions or market norms.
If no explicit benefit comparison data is provided, show:
No policy benefit comparison information was provided.

8. Premium Comparison
For each quoted insurer or option, create a subsection:
Option {number} – {Insurer Name}:
Under each option, include a premium table using the same premium basis as the recommendation.
Use these columns where data is explicitly available:
Policy
Company premium
GST
Total Premium
ND levy
NHI levy
Fire levy
Adviser Fee
Other explicitly named levy or fee
Do not include a levy or fee column unless it appears in the quote information.
Include a Total Premium (including GST) row only where it is explicitly provided or calculable under the GST AND TOTALS RULES.

9. Commission rates from the insurer
Include this section under each option only if commission information is explicitly provided.
Preserve commission wording exactly where possible.
If no commission information is provided, omit the section.

10. Payment options
Include payment frequency or monthly payment wording only if explicitly provided.
If no payment option wording is provided, omit this section.

11. Next steps
Use this wording:
Please review the information and options included here thoroughly and if you have any questions or require any changes please let your Adviser know. Please confirm which option you want to proceed with.
If a quote due date is provided, add:
Please advise by {QUOTE DUE DATE}.
If no quote due date is provided, add:
Please advise by —.

12. Quote Presented by
Include the provided PREPARED BY value first.
Also include broker/adviser name, business name, mobile, email, and website only where explicitly provided.
If none are provided, show:
Quote Presented by: —

13. Disclosure and privacy information
Include disclosure, privacy, and disclaimer wording only if explicitly provided in the input.
Do not invent licence, FSP, privacy policy, complaints, disclaimer, or authority wording.
If none is provided, omit this section.

14. Sign-off
Include a sign-off block for the client to agree and sign.
FINAL OUTPUT RULES
• Plain-text only
• Broker-ready
• No markdown
• No emojis
• No invented, inferred, or assumed values
• Fail closed if a recommendation cannot be supported`;

const server = http.createServer(async (request, response) => {
  applyCors(response);
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    if (request.method === "POST" && requestUrl.pathname === "/api/recommendations") {
      await handleRecommendationRequest(request, response);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/shares") {
      await handleShareCreate(request, response);
      return;
    }

    if (request.method === "GET" && requestUrl.pathname.startsWith("/api/shares/")) {
      await handleShareGet(requestUrl, response);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname.startsWith("/api/shares/")) {
      await handleShareSign(request, requestUrl, response);
      return;
    }

    if (request.method === "GET" && requestUrl.pathname.startsWith("/api/pdf/")) {
      await handlePdfGet(requestUrl, response);
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        app: "insurance-quote-recommendation",
        aiConfigured: Boolean(OPENAI_API_KEY),
      });
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    await serveStatic(requestUrl.pathname, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: error.message || "Unexpected server error." });
  }
});

server.listen(PORT, () => {
  console.log(`Insurance Quote Recommendation app running at http://localhost:${PORT}`);
});

async function handleRecommendationRequest(request, response) {
  const payload = await readJson(request);
  const preparedFor = cleanText(payload.preparedFor);
  const preparedBy = cleanText(payload.preparedBy);
  const clientRiskText = cleanText(payload.clientRiskText);
  const quoteDocuments = Array.isArray(payload.quoteDocuments) ? payload.quoteDocuments : [];
  const scheduleDocuments = Array.isArray(payload.scheduleDocuments) ? payload.scheduleDocuments : [];
  const quoteDueDate = cleanText(payload.quoteDueDate);

  if (!quoteDocuments.length) {
    sendJson(response, 400, { error: "Upload at least one quote document." });
    return;
  }

  if (!OPENAI_API_KEY) {
    sendJson(response, 500, {
      error: "OPENAI_API_KEY is not configured. Add it to the server environment to generate recommendations.",
    });
    return;
  }

  const userInput = buildModelInput({
    preparedFor,
    preparedBy,
    clientRiskText,
    quoteDocuments,
    scheduleDocuments,
    quoteDueDate,
  });
  const documentText = await requestRecommendation(userInput);
  const title = extractTitle(documentText);

  sendJson(response, 200, {
    title,
    documentText,
    generatedAt: new Date().toISOString(),
  });
}

async function handleShareCreate(request, response) {
  const payload = await readJson(request);
  const documentText = cleanText(payload.documentText);

  if (!documentText) {
    sendJson(response, 400, { error: "documentText is required." });
    return;
  }

  const id = crypto.randomBytes(9).toString("base64url");
  const record = {
    id,
    title: cleanText(payload.title) || extractTitle(documentText),
    documentText,
    createdAt: new Date().toISOString(),
    signedAt: "",
    signerName: "",
    signerEmail: "",
  };

  const records = await readStore();
  records[id] = record;
  await writeStore(records);

  sendJson(response, 201, {
    id,
    url: `/share.html?id=${encodeURIComponent(id)}`,
    pdfUrl: `/api/pdf/${encodeURIComponent(id)}`,
  });
}

async function handleShareGet(requestUrl, response) {
  const id = requestUrl.pathname.split("/").pop();
  const record = await getRecord(id);

  if (!record) {
    sendJson(response, 404, { error: "Recommendation link not found." });
    return;
  }

  sendJson(response, 200, record);
}

async function handleShareSign(request, requestUrl, response) {
  const id = requestUrl.pathname.split("/").pop();
  const payload = await readJson(request);
  const records = await readStore();
  const record = records[id];

  if (!record) {
    sendJson(response, 404, { error: "Recommendation link not found." });
    return;
  }

  const signerName = cleanText(payload.signerName);
  if (!signerName) {
    sendJson(response, 400, { error: "Signer name is required." });
    return;
  }

  record.signerName = signerName;
  record.signerEmail = cleanText(payload.signerEmail);
  record.signedAt = new Date().toISOString();
  records[id] = record;
  await writeStore(records);

  sendJson(response, 200, record);
}

async function handlePdfGet(requestUrl, response) {
  const id = requestUrl.pathname.split("/").pop();
  const record = await getRecord(id);

  if (!record) {
    sendJson(response, 404, { error: "Recommendation link not found." });
    return;
  }

  const signedText = record.signedAt
    ? `${record.documentText}\n\nSIGNED\nName: ${record.signerName}\nEmail: ${record.signerEmail || "—"}\nSigned at: ${record.signedAt}`
    : record.documentText;
  const pdf = createPdf(formatDocumentTextForPdf(signedText));
  const filename = `${slugify(record.title || "insurance-quote-summary")}.pdf`;

  response.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": pdf.length,
  });
  response.end(pdf);
}

async function requestRecommendation(userInput) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        { role: "user", content: [{ type: "input_text", text: userInput }] },
      ],
      temperature: 0,
    }),
  });

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await apiResponse.json();
  const outputText =
    data.output_text ||
    data.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text || "")
      .join("\n")
      .trim();

  if (!outputText) {
    throw new Error("The AI response did not include recommendation text.");
  }

  return outputText;
}

function buildModelInput({ preparedFor, preparedBy, clientRiskText, quoteDocuments, scheduleDocuments, quoteDueDate }) {
  const quotes = quoteDocuments
    .map((document, index) => formatDocumentBlock("QUOTE", document, index))
    .join("\n\n");
  const schedules = scheduleDocuments
    .map((document, index) => formatDocumentBlock("SCHEDULE", document, index))
    .join("\n\n");

  return `Generate the final broker-ready output only, following the system rules exactly.

PREPARED FOR:
${preparedFor || "—"}

PREPARED BY:
${preparedBy || "—"}

QUOTE DUE DATE PROVIDED BY USER:
${quoteDueDate || "—"}

CLIENT RISK INFORMATION:
${clientRiskText || "—"}

STRUCTURED INSURANCE QUOTE INFORMATION:
${quotes}

SCHEDULE INFORMATION:
${schedules || "—"}`;
}

function formatDocumentBlock(label, document, index) {
  return `${label} ${index + 1}
File name: ${cleanText(document.name) || "Untitled"}
Document kind: ${cleanText(document.kind) || label.toLowerCase()}
Extracted text:
${cleanText(document.text) || "—"}`;
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function applyCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function serveStatic(urlPath, response) {
  const safePath = urlPath === "/" ? "/index.html" : decodeURIComponent(urlPath);
  const fullPath = path.normalize(path.join(rootDir, safePath));

  if (!fullPath.startsWith(rootDir)) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  try {
    const file = await fs.readFile(fullPath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(fullPath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

async function readStore() {
  try {
    return JSON.parse(await fs.readFile(storePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function writeStore(records) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(records, null, 2));
}

async function getRecord(id) {
  if (!/^[a-zA-Z0-9_-]{8,32}$/.test(id || "")) return null;
  const records = await readStore();
  return records[id] || null;
}

function cleanText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function extractTitle(documentText) {
  return (
    documentText
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) || "Insurance Quote Summary"
  );
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "insurance-quote-summary";
}

function createPdf(text) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 54;
  const lineHeight = 14;
  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const lines = wrapLines(text, 88);
  const pages = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }

  if (!pages.length) pages.push([""]);

  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];

  for (const pageLines of pages) {
    const content = [
      "BT",
      "/F1 10 Tf",
      `${margin} ${pageHeight - margin} Td`,
      `${lineHeight} TL`,
      ...pageLines.map((line) => `(${escapePdf(line)}) Tj T*`),
      "ET",
    ].join("\n");
    const contentId = addObject(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  for (const pageId of pageIds) {
    objects[pageId - 1] = objects[pageId - 1].replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
  }

  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(chunks.join("")));
    chunks.push(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`);
  }
  const xrefOffset = Buffer.byteLength(chunks.join(""));
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (let index = 1; index < offsets.length; index += 1) {
    chunks.push(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return Buffer.from(chunks.join(""), "utf8");
}

function formatDocumentTextForPdf(text) {
  const blocks = cleanText(text).split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trimEnd());
      if (isPdfHeading(lines[0]) && isPipeTable(lines.slice(1))) {
        return `${lines[0]}\n\n${formatPipeTableForPdf(lines.slice(1))}`;
      }
      if (!isPipeTable(lines)) return block;
      return formatPipeTableForPdf(lines);
    })
    .join("\n\n");
}

function isPdfHeading(line) {
  return /^\d+\.\s+\S/.test(String(line || "").trim()) || /^[A-Z][^.!?]{2,80}$/.test(String(line || "").trim());
}

function isPipeTable(lines) {
  const tableRows = lines.filter((line) => isPipeRow(line));
  return tableRows.length >= 2 && tableRows.length === lines.filter(Boolean).length;
}

function isPipeRow(line) {
  return String(line || "").includes("|") && !/^\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+$/.test(line);
}

function formatPipeTableForPdf(lines) {
  const rows = lines.filter(isPipeRow).map((line) => line.split("|").map((cell) => cell.trim()));
  const columnCount = Math.max(...rows.map((row) => row.length));
  const widths = Array.from({ length: columnCount }, (_, columnIndex) =>
    Math.min(
      26,
      Math.max(
        8,
        ...rows.map((row) => String(row[columnIndex] || "").length)
      )
    )
  );
  const separator = widths.map((width) => "-".repeat(width)).join("-+-");
  const formatted = rows.map((row, rowIndex) => {
    const line = widths
      .map((width, columnIndex) => String(row[columnIndex] || "—").slice(0, width).padEnd(width, " "))
      .join(" | ");
    return rowIndex === 0 ? `${line}\n${separator}` : line;
  });
  return formatted.join("\n");
}

function wrapLines(text, maxLength) {
  return cleanText(text)
    .split("\n")
    .flatMap((line) => {
      if (!line) return [""];
      const words = line.split(/\s+/);
      const wrapped = [];
      let current = "";
      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxLength && current) {
          wrapped.push(current);
          current = word;
        } else {
          current = next;
        }
      }
      if (current) wrapped.push(current);
      return wrapped;
    });
}

function escapePdf(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}
