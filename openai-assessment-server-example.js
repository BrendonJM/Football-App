/*
  Example backend for Folio Compliance Tracker.
  This file is intentionally not wired into a runtime here.
  Use a server-side environment variable called OPENAI_API_KEY.
*/

const complianceSystemPrompt = `
You assess insurance broker compliance documents.

You will receive:
- a matched search term
- the document name and document type
- a list of broker compliance criteria
- extracted document text or document file content

Return valid JSON with:
- title
- overview
- relevance
- criteriaAssessments: array of { criterion, status, evidence }
- findings: array of strings
- gaps: array of strings
- source

Allowed criterion status values:
- Evidenced
- Partially evidenced
- Not evidenced
- Needs review

Be conservative. If evidence is weak or missing, say so clearly.
Do not invent evidence that is not in the document.
`;

async function buildOpenAIAssessmentPayload({
  documentName,
  matchTerm,
  documentType,
  complianceCriteria,
  extractedText,
}) {
  return {
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: complianceSystemPrompt,
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
                matchTerm,
                documentType,
                complianceCriteria,
                extractedText,
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
        type: "json_object",
      },
    },
  };
}

/*
Example request to OpenAI Responses API:

const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify(
    await buildOpenAIAssessmentPayload({
      documentName,
      matchTerm,
      documentType,
      complianceCriteria,
      extractedText,
    }),
  ),
});

const json = await response.json();
*/

module.exports = {
  buildOpenAIAssessmentPayload,
};
