const tableBody = document.getElementById("signalsTableBody");
const totalSignals = document.getElementById("totalSignals");
const longSignals = document.getElementById("longSignals");
const shortSignals = document.getElementById("shortSignals");
const strongSignals = document.getElementById("strongSignals");
const typeFilter = document.getElementById("typeFilter");

let allSignals = [];

function normalizeSignalType(type) {
  if (type === "TRACK_CANDIDATE") {
    return "LONG_TRACK_CANDIDATE";
  }

  if (type === "STRONG_TRACK_CANDIDATE") {
    return "LONG_STRONG_TRACK_CANDIDATE";
  }

  return type;
}

function isLong(type) {
  return type.includes("LONG");
}

function isShort(type) {
  return type.includes("SHORT");
}

function isStrong(type) {
  return type.includes("STRONG");
}

function formatTime(timeString) {
  if (!timeString) return "-";

  const date = new Date(timeString);

  if (Number.isNaN(date.getTime())) {
    return timeString;
  }

  // TR timezone için
  const trDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
  );

  const day = String(trDate.getDate()).padStart(2, "0");
  const month = String(trDate.getMonth() + 1).padStart(2, "0");
  const year = trDate.getFullYear();

  const hours = String(trDate.getHours()).padStart(2, "0");
  const minutes = String(trDate.getMinutes()).padStart(2, "0");
  const seconds = String(trDate.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function normalizeRecord(record) {
  const normalizedType = normalizeSignalType(record.signal);

  return {
    time: record.time,
    symbol: record.symbol,
    type: normalizedType,
    score: Number(record.score ?? 0),
    priceChange: Number(record.price ?? 0),
    volumeUplift: Number(record.volume ?? 0),
    correlated: Array.isArray(record.correlated) ? record.correlated : [],
    reason: record.reason ?? ""
  };
}

async function loadSignals() {
  try {
    const response = await fetch("/opportunitydashboard/data/signal-history.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load signal history: ${response.status}`);
    }

    const rawText = await response.text();

    const lines = rawText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    allSignals = lines
      .map(line => JSON.parse(line))
      .map(normalizeRecord)
      .reverse();

    renderDashboard();
  } catch (error) {
    console.error("Dashboard load error:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">Failed to load signal history.</td>
      </tr>
    `;

    totalSignals.textContent = "0";
    longSignals.textContent = "0";
    shortSignals.textContent = "0";
    strongSignals.textContent = "0";
  }
}

function renderStats(data) {
  totalSignals.textContent = data.length;
  longSignals.textContent = data.filter(s => isLong(s.type)).length;
  shortSignals.textContent = data.filter(s => isShort(s.type)).length;
  strongSignals.textContent = data.filter(s => isStrong(s.type)).length;
}

function getFilteredSignals() {
  const value = typeFilter.value;

  if (value === "LONG") {
    return allSignals.filter(signal => isLong(signal.type));
  }

  if (value === "SHORT") {
    return allSignals.filter(signal => isShort(signal.type));
  }

  if (value === "STRONG") {
    return allSignals.filter(signal => isStrong(signal.type));
  }

  return allSignals;
}

function renderTable(data) {
  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">No signals match the selected filter.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = data.map(signal => {
    const directionClass = isLong(signal.type) ? "long" : "short";
    const strongClass = isStrong(signal.type) ? "strong" : "";

    return `
      <tr>
        <td>${formatTime(signal.time)}</td>
        <td>${signal.symbol}</td>
        <td>
          <span class="type-pill ${directionClass} ${strongClass}">
            ${signal.type}
          </span>
        </td>
        <td>${signal.score.toFixed(2)}</td>
        <td>${signal.priceChange.toFixed(2)}%</td>
        <td>${signal.volumeUplift.toFixed(2)}%</td>
        <td>${signal.correlated.length ? signal.correlated.join(", ") : "-"}</td>
      </tr>
    `;
  }).join("");
}

function renderDashboard() {
  const filteredSignals = getFilteredSignals();
  renderStats(allSignals);
  renderTable(filteredSignals);
}

typeFilter.addEventListener("change", renderDashboard);

loadSignals();