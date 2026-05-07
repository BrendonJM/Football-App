const state = {
  quoteDocuments: [],
  scheduleDocuments: [],
  recommendation: null,
};

const elements = {
  apiStatus: document.querySelector("#apiStatus"),
  preparedForInput: document.querySelector("#preparedForInput"),
  preparedByInput: document.querySelector("#preparedByInput"),
  preparedForTile: document.querySelector("#preparedForTile"),
  preparedByTile: document.querySelector("#preparedByTile"),
  quoteDueDate: document.querySelector("#quoteDueDate"),
  quoteInput: document.querySelector("#quoteInput"),
  scheduleInput: document.querySelector("#scheduleInput"),
  quoteBrowse: document.querySelector("#quoteBrowse"),
  scheduleBrowse: document.querySelector("#scheduleBrowse"),
  clearFiles: document.querySelector("#clearFiles"),
  documentList: document.querySelector("#documentList"),
  generateSummaryButton: document.querySelector("#generateSummaryButton"),
  generateWebButton: document.querySelector("#generateWebButton"),
  generatePdfButton: document.querySelector("#generatePdfButton"),
  generateWordButton: document.querySelector("#generateWordButton"),
  statusMessage: document.querySelector("#statusMessage"),
  outputTitle: document.querySelector("#outputTitle"),
  quoteSummaryEditor: document.querySelector("#quoteSummaryEditor"),
  copyTextButton: document.querySelector("#copyTextButton"),
  sharePanel: document.querySelector("#sharePanel"),
  shareLink: document.querySelector("#shareLink"),
  pdfLink: document.querySelector("#pdfLink"),
  wordLink: document.querySelector("#wordLink"),
};

init();

function init() {
  wireEvents();
  renderDocuments();
  updatePreparedTiles();
  checkHealth();
}

function wireEvents() {
  elements.preparedForInput.addEventListener("input", updatePreparedTiles);
  elements.preparedByInput.addEventListener("input", updatePreparedTiles);
  elements.quoteBrowse.addEventListener("click", () => elements.quoteInput.click());
  elements.scheduleBrowse.addEventListener("click", () => elements.scheduleInput.click());
  elements.quoteInput.addEventListener("change", () => addFiles(elements.quoteInput.files, "quote"));
  elements.scheduleInput.addEventListener("change", () => addFiles(elements.scheduleInput.files, "schedule"));
  elements.clearFiles.addEventListener("click", clearFiles);
  elements.generateSummaryButton.addEventListener("click", generateSummaryForReview);
  elements.generateWebButton.addEventListener("click", () => createDeliverable("web"));
  elements.generatePdfButton.addEventListener("click", () => createDeliverable("pdf"));
  elements.generateWordButton.addEventListener("click", () => createDeliverable("word"));
  elements.copyTextButton.addEventListener("click", copyRecommendationText);
  elements.quoteSummaryEditor.addEventListener("input", syncEditedSummary);
}

function updatePreparedTiles() {
  elements.preparedForTile.textContent = elements.preparedForInput.value.trim() || "Quote Recommendation";
  elements.preparedByTile.textContent = elements.preparedByInput.value.trim() || "Ebix Insurance Brokers";
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const health = await response.json();
    elements.apiStatus.textContent = health.aiConfigured ? "AI ready" : "AI key needed";
    elements.apiStatus.classList.toggle("warning", !health.aiConfigured);
  } catch {
    elements.apiStatus.textContent = "Offline";
    elements.apiStatus.classList.add("warning");
  }
}

async function addFiles(fileList, kind) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  setStatus(`Reading ${files.length} ${kind} file${files.length === 1 ? "" : "s"}...`);

  for (const file of files) {
    try {
      const text = await extractText(file);
      const document = {
        id: crypto.randomUUID(),
        name: file.name,
        kind,
        size: file.size,
        text,
      };

      if (kind === "quote") {
        state.quoteDocuments.push(document);
      } else {
        state.scheduleDocuments.push(document);
      }
    } catch (error) {
      setStatus(`${file.name}: ${error.message}`, true);
    }
  }

  elements.quoteInput.value = "";
  elements.scheduleInput.value = "";
  renderDocuments();
  invalidateGeneratedSummary("Documents changed. Generate a fresh quote summary before creating a link or PDF.");
  setStatus("Documents ready.");
}

