const countMeasure = "__count";
const noBreakdown = "__none";
const defaultSeries = "All rows";
const palette = [
  "#51cbd1",
  "#c6735e",
  "#f7c784",
  "#e98cab",
  "#84bff0",
  "#9bc98a",
  "#b7a2e8",
  "#fb9a86",
  "#70a0af",
  "#d6a957",
  "#8aa7df",
  "#d47f9d",
];

const state = {
  rawRows: [],
  groupedRows: [],
  xValues: [],
  series: [],
  activeSeries: new Set(),
  selectedXValue: "",
  fileName: "",
  headers: [],
  readOnly: false,
  shareId: "",
  mapping: {
    xAxis: "",
    yAxis: countMeasure,
    breakdown: noBreakdown,
  },
};

const elements = {
  dropZone: document.querySelector("#dropZone"),
  fileInput: document.querySelector("#fileInput"),
  browseButton: document.querySelector("#browseButton"),
  mappingPanel: document.querySelector("#mappingPanel"),
  fieldCount: document.querySelector("#fieldCount"),
  xAxisColumn: document.querySelector("#xAxisColumn"),
  yAxisColumn: document.querySelector("#yAxisColumn"),
  breakdownColumn: document.querySelector("#breakdownColumn"),
  ownerLegend: document.querySelector("#ownerLegend"),
  chartGrid: document.querySelector("#chartGrid"),
  barChart: document.querySelector("#barChart"),
  chartTooltip: document.querySelector("#chartTooltip"),
  chartTitle: document.querySelector("#chartTitle"),
  yAxisTitle: document.querySelector("#yAxisTitle"),
  xAxisTitle: document.querySelector("#xAxisTitle"),
  selectedPipelineTitle: document.querySelector("#selectedPipelineTitle"),
  selectedPipelineMeta: document.querySelector("#selectedPipelineMeta"),
  pipelineBreakdown: document.querySelector("#pipelineBreakdown"),
  dataRows: document.querySelector("#dataRows"),
  sourceMeta: document.querySelector("#sourceMeta"),
  tableXHeader: document.querySelector("#tableXHeader"),
  tableBreakdownHeader: document.querySelector("#tableBreakdownHeader"),
  tableValueHeader: document.querySelector("#tableValueHeader"),
  copyShareLink: document.querySelector("#copyShareLink"),
  shareExpiresAt: document.querySelector("#shareExpiresAt"),
  clearData: document.querySelector("#clearData"),
  resetFilters: document.querySelector("#resetFilters"),
  statusMessage: document.querySelector("#statusMessage"),
};

startApp();

elements.browseButton.addEventListener("click", () => elements.fileInput.click());
elements.fileInput.addEventListener("change", () => {
  const file = elements.fileInput.files?.[0];
  if (file) handleFile(file);
  elements.fileInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
});

elements.dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file) handleFile(file);
});

elements.dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    elements.fileInput.click();
  }
});

[
  elements.xAxisColumn,
  elements.yAxisColumn,
  elements.breakdownColumn,
].forEach((select) => {
  select.addEventListener("change", applyMappingFromControls);
});

elements.resetFilters.addEventListener("click", () => {
  state.activeSeries = new Set(state.series.map((item) => item.name));
  state.selectedXValue = state.xValues[0] || "";
  updateUrl();
  renderDashboard();
  showStatus("Filters reset.");
});

elements.clearData.addEventListener("click", () => {
  clearAllData();
  clearUrlState();
  renderDashboard();
  showStatus("Data cleared.");
});

elements.copyShareLink.addEventListener("click", async () => {
  if (!state.groupedRows.length) {
    showStatus("Load data before copying a share link.");
    return;
  }

  let url;

  try {
    url = await buildShareUrl();
  } catch {
    showStatus("Short share link could not be created. Check share storage configuration.");
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    showStatus("Share link copied.");
  } catch {
    showStatus(url);
  }
});

async function startApp() {
  populateMappingControls();
  await initialiseFromUrl();
  applyReadOnlyMode();
  renderDashboard();
}

