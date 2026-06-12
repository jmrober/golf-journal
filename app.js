const STORAGE_KEY = "minimal-golf-journal:v1";

const sampleRounds = [
  {
    id: "round_sample_timber_creek",
    type: "round",
    source: "sample",
    createdAt: "2026-05-23T12:00:00.000Z",
    updatedAt: "2026-05-23T12:00:00.000Z",
    entryDate: "2026-05-23",
    rawInput:
      "Played Timber Creek Saturday around 5:50 in the morning from the white tees. Walked 18 and shot 86, best round ever.",
    title: "Timber Creek - 86",
    summary: "Best round ever. Walked 18 from the white tees.",
    courseName: "Timber Creek",
    teeTime: "05:50",
    holes: 18,
    tees: "white",
    score: 86,
    walking: true,
    riding: false,
    cost: 44,
    notes: "Best round ever. Driver was decent, irons were good, putting was shaky.",
    tags: ["walking", "best-round", "early-morning", "putting"],
  },
  {
    id: "round_sample_shadowbrooke",
    type: "round",
    source: "sample",
    createdAt: "2026-05-31T14:00:00.000Z",
    updatedAt: "2026-05-31T14:00:00.000Z",
    entryDate: "2026-05-31",
    rawInput:
      "Played Shadowbrooke at 5:39 in the morning, walked 18, shot 91, cost 44 dollars. Driver was leaking right, putting was okay.",
    title: "Shadowbrooke - 91",
    summary: "Driver leaked right. Putting was okay.",
    courseName: "Shadowbrooke",
    teeTime: "05:39",
    holes: 18,
    tees: "",
    score: 91,
    walking: true,
    riding: false,
    cost: 44,
    notes: "Course was expensive and kind of mid. Driver was leaking right, putting was okay, irons were inconsistent.",
    tags: ["walking", "driver", "putting"],
  },
];

const els = {
  rawInput: document.querySelector("#raw-input"),
  parseEntry: document.querySelector("#parse-entry"),
  clearEntry: document.querySelector("#clear-entry"),
  preview: document.querySelector("#preview"),
  confidence: document.querySelector("#parse-confidence"),
  form: document.querySelector("#entry-form"),
  courseName: document.querySelector("#course-name"),
  entryDate: document.querySelector("#entry-date"),
  teeTime: document.querySelector("#tee-time"),
  holes: document.querySelector("#holes"),
  tees: document.querySelector("#tees"),
  score: document.querySelector("#score"),
  travel: document.querySelector("#travel"),
  cost: document.querySelector("#cost"),
  notes: document.querySelector("#notes"),
  tags: document.querySelector("#tags"),
  entryList: document.querySelector("#entry-list"),
  insightList: document.querySelector("#insight-list"),
  loadSample: document.querySelector("#load-sample"),
  exportJson: document.querySelector("#export-json"),
  statRounds: document.querySelector("#stat-rounds"),
  statRoundsDetail: document.querySelector("#stat-rounds-detail"),
  statAverage: document.querySelector("#stat-average"),
  statAverageDetail: document.querySelector("#stat-average-detail"),
  statBest: document.querySelector("#stat-best"),
  statBestDetail: document.querySelector("#stat-best-detail"),
  statCost: document.querySelector("#stat-cost"),
  statCostDetail: document.querySelector("#stat-cost-detail"),
};

let editingId = null;
let parsedRawInput = "";

function readStore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data?.version === 1 && Array.isArray(data.entries)) {
      return data;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    version: 1,
    settings: {
      defaultWalking: true,
      defaultHoles: 18,
      aiParsingEnabled: false,
      weatherLookupEnabled: false,
    },
    entries: [],
  };
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