async function extractText(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "pdf") return extractPdfText(file);
  if (extension === "docx") return extractDocxText(file);
  if (["xlsx", "xls", "csv"].includes(extension)) return extractSpreadsheetText(file);
  if (["txt", "json"].includes(extension)) return file.text();

  throw new Error("Unsupported file type.");
}

async function extractPdfText(file) {
  const pdfjsLib = globalThis.pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("PDF reader did not load. Check your internet connection and try again.");
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }

  return pages.join("\n\n");
}

async function extractDocxText(file) {
  if (!globalThis.mammoth) {
    throw new Error("DOCX reader did not load. Check your internet connection and try again.");
  }

  const result = await globalThis.mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return result.value;
}

async function extractSpreadsheetText(file) {
  if (!globalThis.XLSX) {
    throw new Error("Spreadsheet reader did not load. Check your internet connection and try again.");
  }

  if (file.name.toLowerCase().endsWith(".csv")) {
    return file.text();
  }

  const workbook = globalThis.XLSX.read(await file.arrayBuffer(), { type: "array" });
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const csv = globalThis.XLSX.utils.sheet_to_csv(sheet);
    return `Sheet: ${sheetName}\n${csv}`;
  }).join("\n\n");
}

function renderDocuments() {
  const documents = [...state.quoteDocuments, ...state.scheduleDocuments];
  elements.documentList.innerHTML = "";

  if (!documents.length) {
    const item = document.createElement("li");
    item.className = "empty-item";
    item.textContent = "No documents uploaded yet.";
    elements.documentList.append(item);
    setSummaryButtonDisabled(true);
    setDeliveryButtonsDisabled(true);
    return;
  }

  for (const documentRecord of documents) {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(documentRecord.name)}</strong>
        <span>${documentRecord.kind} · ${formatBytes(documentRecord.size)} · ${documentRecord.text.length.toLocaleString()} chars</span>
      </div>
      <button class="icon-button" type="button" aria-label="Remove ${escapeHtml(documentRecord.name)}">×</button>
    `;
    item.querySelector("button").addEventListener("click", () => removeDocument(documentRecord.id));
    elements.documentList.append(item);
  }

  setSummaryButtonDisabled(state.quoteDocuments.length === 0);
  setDeliveryButtonsDisabled(!hasEditableSummary());
}

function removeDocument(id) {
  state.quoteDocuments = state.quoteDocuments.filter((documentRecord) => documentRecord.id !== id);
  state.scheduleDocuments = state.scheduleDocuments.filter((documentRecord) => documentRecord.id !== id);
  invalidateGeneratedSummary("Documents changed. Generate a fresh quote summary before creating a link or PDF.");
  renderDocuments();
}

function clearFiles() {
  state.quoteDocuments = [];
  state.scheduleDocuments = [];
  state.recommendation = null;
  elements.outputTitle.textContent = "Quote summary";
  elements.quoteSummaryEditor.value = "";
  elements.copyTextButton.disabled = true;
  elements.sharePanel.classList.add("hidden");
  renderDocuments();
  setStatus("Cleared.");
}

async function generateSummaryForReview() {
  if (!state.quoteDocuments.length) {
    setStatus("Upload at least one quote document.", true);
    return;
  }

  setSummaryButtonDisabled(true);
  setDeliveryButtonsDisabled(true);
  elements.sharePanel.classList.add("hidden");
  setStatus("Generating quote summary for review...");

  try {
    const recommendation = await generateRecommendation();
    renderEditableSummary(recommendation);
    setStatus("Quote summary generated. Review and edit before creating a URL, PDF, or Word document.");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setSummaryButtonDisabled(state.quoteDocuments.length === 0);
    setDeliveryButtonsDisabled(!hasEditableSummary());
  }
}

async function createDeliverable(type) {
  const recommendation = buildEditedRecommendation();

  if (!recommendation) {
    setStatus("Generate and review the quote summary before creating a URL, PDF, or Word document.", true);
    return;
  }

  setDeliveryButtonsDisabled(true);
  elements.sharePanel.classList.add("hidden");
  const statusByType = {
    web: "Creating webpage URL from edited summary...",
    pdf: "Creating PDF from edited summary...",
    word: "Creating Word document from edited summary...",
  };
  setStatus(statusByType[type] || statusByType.web);

  try {
    const share = await createShare(recommendation);

    renderShareLinks(share);

    if (type === "web") {
      try {
        await navigator.clipboard.writeText(new URL(share.url, window.location.origin).href);
        setStatus("Webpage URL generated from edited summary and copied.");
      } catch {
        setStatus("Webpage URL generated from edited summary.");
      }
    } else if (type === "pdf") {
      setStatus("PDF generated from edited summary. Download it from the PDF link below.");
    } else {
      setStatus("Word document generated from edited summary. Download it from the Word link below.");
    }
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setDeliveryButtonsDisabled(!hasEditableSummary());
  }
}

async function generateRecommendation() {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      preparedFor: elements.preparedForInput.value,
      preparedBy: elements.preparedByInput.value,
      clientRiskText: "",
      quoteDueDate: elements.quoteDueDate.value,
      quoteDocuments: state.quoteDocuments.map(stripLocalFields),
      scheduleDocuments: state.scheduleDocuments.map(stripLocalFields),
    }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Recommendation generation failed.");
  }

  state.recommendation = payload;
  return payload;
}

async function copyRecommendationText() {
  const summaryText = getEditedSummaryText();
  if (!summaryText) return;
  await navigator.clipboard.writeText(summaryText);
  setStatus("Quote summary text copied.");
}

async function createShare(recommendation) {
  const response = await fetch("/api/shares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recommendation),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Deliverable could not be created.");
  }

  return payload;
}

function renderShareLinks(share) {
  const shareUrl = new URL(share.url, window.location.origin).href;
  const pdfUrl = new URL(share.pdfUrl, window.location.origin).href;
  const wordUrl = new URL(share.wordUrl, window.location.origin).href;
  elements.shareLink.href = shareUrl;
  elements.shareLink.textContent = shareUrl;
  elements.pdfLink.href = pdfUrl;
  elements.wordLink.href = wordUrl;
  elements.sharePanel.classList.remove("hidden");
}

function clearShareLinks() {
  elements.shareLink.removeAttribute("href");
  elements.shareLink.textContent = "";
  elements.pdfLink.removeAttribute("href");
  elements.wordLink.removeAttribute("href");
  elements.sharePanel.classList.add("hidden");
}

function setDeliveryButtonsDisabled(disabled) {
  elements.generateWebButton.disabled = disabled;
  elements.generatePdfButton.disabled = disabled;
  elements.generateWordButton.disabled = disabled;
}

function setSummaryButtonDisabled(disabled) {
  elements.generateSummaryButton.disabled = disabled;
}

function renderEditableSummary(recommendation) {
  elements.outputTitle.textContent = recommendation.title || "Quote summary";
  elements.quoteSummaryEditor.value = recommendation.documentText || "";
  syncEditedSummary({ silent: true });
  elements.quoteSummaryEditor.focus();
}

function syncEditedSummary({ silent = false } = {}) {
  if (state.recommendation) {
    state.recommendation.documentText = getEditedSummaryText();
    state.recommendation.title = extractTitleFromText(state.recommendation.documentText);
  }

  elements.copyTextButton.disabled = !hasEditableSummary();
  setDeliveryButtonsDisabled(!hasEditableSummary());
  clearShareLinks();

  if (!silent && hasEditableSummary()) {
    setStatus("Quote summary edited. Generate a new URL or PDF to include the changes.");
  }
}

function invalidateGeneratedSummary(message) {
  state.recommendation = null;
  elements.outputTitle.textContent = "Quote summary";
  elements.quoteSummaryEditor.value = "";
  elements.copyTextButton.disabled = true;
  setDeliveryButtonsDisabled(true);
  clearShareLinks();
  if (message) setStatus(message);
}

function buildEditedRecommendation() {
  const documentText = getEditedSummaryText();
  if (!documentText) return null;

  return {
    title: extractTitleFromText(documentText),
    documentText,
    generatedAt: state.recommendation?.generatedAt || new Date().toISOString(),
  };
}

function hasEditableSummary() {
  return Boolean(getEditedSummaryText());
}

function getEditedSummaryText() {
  return elements.quoteSummaryEditor.value.trim();
}

function extractTitleFromText(text) {
  return (
    String(text || "")
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) || "Quote summary"
  );
}

function stripLocalFields(documentRecord) {
  return {
    name: documentRecord.name,
    kind: documentRecord.kind,
    text: documentRecord.text,
  };
}

function setStatus(message, isError = false) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.toggle("error", isError);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