async function handleFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  try {
    let rows;
    let label = file.name;
    if (extension === "csv") {
      rows = parseCsv(await file.text());
    } else if (["xlsx", "xls"].includes(extension)) {
      const workbookData = await parseWorkbook(file);
      rows = workbookData.rows;
      label = workbookData.label;
    } else {
      throw new Error("Use an Excel or CSV file.");
    }

    if (!rows.length) throw new Error("No rows were found in that file.");

    startFreshUpload(label, rows);
    clearUrlState();
    renderDashboard();
    populateMappingControls();
    applyRawRows();
  } catch (error) {
    showStatus(error.message || "The file could not be read.");
  }
}

async function parseWorkbook(file) {
  if (!window.XLSX) {
    throw new Error("Excel parsing is still loading. Try again in a moment.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(buffer, { type: "array" });
  const sheets = workbook.SheetNames
    .map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "" });
      return { sheetName, rows };
    })
    .filter((sheet) => sheet.rows.length > 0);

  const bestSheet = sheets.find((sheet) => {
    const headers = Object.keys(sheet.rows[0] || {});
    const mapping = detectMapping(headers);
    return mapping.xAxis;
  }) || sheets[0];

  if (!bestSheet) return { rows: [], label: file.name };

  return {
    rows: bestSheet.rows,
    label: `${file.name} / ${bestSheet.sheetName}`,
  };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);

  const [headers = [], ...body] = rows.filter((item) => item.some((value) => value.trim() !== ""));
  const cleanHeaders = headers.map((header, index) => header.trim() || `Column ${index + 1}`);
  return body.map((values) =>
    cleanHeaders.reduce((record, header, index) => {
      record[header] = values[index] || "";
      return record;
    }, {}),
  );
}

function populateMappingControls() {
  const yOptions = [countMeasure, ...state.headers];
  const breakdownOptions = [noBreakdown, ...state.headers];

  fillSelect(elements.xAxisColumn, state.headers, state.mapping.xAxis);
  fillSelect(elements.yAxisColumn, yOptions, state.mapping.yAxis, "Count of rows");
  fillSelect(elements.breakdownColumn, breakdownOptions, state.mapping.breakdown || noBreakdown, "None");
  elements.fieldCount.textContent = `${state.headers.length} field${state.headers.length === 1 ? "" : "s"}`;
  elements.mappingPanel.classList.toggle("hidden", state.headers.length === 0);
}

function applyMappingFromControls() {
  if (!state.rawRows.length) return;

  state.mapping.xAxis = elements.xAxisColumn.value;
  state.mapping.yAxis = elements.yAxisColumn.value;
  state.mapping.breakdown = elements.breakdownColumn.value;
  hideTooltip();
  applyRawRows({ silent: true });
}

function fillSelect(select, options, selectedValue, specialLabel) {
  select.replaceChildren();
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option;
    item.textContent = option === countMeasure || option === noBreakdown ? specialLabel : option;
    item.selected = option === selectedValue;
    select.append(item);
  });
}

function detectMapping(headers) {
  const xAxis = findHeader(headers, ["pipeline", "stage", "status", "category", "type"]) || headers[0] || "";
  const breakdown = findHeader(headers, ["deal owner", "owner", "hubspot owner", "assignee", "rep"]) || noBreakdown;
  const yAxis = findHeader(headers, ["(count) deals", "count deals", "deal count", "count", "amount", "value"]) || countMeasure;
  return { xAxis, yAxis, breakdown };
}

function findHeader(headers, candidates) {
  const normalised = headers.map((header) => ({
    raw: header,
    key: normaliseHeader(header),
  }));

  for (const candidate of candidates) {
    const match = normalised.find((header) => header.key === normaliseHeader(candidate));
    if (match) return match.raw;
  }

  return "";
}