function parseEntry(text) {
  const raw = text.trim();
  const lower = raw.toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  const scoreMatch = lower.match(/\b(?:shot|scored|carded|posted)\s+(\d{2,3})\b/) || lower.match(/\b(\d{2,3})\b/);
  const costMatch = lower.match(/\b(?:cost|paid|was)\s+(?:about\s+)?\$?(\d+(?:\.\d{1,2})?)\s*(?:bucks|dollars)?\b/);
  const holesMatch = lower.match(/\b(9|18)\s*holes?\b/) || lower.match(/\b(?:walked|rode|played)\s+(9|18)\b/);
  const timeMatch = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|in the morning|at night|evening)?\b/);
  const teesMatch = lower.match(/\b(?:from the|off the|played the)\s+([a-z]+)\s+tees?\b/);
  const course = extractCourse(raw);
  const tags = inferTags(lower);

  const teeTime = timeMatch ? normalizeTime(timeMatch) : "";
  const walking = /\bwalked|walking\b/.test(lower);
  const riding = /\brode|riding|cart\b/.test(lower);

  return {
    courseName: course,
    entryDate: inferDate(lower) || today,
    teeTime,
    holes: holesMatch ? Number(holesMatch[1]) : 18,
    tees: teesMatch?.[1] || "",
    score: scoreMatch ? Number(scoreMatch[1]) : "",
    travel: walking ? "walking" : riding ? "riding" : "",
    cost: costMatch ? Number(costMatch[1]) : "",
    notes: raw,
    tags,
    confidence: buildConfidence({ course, score: scoreMatch, time: timeMatch, cost: costMatch }),
  };
}

