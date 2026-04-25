# OpenAI Quote Extraction And Assessment Backend Contract

The server currently supports these OpenAI-backed endpoints:

- `POST /api/extract-quotes`
- `POST /api/summarize-document`

## 1. Extract multiple quotes from one document

Use this when one uploaded or linked PDF may contain several insurer quotes.

### Request body

```json
{
  "documentName": "Commercial Property Quotes Pack.pdf",
  "documentType": "pdf",
  "documentText": "Insurer: Harbour Mutual ... Insurer: Southern Shield ..."
}
```

### Expected response

```json
{
  "documentName": "Commercial Property Quotes Pack.pdf",
  "quoteCount": 2,
  "overview": "Two insurer quotes were identified in the supplied document text.",
  "quotes": [
    {
      "insurer": "Harbour Mutual",
      "premium": "$4,850",
      "excess": "$1,000",
      "coverage": ["Material damage", "Business interruption", "Public liability"],
      "exclusions": ["Cyber incidents"],
      "notes": "Broad cover with mid-range premium.",
      "evidence": "Insurer heading and premium appear together in the extracted text."
    }
  ]
}
```

## 2. Assess a matched document

### Request body

```json
{
  "documentName": "Statement of Advice - Jane Smith.pdf",
  "sharepointUrl": "https://contoso.sharepoint.com/...",
  "matchTerm": "Statement of Advice",
  "documentType": "pdf",
  "complianceCriteria": [
    "Was the client sent a copy of the nature and scope of advice before proceeding and was this saved to the client file?",
    "Was a fact find saved to the client file?"
  ]
}
```

### Expected response

```json
{
  "title": "AI Compliance Assessment",
  "overview": "This document appears to be a client statement of advice covering policy recommendations and review context.",
  "relevance": "Appears directly relevant to the matched compliance term.",
  "criteriaAssessments": [
    {
      "criterion": "Was a fact find saved to the client file?",
      "status": "Partially evidenced",
      "evidence": "The document references client objectives and personal details, but the fact find itself is not clearly attached."
    }
  ],
  "findings": [
    "Includes policy recommendation language.",
    "References the client and advice date."
  ],
  "gaps": [
    "Needs reviewer confirmation that the final signed version is present."
  ],
  "source": "OpenAI backend"
}
```

## Suggested backend flow

1. Receive the document metadata from the frontend.
2. Download the PDF or retrieve it from SharePoint.
3. Extract text from the document.
4. Call `POST /api/extract-quotes` when one document may contain multiple insurer quotes.
5. Use the extracted quote objects in the comparison UI.
6. Use `POST /api/summarize-document` when you need a separate structured assessment.

## Notes

- Do not call OpenAI directly from the browser with a secret API key.
- PDF text extraction still happens before the AI step.
- The new extraction route is designed specifically for the case where a single PDF contains multiple insurer quotes.
