const state = {
  quoteDocuments: [],
  scheduleDocuments: [],
  recommendation: null,
};

const elements = {
  apiStatus: document.querySelector("#apiStatus"),
  clientRiskText: document.querySelector("#clientRiskText"),
  quoteDueDate: document.querySelector("#quoteDueDate"),
  quoteInput: document.querySelector("#quoteInput"),
  scheduleInput: document.querySelector("#scheduleInput"),
  quoteBrowse: document.querySelector("#quoteBrowse"),
  scheduleBrowse: document.querySelector("#scheduleBrowse"),
  clearFiles: document.querySelector("#clearFiles"),
  documentList: document.querySelector("#documentList"),
  generateWebButton: document.querySelector("#generateWebButton"),
  generatePdfButton: document.querySelector("#generatePdfButton"),
  statusMessage: document.querySelector("#statusMessage"),
  outputTitle: document.querySelector("#outputTitle"),
  recommendationOutput: document.querySelector("#recommendationOutput"),
  copyTextButton: document.querySelector("#copyTextButton"),
  sharePanel: document.querySelector("#sharePanel"),
  shareLink: document.querySelector("#shareLink"),
  pdfLink: document.querySelector("#pdfLink"),
};

init();

function init() {
  wireEvents();
  renderDocuments();
  checkHealth();
}

function wireEvents() {
  elements.quoteBrowse.addEventListener("click", () => elements.quoteInput.click());
  elements.scheduleBrowse.addEventListener("click", () => elements.scheduleInput.click());
  elements.quoteInput.addEventListener("change", () => addFiles(elements.quoteInput.files, "quote"));
  elements.scheduleInput.addEventListener("change", () => addFiles(elements.scheduleInput.files, "schedule"));
  elements.clearFiles.addEventListener("click", clearFiles);
  elements.generateWebButton.addEventListener("click", () => generateDeliverable("web"));
  elements.generatePdfButton.addEventListener("click", () => generateDeliverable("pdf"));
  elements.copyTextButton.addEventListener("click", copyRecommendationText);
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

  setDeliveryButtonsDisabled(state.quoteDocuments.length === 0);
}

function removeDocument(id) {
  state.quoteDocuments = state.quoteDocuments.filter((documentRecord) => documentRecord.id !== id);
  state.scheduleDocuments = state.scheduleDocuments.filter((documentRecord) => documentRecord.id !== id);
  renderDocuments();
}

function clearFiles() {
  state.quoteDocuments = [];
  state.scheduleDocuments = [];
  state.recommendation = null;
  elements.recommendationOutput.textContent = "Upload quote documents and schedules, then choose whether to generate a webpage URL or a PDF.";
  elements.copyTextButton.disabled = true;
  elements.sharePanel.classList.add("hidden");
  renderDocuments();
  setStatus("Cleared.");
}

async function generateDeliverable(type) {
  if (!state.quoteDocuments.length) {
    setStatus("Upload at least one quote document.", true);
    return;
  }

  setDeliveryButtonsDisabled(true);
  elements.sharePanel.classList.add("hidden");
  setStatus(type === "web" ? "Generating webpage recommendation..." : "Generating PDF recommendation...");

  try {
    const recommendation = await generateRecommendation();
    const share = await createShare(recommendation);

    renderShareLinks(share);

    if (type === "web") {
      try {
        await navigator.clipboard.writeText(new URL(share.url, window.location.origin).href);
        setStatus("Webpage URL generated and copied.");
      } catch {
        setStatus("Webpage URL generated.");
      }
    } else {
      setStatus("PDF generated. Download it from the PDF link below.");
    }
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setDeliveryButtonsDisabled(state.quoteDocuments.length === 0);
  }
}

async function generateRecommendation() {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientRiskText: elements.clientRiskText.value,
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
  elements.outputTitle.textContent = payload.title || "Recommendation document";
  elements.recommendationOutput.textContent = payload.documentText;
  elements.copyTextButton.disabled = false;
  return payload;
}

async function copyRecommendationText() {
  if (!state.recommendation?.documentText) return;
  await navigator.clipboard.writeText(state.recommendation.documentText);
  setStatus("Recommendation text copied.");
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
  elements.shareLink.href = shareUrl;
  elements.shareLink.textContent = shareUrl;
  elements.pdfLink.href = pdfUrl;
  elements.sharePanel.classList.remove("hidden");
}

function setDeliveryButtonsDisabled(disabled) {
  elements.generateWebButton.disabled = disabled;
  elements.generatePdfButton.disabled = disabled;
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