function normaliseHeader(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function applyRawRows(options = {}) {
  if (!state.mapping.xAxis) {
    clearReportRows();
    renderDashboard();
    showStatus("Choose an X-axis field to build the report.");
    return;
  }

  const grouped = new Map();
  state.rawRows.forEach((row) => {
    const xValue = normaliseDimensionValue(row[state.mapping.xAxis]);
    const seriesName = state.mapping.breakdown && state.mapping.breakdown !== noBreakdown
      ? normaliseDimensionValue(row[state.mapping.breakdown])
      : defaultSeries;
    const value = getMeasureValue(row, state.mapping.yAxis);

    if (!xValue || !seriesName) return;

    const key = `${xValue}|||${seriesName}`;
    grouped.set(key, (grouped.get(key) || 0) + value);
  });

  const groupedRows = [...grouped.entries()].map(([key, value]) => {
    const [xValue, seriesName] = key.split("|||");
    return { xValue, seriesName, value };
  });

  if (!groupedRows.length) {
    clearReportRows();
    renderDashboard();
    showStatus("No usable values were found for this configuration.");
    return;
  }

  initialiseData(groupedRows);
  if (!options.skipUrl) updateUrl();
  renderDashboard();
  if (!options.silent) showStatus(`Loaded ${state.fileName}.`);
}

function getMeasureValue(row, yAxis) {
  if (!yAxis || yAxis === countMeasure) return 1;
  const rawValue = row[yAxis];
  const numeric = parseNumber(rawValue);
  if (Number.isFinite(numeric)) return numeric;
  return String(rawValue ?? "").trim() ? 1 : 0;
}

function initialiseData(rows) {
  state.groupedRows = rows;
  state.xValues = unique(rows.map((row) => row.xValue));
  const seriesNames = unique(rows.map((row) => row.seriesName));
  state.series = seriesNames.map((name, index) => ({
    name,
    color: palette[index % palette.length],
  }));
  state.activeSeries = new Set(seriesNames);
  state.selectedXValue = state.xValues[0] || "";
}

function startFreshUpload(fileName, rows) {
  state.fileName = fileName;
  state.rawRows = rows;
  state.headers = Object.keys(rows[0] || {});
  state.mapping = detectMapping(state.headers);
  hideTooltip();
  clearReportRows();
}

function clearReportRows() {
  state.groupedRows = [];
  state.xValues = [];
  state.series = [];
  state.activeSeries = new Set();
  state.selectedXValue = "";
}

function clearAllData() {
  state.rawRows = [];
  state.groupedRows = [];
  state.xValues = [];
  state.series = [];
  state.activeSeries = new Set();
  state.selectedXValue = "";
  state.fileName = "";
  state.headers = [];
  state.mapping = {
    xAxis: "",
    yAxis: countMeasure,
    breakdown: noBreakdown,
  };
  hideTooltip();
  populateMappingControls();
}

async function initialiseFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shareId = params.get("share");

  if (shareId) {
    try {
      const shared = await fetchSharedDashboard(shareId);
      state.readOnly = true;
      state.shareId = shareId;
      loadSharedDashboard(shared);
    } catch {
      showStatus("The shared dashboard data could not be loaded.");
    }
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const encodedData = hashParams.get("data");

  if (!shareId && encodedData) {
    try {
      const shared = JSON.parse(decodeURIComponent(escape(window.atob(encodedData))));
      loadSharedDashboard(shared);
    } catch {
      showStatus("The shared dashboard data could not be loaded.");
    }
  }

  const stateParams = new URLSearchParams(window.location.search || window.location.hash.slice(1));
  const seriesParam = stateParams.get("series");
  const xParam = stateParams.get("x");

  if (seriesParam) {
    const allowed = new Set(state.series.map((item) => item.name));
    const selected = seriesParam
      .split(",")
      .map((item) => item.trim())
      .filter((item) => allowed.has(item));

    if (selected.length > 0) state.activeSeries = new Set(selected);
  }

  if (state.xValues.includes(xParam)) state.selectedXValue = xParam;
}

function applyReadOnlyMode() {
  document.body.classList.toggle("is-read-only", state.readOnly);

  if (!state.readOnly) return;

  elements.dropZone.setAttribute("aria-hidden", "true");
  showStatus("Shared report opened in read-only mode.");
}

async function fetchSharedDashboard(shareId) {
  const response = await fetch(`/api/shares/${encodeURIComponent(shareId)}`);

  if (!response.ok) {
    throw new Error("Share link not found.");
  }

  return response.json();
}

function loadSharedDashboard(shared) {
  if (!Array.isArray(shared.rows) || shared.rows.length === 0) return;

  state.fileName = shared.fileName || "Shared data";
  state.mapping = shared.mapping || state.mapping;

  if (Array.isArray(shared.rawRows) && shared.rawRows.length > 0) {
    state.rawRows = shared.rawRows;
    state.headers = Array.isArray(shared.headers) && shared.headers.length > 0
      ? shared.headers
      : Object.keys(shared.rawRows[0] || {});
    populateMappingControls();
    applyRawRows({ silent: true, skipUrl: true });
  } else {
    initialiseData(shared.rows);
  }

  if (Array.isArray(shared.activeSeries)) {
    const allowed = new Set(state.series.map((item) => item.name));
    const selected = shared.activeSeries.filter((item) => allowed.has(item));
    if (selected.length > 0) state.activeSeries = new Set(selected);
  }

  if (state.xValues.includes(shared.selectedXValue)) {
    state.selectedXValue = shared.selectedXValue;
  }
}

function renderDashboard() {
  renderLabels();
  renderLegend();
  renderBars();
  renderBreakdown(state.selectedXValue);
  renderTable();
}

function renderLabels() {
  const yLabel = getMeasureLabel();
  const xLabel = state.mapping.xAxis || "X-axis";
  const breakdownLabel = getBreakdownLabel();

  elements.chartTitle.textContent = yLabel;
  elements.yAxisTitle.textContent = yLabel;
  elements.xAxisTitle.textContent = xLabel;
  elements.tableXHeader.textContent = xLabel;
  elements.tableBreakdownHeader.textContent = breakdownLabel;
  elements.tableValueHeader.textContent = yLabel;
  elements.barChart.setAttribute("aria-label", `Vertical bar chart of ${yLabel} by ${xLabel}`);
}

function renderLegend() {
  elements.ownerLegend.replaceChildren();

  if (state.series.length <= 1 && state.series[0]?.name === defaultSeries) {
    return;
  }

  state.series.forEach((series) => {
    const isActive = state.activeSeries.has(series.name);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `legend-item${isActive ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `<span style="background:${series.color}"></span>${escapeHtml(series.name)}`;
    button.addEventListener("click", () => toggleSeries(series.name));
    elements.ownerLegend.append(button);
  });

}

function renderBars() {
  elements.barChart.replaceChildren();

  if (!state.xValues.length) {
    elements.chartGrid.style.setProperty("--tick-count", 1);
    elements.chartGrid.dataset.labels = "0";
    elements.chartGrid.style.width = "100%";
    elements.barChart.style.setProperty("--pipeline-count", 1);
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Load a spreadsheet to build a chart.";
    elements.barChart.append(empty);
    return;
  }

  const xTotals = getXTotals();
  const maxTotal = Math.max(1, ...Object.values(xTotals));
  const step = niceStep(maxTotal);
  const yMax = Math.max(step, Math.ceil(maxTotal / step) * step);
  const tickCount = Math.max(1, yMax / step);
  const plotHeight = 300;
  const barWidth = getDynamicBarWidth(state.xValues.length);

  elements.chartGrid.style.setProperty("--tick-count", tickCount);
  elements.chartGrid.dataset.labels = Array.from({ length: tickCount + 1 }, (_, index) => formatNumber(yMax - index * step)).join("\n");
  elements.chartGrid.style.width = "100%";
  elements.barChart.style.setProperty("--pipeline-count", Math.max(1, state.xValues.length));
  elements.barChart.style.setProperty("--bar-width", `${barWidth}px`);

  state.xValues.forEach((xValue) => {
    const total = xTotals[xValue] || 0;
    const barGroup = document.createElement("button");
    barGroup.type = "button";
    barGroup.className = `bar-group${state.selectedXValue === xValue ? " is-selected" : ""}`;
    barGroup.addEventListener("click", () => {
      state.selectedXValue = xValue;
      updateUrl();
      renderDashboard();
    });
    barGroup.addEventListener("pointerenter", (event) => showTooltip(event, xValue));
    barGroup.addEventListener("pointermove", (event) => positionTooltip(event));
    barGroup.addEventListener("pointerleave", hideTooltip);

    const valueLabel = document.createElement("strong");
    valueLabel.className = "bar-total";
    valueLabel.textContent = formatNumber(total);
    valueLabel.style.bottom = `${(total / yMax) * plotHeight + 7}px`;

    const stack = document.createElement("div");
    stack.className = "bar-stack";

    state.series
      .filter((series) => state.activeSeries.has(series.name))
      .reverse()
      .forEach((series) => {
        const value = getValue(xValue, series.name);
        if (value === 0 || total === 0) return;

        const segment = document.createElement("span");
        segment.className = "bar-segment";
        segment.title = `${series.name}: ${formatNumber(value)}`;
        segment.style.background = series.color;
        segment.style.height = `${(value / yMax) * 100}%`;
        stack.append(segment);
      });

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = xValue;

    barGroup.append(valueLabel, stack, label);
    elements.barChart.append(barGroup);
  });
}

function renderBreakdown(xValue) {
  const rows = state.series
    .map((series) => ({ ...series, value: getValue(xValue, series.name) }))
    .filter((row) => row.value > 0 && state.activeSeries.has(row.name))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

  const total = sum(rows.map((row) => row.value));
  elements.selectedPipelineTitle.textContent = xValue || "Selection details";
  elements.selectedPipelineMeta.textContent = `${formatNumber(total)} visible ${getMeasureLabel().toLowerCase()} across ${rows.length} ${getBreakdownLabel().toLowerCase()} value${rows.length === 1 ? "" : "s"}.`;
  elements.pipelineBreakdown.replaceChildren();

  if (rows.length === 0) {
    elements.pipelineBreakdown.innerHTML = `<p class="empty-state">No rows match the current configuration.</p>`;
    return;
  }

  rows.forEach((row) => {
    const percent = total ? Math.round((row.value / total) * 100) : 0;
    const item = document.createElement("div");
    item.className = "breakdown-item";
    item.innerHTML = `
      <div class="breakdown-label">
        <span style="background:${row.color}"></span>
        <strong>${escapeHtml(row.name)}</strong>
      </div>
      <div class="breakdown-value">
        <strong>${formatNumber(row.value)}</strong>
        <span>${percent}%</span>
      </div>
      <div class="meter"><span style="width:${percent}%; background:${row.color}"></span></div>
    `;
    elements.pipelineBreakdown.append(item);
  });
}

function renderTable() {
  const rows = state.groupedRows
    .filter((row) => state.activeSeries.has(row.seriesName))
    .sort((a, b) => state.xValues.indexOf(a.xValue) - state.xValues.indexOf(b.xValue) || b.value - a.value);
  const visibleTotal = sum(rows.map((row) => row.value));

  elements.sourceMeta.textContent = state.groupedRows.length
    ? `${state.fileName}: ${state.groupedRows.length} grouped rows.`
    : "No data loaded.";
  elements.dataRows.replaceChildren();

  rows.forEach((row) => {
    const series = state.series.find((item) => item.name === row.seriesName);
    const share = visibleTotal ? Math.round((row.value / visibleTotal) * 100) : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.xValue)}</td>
      <td><span class="table-dot" style="background:${series?.color || palette[0]}"></span>${escapeHtml(row.seriesName)}</td>
      <td>${formatNumber(row.value)}</td>
      <td>${share}%</td>
    `;
    elements.dataRows.append(tr);
  });
}

function toggleSeries(seriesName) {
  if (state.activeSeries.has(seriesName) && state.activeSeries.size > 1) {
    state.activeSeries.delete(seriesName);
  } else {
    state.activeSeries.add(seriesName);
  }

  updateUrl();
  renderDashboard();
}

function showTooltip(event, xValue) {
  renderTooltip(xValue);
  elements.chartTooltip.classList.remove("hidden");
  positionTooltip(event);
}

function renderTooltip(xValue) {
  const rows = state.series
    .map((series) => ({ ...series, value: getValue(xValue, series.name) }))
    .filter((row) => row.value > 0 && state.activeSeries.has(row.name));
  const total = sum(rows.map((row) => row.value));

  elements.chartTooltip.innerHTML = `
    <strong>${escapeHtml(xValue)}</strong>
    <span>${escapeHtml(getMeasureLabel())}</span>
    ${rows
      .map((row) => {
        const percent = total ? Math.round((row.value / total) * 100) : 0;
        return `<div><i style="background:${row.color}"></i>${escapeHtml(row.name)}<b>${formatNumber(row.value)}</b><em>(${percent}%)</em></div>`;
      })
      .join("")}
    <footer>Totals: <b>${formatNumber(total)}</b></footer>
  `;
}

function positionTooltip(event) {
  const offset = 18;
  elements.chartTooltip.style.left = `${event.clientX + offset}px`;
  elements.chartTooltip.style.top = `${event.clientY + offset}px`;
}

function hideTooltip() {
  elements.chartTooltip.classList.add("hidden");
}

function getValue(xValue, seriesName) {
  return state.groupedRows.find((row) => row.xValue === xValue && row.seriesName === seriesName)?.value || 0;
}

function getXTotals() {
  return state.xValues.reduce((totals, xValue) => {
    totals[xValue] = state.groupedRows
      .filter((row) => row.xValue === xValue && state.activeSeries.has(row.seriesName))
      .reduce((total, row) => total + row.value, 0);
    return totals;
  }, {});
}

function getSeriesTotals() {
  return state.series.reduce((totals, series) => {
    if (!state.activeSeries.has(series.name)) return totals;
    totals[series.name] = state.groupedRows
      .filter((row) => row.seriesName === series.name)
      .reduce((total, row) => total + row.value, 0);
    return totals;
  }, {});
}

function getLargestEntry(values) {
  return Object.entries(values)
    .filter((entry) => entry[1] > 0)
    .sort((a, b) => b[1] - a[1])[0];
}

function getDynamicBarWidth(count) {
  if (count <= 6) return 150;
  if (count <= 10) return 110;
  if (count <= 16) return 78;
  if (count <= 24) return 52;
  return 34;
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.shareId) params.set("share", state.shareId);
  if (state.selectedXValue) params.set("x", state.selectedXValue);
  if (state.activeSeries.size !== state.series.length) {
    params.set("series", [...state.activeSeries].join(","));
  }
  window.history.replaceState({}, "", params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname);
}

