# Quote Recommendation Builder

A fresh broker-facing application for turning insurance quote documents and schedules into a client-ready quote recommendation.

## What It Does

- Upload one or many related quote documents.
- Upload schedules or client risk summaries.
- Extract text from PDF, DOCX, TXT, CSV, XLSX, XLS, and JSON files in the browser.
- Generate an editable quote summary from the uploaded quote and schedule set.
- Review and amend the generated quote summary before creating deliverables.
- Generate a client webpage URL or downloadable PDF from the edited quote summary.
- Copy the broker-ready plain-text quote summary created with the strict data-bound AI prompt.
- Record client sign-off name, optional email, and timestamp.

## Run Locally

```bash
OPENAI_API_KEY=your_key_here node server.js
```

By default the app runs on:

```text
http://localhost:3000
```

If that port is busy:

```bash
PORT=3001 OPENAI_API_KEY=your_key_here node server.js
```

## Environment

```text
OPENAI_API_KEY=required for AI recommendation generation
OPENAI_MODEL=optional, defaults to gpt-4.1-mini
PORT=optional, defaults to 3000
RECOMMENDATION_STORE_PATH=optional local JSON store path
```

Generated share records are stored in a local JSON file under the system temp directory unless `RECOMMENDATION_STORE_PATH` is set.

## Notes

The AI route sends only the extracted document text, client risk text, quote due date, and file labels provided through the UI. The prompt is intentionally fail-closed and instructs the model not to infer, fabricate, normalise, or complete missing insurance data.
