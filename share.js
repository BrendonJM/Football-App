const params = new URLSearchParams(window.location.search);
const shareId = params.get("id");

const elements = {
  title: document.querySelector("#shareTitle"),
  document: document.querySelector("#shareDocument"),
  pdfLink: document.querySelector("#sharePdfLink"),
  form: document.querySelector("#signForm"),
  signerName: document.querySelector("#signerName"),
  signerEmail: document.querySelector("#signerEmail"),
  signStatus: document.querySelector("#signStatus"),
};

let currentRecord = null;

init();

async function init() {
  if (!shareId) {
    showError("Missing recommendation link id.");
    return;
  }

  elements.pdfLink.href = `/api/pdf/${encodeURIComponent(shareId)}`;
  elements.form.addEventListener("submit", signRecommendation);
  await loadRecommendation();
}

async function loadRecommendation() {
  try {
    const response = await fetch(`/api/shares/${encodeURIComponent(shareId)}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Recommendation could not be loaded.");
    }

    currentRecord = payload;
    renderRecord(payload);
  } catch (error) {
    showError(error.message);
  }
}

function renderRecord(record) {
  elements.title.textContent = record.title || "Insurance Quote Summary";
  elements.document.textContent = record.documentText || "";

  if (record.signedAt) {
    elements.signerName.value = record.signerName || "";
    elements.signerEmail.value = record.signerEmail || "";
    elements.signerName.disabled = true;
    elements.signerEmail.disabled = true;
    elements.form.querySelector("button").disabled = true;
    elements.signStatus.textContent = `Signed by ${record.signerName} on ${new Date(record.signedAt).toLocaleString()}.`;
  }
}

async function signRecommendation(event) {
  event.preventDefault();

  try {
    const response = await fetch(`/api/shares/${encodeURIComponent(shareId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signerName: elements.signerName.value,
        signerEmail: elements.signerEmail.value,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Sign-off could not be saved.");
    }

    currentRecord = payload;
    renderRecord(payload);
  } catch (error) {
    elements.signStatus.textContent = error.message;
    elements.signStatus.classList.add("error");
  }
}

function showError(message) {
  elements.document.textContent = message;
  elements.signStatus.textContent = "This recommendation cannot be signed until it loads.";
  elements.form.querySelector("button").disabled = true;
}