function clearUrlState() {
  window.history.replaceState({}, "", window.location.pathname);
}

async function buildShareUrl() {
  const payload = {
    fileName: state.fileName,
    headers: state.headers,
    rawRows: state.rawRows,
    mapping: state.mapping,
    rows: state.groupedRows,
    selectedXValue: state.selectedXValue,
    activeSeries: [...state.activeSeries],
    expiresAt: getShareExpiryIso(),
  };

  const response = await fetch("/api/shares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Share API failed.");

  const { id } = await response.json();
  return `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(id)}`;
}

function getShareExpiryIso() {
  const selectedDate = elements.shareExpiresAt.value;
  if (!selectedDate) return null;

  return new Date(`${selectedDate}T23:59:59`).toISOString();
}

function getMeasureLabel() {
  if (!state.mapping.yAxis || state.mapping.yAxis === countMeasure) return "Count of rows";
  return `Sum/count of ${state.mapping.yAxis}`;
}

function getBreakdownLabel() {
  return state.mapping.breakdown && state.mapping.breakdown !== noBreakdown
    ? state.mapping.breakdown
    : "Series";
}

function normaliseDimensionValue(value) {
  const text = String(value ?? "").trim();
  return text || "Blank";
}

function showStatus(message) {
  elements.statusMessage.textContent = message;
  window.clearTimeout(showStatus.timeout);
  showStatus.timeout = window.setTimeout(() => {
    elements.statusMessage.textContent = "";
  }, 6000);
}

function niceStep(maxValue) {
  const roughStep = maxValue / 6;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1));
  const residual = roughStep / magnitude;

  if (residual > 5) return 10 * magnitude;
  if (residual > 2) return 5 * magnitude;
  if (residual > 1) return 2 * magnitude;
  return magnitude;
}

function unique(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  return Number(String(value).replaceAll(",", "").replace(/[$£€%]/g, "").trim());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
