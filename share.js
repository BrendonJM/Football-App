const params = new URLSearchParams(window.location.search);
const shareId = params.get("id");

const elements = {
  title: document.querySelector("#shareTitle"),
  document: document.querySelector("#shareDocument"),
  pdfLink: document.querySelector("#sharePdfLink"),
  wordLink: document.querySelector("#shareWordLink"),
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
  elements.wordLink.href = `/api/word/${encodeURIComponent(shareId)}`;
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
  renderDocument(record.documentText || "");

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

function renderDocument(text) {
  elements.document.innerHTML = "";
  const blocks = normalizeDocumentBlocks(text);

  if (!blocks.length || !blocks[0]) {
    elements.document.textContent = "No recommendation text was provided.";
    return;
  }

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;

    if (isPipeTable(lines)) {
      elements.document.append(renderTable(lines));
      continue;
    }

    if (isHeading([lines[0]]) && isPipeTable(lines.slice(1))) {
      const heading = document.createElement(lines[0].match(/^\d+\.\s/) ? "h2" : "h3");
      heading.textContent = lines[0];
      elements.document.append(heading);
      elements.document.append(renderTable(lines.slice(1)));
      continue;
    }

    if (isHeading(lines)) {
      const heading = document.createElement(lines[0].match(/^\d+\.\s/) ? "h2" : "h3");
      heading.textContent = lines[0];
      elements.document.append(heading);
      if (lines.length > 1) {
        elements.document.append(renderParagraph(lines.slice(1).join(" ")));
      }
      continue;
    }

    if (lines.every((line) => /^[-•]\s+/.test(line))) {
      const list = document.createElement("ul");
      for (const line of lines) {
        const item = document.createElement("li");
        item.textContent = line.replace(/^[-•]\s+/, "");
        list.append(item);
      }
      elements.document.append(list);
      continue;
    }

    elements.document.append(renderParagraph(lines.join(" ")));
  }
}

function normalizeDocumentBlocks(text) {
  const rawBlocks = String(text || "")
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length);
  const blocks = [];

  for (let index = 0; index < rawBlocks.length; index += 1) {
    const lines = rawBlocks[index];

    if (isPartialPipeBlock(lines)) {
      const merged = [...lines];
      while (isPartialPipeBlock(rawBlocks[index + 1] || [])) {
        index += 1;
        merged.push(...rawBlocks[index]);
      }
      blocks.push(merged.join("\n"));
      continue;
    }

    blocks.push(lines.join("\n"));
  }

  return blocks;
}

function isPartialPipeBlock(lines) {
  return lines.length > 0 && lines.some(isPipeRow) && lines.every((line) => isPipeRow(line) || isPipeSeparator(line));
}

function isHeading(lines) {
  return lines.length === 1 && !lines[0].includes("|") && (/^\d+\.\s+\S/.test(lines[0]) || /^[A-Z][^.!?]{2,80}$/.test(lines[0]));
}

function isPipeTable(lines) {
  const nonEmpty = lines.filter(Boolean);
  const rows = nonEmpty.filter(isPipeRow);
  return rows.length >= 2 && nonEmpty.every((line) => isPipeRow(line) || isPipeSeparator(line));
}

function isPipeRow(line) {
  return line.includes("|") && !isPipeSeparator(line);
}

function isPipeSeparator(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function renderTable(lines) {
  const table = document.createElement("table");
  const rows = lines
    .filter(isPipeRow)
    .map((line) => line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim() || "—"));
  const columnCount = Math.max(...rows.map((row) => row.length));

  rows.forEach((row, rowIndex) => {
    const tableRow = document.createElement("tr");
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const cell = document.createElement(rowIndex === 0 ? "th" : "td");
      cell.textContent = row[columnIndex] || "—";
      tableRow.append(cell);
    }
    table.append(tableRow);
  });

  return table;
}

function renderParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}