function extractCourse(raw) {
  const patterns = [
    /\bplayed\s+(.+?)\s+(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|yesterday|today|at|around|on|from|and|,|$)/i,
    /\bat\s+([A-Z][A-Za-z0-9 '&.-]+?)(?:\s+at|\s+around|,|$)/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      return titleCase(cleanCourse(match[1]));
    }
  }

  return "";
}

function cleanCourse(value) {
  return value
    .replace(/\b(?:golf club|gc|course)\b$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function normalizeTime(match) {
  let hours = Number(match[1]);
  const minutes = match[2] || "00";
  const meridian = match[3] || "";

  if (/p|evening|night/.test(meridian) && hours < 12) hours += 12;
  if ((/a|morning/.test(meridian) || !meridian) && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function inferDate(lower) {
  const today = new Date();
  const date = new Date(today);

  if (/\byesterday\b/.test(lower)) {
    date.setDate(today.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const namedDay = weekdays.find((day) => lower.includes(day));

  if (namedDay) {
    const target = weekdays.indexOf(namedDay);
    const diff = (today.getDay() - target + 7) % 7;
    date.setDate(today.getDate() - diff);
    return date.toISOString().slice(0, 10);
  }

  return "";
}

function inferTags(lower) {
  const tagMap = {
    walking: ["walked", "walking"],
    riding: ["rode", "riding", "cart"],
    driver: ["driver", "tee shot", "tee shots"],
    irons: ["iron", "irons", "approach"],
    putting: ["putt", "putting"],
    wedges: ["wedge", "wedges", "short game", "chipping"],
    penalties: ["penalty", "penalties", "lost ball"],
    "best-round": ["best round", "personal best", "pb"],
    "early-morning": ["morning", "am", "a.m."],
  };

  return Object.entries(tagMap)
    .filter(([, words]) => words.some((word) => lower.includes(word)))
    .map(([tag]) => tag);
}

function buildConfidence(fields) {
  const count = Object.values(fields).filter(Boolean).length;
  if (count >= 3) return "Strong parse";
  if (count >= 2) return "Good start";
  return "Needs review";
}

function fillForm(entry) {
  els.courseName.value = entry.courseName || "";
  els.entryDate.value = entry.entryDate || new Date().toISOString().slice(0, 10);
  els.teeTime.value = entry.teeTime || "";
  els.holes.value = String(entry.holes || 18);
  els.tees.value = entry.tees || "";
  els.score.value = entry.score || "";
  els.travel.value = entry.travel || (entry.walking ? "walking" : entry.riding ? "riding" : "");
  els.cost.value = entry.cost ?? "";
  els.notes.value = entry.notes || "";
  els.tags.value = (entry.tags || []).join(", ");
  els.confidence.textContent = entry.confidence || "Editing";
  els.preview.classList.remove("hidden");
}

function formToEntry() {
  const now = new Date().toISOString();
  const travel = els.travel.value;
  const courseName = els.courseName.value.trim();
  const score = Number(els.score.value);
  const entryDate = els.entryDate.value;
  const tags = els.tags.value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return {
    id: editingId || `round_${crypto.randomUUID()}`,
    type: "round",
    source: parsedRawInput ? "text" : "manual",
    createdAt: editingId ? getEntry(editingId)?.createdAt || now : now,
    updatedAt: now,
    entryDate,
    rawInput: parsedRawInput,
    title: `${courseName} - ${score}`,
    summary: buildSummary(),
    courseName,
    teeTime: els.teeTime.value || null,
    holes: Number(els.holes.value),
    tees: els.tees.value.trim() || null,
    score,
    walking: travel === "walking" ? true : travel === "riding" ? false : null,
    riding: travel === "riding" ? true : travel === "walking" ? false : null,
    cost: els.cost.value ? Number(els.cost.value) : null,
    notes: els.notes.value.trim(),
    tags,
  };
}

function buildSummary() {
  const pieces = [];
  if (els.travel.value) pieces.push(els.travel.value === "walking" ? `Walked ${els.holes.value}` : `Rode ${els.holes.value}`);
  if (els.tees.value.trim()) pieces.push(`${els.tees.value.trim()} tees`);
  if (els.cost.value) pieces.push(`$${Number(els.cost.value).toFixed(0)}`);

  const note = els.notes.value.trim();
  return [pieces.join(" · "), note].filter(Boolean).join(". ");
}

function getEntry(id) {
  return readStore().entries.find((entry) => entry.id === id);
}

function saveEntry(entry) {
  const store = readStore();
  const nextEntries = store.entries.some((item) => item.id === entry.id)
    ? store.entries.map((item) => (item.id === entry.id ? entry : item))
    : [entry, ...store.entries];

  writeStore({ ...store, entries: nextEntries });
}

function deleteEntry(id) {
  const store = readStore();
  writeStore({ ...store, entries: store.entries.filter((entry) => entry.id !== id) });
}

function stats(entries) {
  const rounds = entries.filter((entry) => entry.type === "round");
  const scores = rounds.map((round) => round.score).filter(Number.isFinite);
  const costs = rounds.map((round) => round.cost || 0);
  const totalCost = costs.reduce((sum, cost) => sum + cost, 0);
  const average = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
  const best = scores.length ? Math.min(...scores) : null;
  const walking = rounds.filter((round) => round.walking).length;

  return {
    rounds,
    scores,
    totalCost,
    average,
    best,
    walkingPercent: rounds.length ? Math.round((walking / rounds.length) * 100) : null,
  };
}

function render() {
  const store = readStore();
  const entries = [...store.entries].sort((a, b) => b.entryDate.localeCompare(a.entryDate));
  const calculated = stats(entries);

  renderStats(calculated);
  renderJournal(entries);
  renderInsights(entries, calculated);
}

function renderStats(calculated) {
  els.statRounds.textContent = calculated.rounds.length;
  els.statRoundsDetail.textContent = calculated.rounds.length === 1 ? "1 saved round" : `${calculated.rounds.length} saved rounds`;
  els.statAverage.textContent = calculated.average ? calculated.average.toFixed(1) : "—";
  els.statAverageDetail.textContent = calculated.scores.length ? "Scoring baseline" : "Across saved rounds";
  els.statBest.textContent = calculated.best || "—";
  els.statBestDetail.textContent = calculated.best ? "Lowest saved score" : "Keep stacking data";
  els.statCost.textContent = `$${calculated.totalCost.toFixed(0)}`;
  els.statCostDetail.textContent = calculated.totalCost ? "Tracked round costs" : "Add cost to rounds";
}

function renderJournal(entries) {
  if (!entries.length) {
    els.entryList.innerHTML = '<div class="empty-state">No rounds logged yet. Add your first dictated round and it will show up here.</div>';
    return;
  }

  els.entryList.innerHTML = entries
    .map(
      (entry) => `
        <article class="entry-card">
          <div>
            <p class="entry-meta">ROUND · ${formatDate(entry.entryDate)}</p>
            <h3>${escapeHtml(entry.courseName)}</h3>
            <p class="entry-summary">${escapeHtml(entry.summary || entry.notes || "")}</p>
            <div class="tag-list">
              ${(entry.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="card-actions">
              <button class="text-button" data-action="edit" data-id="${entry.id}" type="button">Edit</button>
              <button class="text-button danger" data-action="delete" data-id="${entry.id}" type="button">Delete</button>
            </div>
          </div>
          <div class="score-badge">${entry.score}</div>
        </article>
      `,
    )
    .join("");
}

function renderInsights(entries, calculated) {
  if (calculated.rounds.length < 2) {
    els.insightList.innerHTML = '<div class="empty-state">Log a few rounds first. Insights get better after 3-5 rounds.</div>';
    return;
  }

  const courseCounts = countBy(calculated.rounds.map((round) => round.courseName));
  const tagCounts = countBy(calculated.rounds.flatMap((round) => round.tags || []));
  const trend = calculated.scores.length >= 2 ? calculated.scores[0] - calculated.scores[calculated.scores.length - 1] : 0;

  els.insightList.innerHTML = [
    insight("Score trend", trend < 0 ? `Recent score is ${Math.abs(trend)} higher than oldest saved round.` : `Recent score is ${trend} lower than oldest saved round.`),
    insight("Walking", calculated.walkingPercent === null ? "Walking data is missing." : `${calculated.walkingPercent}% of saved rounds were walked.`),
    insight("Most played course", topLabel(courseCounts) || "No course pattern yet."),
    insight("Common themes", topLabel(tagCounts) || "Tags will reveal repeated misses and strengths."),
  ].join("");
}

function insight(title, body) {
  return `<div class="insight"><strong>${escapeHtml(title)}</strong>${escapeHtml(body)}</div>`;
}

function countBy(values) {
  return values.filter(Boolean).reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function topLabel(counts) {
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.parseEntry.addEventListener("click", () => {
  const text = els.rawInput.value.trim();
  if (!text) {
    els.rawInput.focus();
    return;
  }

  editingId = null;
  parsedRawInput = text;
  fillForm(parseEntry(text));
});

els.clearEntry.addEventListener("click", () => {
  editingId = null;
  parsedRawInput = "";
  els.rawInput.value = "";
  els.form.reset();
  els.preview.classList.add("hidden");
});

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = formToEntry();
  saveEntry(entry);
  editingId = null;
  parsedRawInput = "";
  els.rawInput.value = "";
  els.form.reset();
  els.preview.classList.add("hidden");
  render();
  document.querySelector("#journal").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.entryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const entry = getEntry(id);
  if (!entry) return;

  if (action === "delete") {
    deleteEntry(id);
    render();
    return;
  }

  editingId = id;
  parsedRawInput = entry.rawInput || "";
  fillForm({
    ...entry,
    travel: entry.walking ? "walking" : entry.riding ? "riding" : "",
    confidence: "Editing",
  });
  document.querySelector("#preview").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.loadSample.addEventListener("click", () => {
  const store = readStore();
  const ids = new Set(store.entries.map((entry) => entry.id));
  const entries = [...store.entries, ...sampleRounds.filter((entry) => !ids.has(entry.id))];
  writeStore({ ...store, entries });
  render();
});

els.exportJson.addEventListener("click", () => {
  const data = JSON.stringify(readStore(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "minimal-golf-journal-export.json";
  link.click();
  URL.revokeObjectURL(url);
});

render();
