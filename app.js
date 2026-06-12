const STORAGE_KEY = "minimal-golf-journal:v1";

const sampleEntries = [
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
  {
    id: "practice_sample_putting",
    type: "practice",
    source: "sample",
    createdAt: "2026-06-02T18:00:00.000Z",
    updatedAt: "2026-06-02T18:00:00.000Z",
    entryDate: "2026-06-02",
    rawInput: "Practiced putting for 30 minutes in the garage. Focused on start line and speed control.",
    title: "Putting practice",
    summary: "30 minutes focused on start line and speed control.",
    notes: "Contact felt steady. Need more work on four-foot putts.",
    tags: ["putting", "practice"],
    location: "Garage",
    durationMinutes: 30,
    focusAreas: ["putting", "start line", "speed control"],
  },
  {
    id: "workout_sample_mobility",
    type: "workout",
    source: "sample",
    createdAt: "2026-06-04T12:00:00.000Z",
    updatedAt: "2026-06-04T12:00:00.000Z",
    entryDate: "2026-06-04",
    rawInput: "Did a golf workout today. Mobility, carries, core, and goblet squats for about 35 minutes. Hips were tight.",
    title: "Golf workout",
    summary: "35 minutes of mobility, carries, core, and goblet squats.",
    notes: "Felt good overall, but hips were tight.",
    tags: ["workout", "mobility", "core"],
    durationMinutes: 35,
    workoutType: "golf-specific",
    golfRelevance: "Mobility and core work for better rotation.",
  },
];

const els = {
  rawInput: document.querySelector("#raw-input"),
  toggleDictation: document.querySelector("#toggle-dictation"),
  voiceStatus: document.querySelector("#voice-status"),
  parseEntry: document.querySelector("#parse-entry"),
  clearEntry: document.querySelector("#clear-entry"),
  preview: document.querySelector("#preview"),
  confidence: document.querySelector("#parse-confidence"),
  form: document.querySelector("#entry-form"),
  entryType: document.querySelector("#entry-type"),
  entryTitle: document.querySelector("#entry-title"),
  entryDate: document.querySelector("#entry-date"),
  roundFields: document.querySelector("#round-fields"),
  activityFields: document.querySelector("#activity-fields"),
  teeTime: document.querySelector("#tee-time"),
  holes: document.querySelector("#holes"),
  tees: document.querySelector("#tees"),
  score: document.querySelector("#score"),
  travel: document.querySelector("#travel"),
  duration: document.querySelector("#duration"),
  location: document.querySelector("#location"),
  focus: document.querySelector("#focus"),
  cost: document.querySelector("#cost"),
  notes: document.querySelector("#notes"),
  tags: document.querySelector("#tags"),
  saveEntry: document.querySelector("#save-entry"),
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
let recognition = null;
let isListening = false;
let dictationBaseText = "";
let dictationUsed = false;

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

function setupDictation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    els.toggleDictation.disabled = true;
    els.voiceStatus.textContent = "Voice dictation is not supported in this browser.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.addEventListener("start", () => {
    isListening = true;
    dictationBaseText = els.rawInput.value.trim();
    setDictationState("listening", "Listening...");
  });

  recognition.addEventListener("result", (event) => {
    let finalText = "";
    let interimText = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0]?.transcript?.trim();
      if (!transcript) continue;

      if (event.results[index].isFinal) {
        finalText += `${transcript} `;
      } else {
        interimText += `${transcript} `;
      }
    }

    if (finalText) {
      dictationUsed = true;
      dictationBaseText = [dictationBaseText, finalText.trim()].filter(Boolean).join(" ");
    }

    els.rawInput.value = [dictationBaseText, interimText.trim()].filter(Boolean).join(" ");
    els.voiceStatus.textContent = interimText ? "Listening..." : "Dictation captured.";
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    setDictationState("idle", els.rawInput.value.trim() ? "Dictation stopped." : "Voice dictation ready.");
  });

  recognition.addEventListener("error", (event) => {
    isListening = false;
    setDictationState("idle", voiceErrorMessage(event.error));
  });
}

function toggleDictation() {
  if (!recognition) return;

  if (isListening) {
    recognition.stop();
    return;
  }

  try {
    recognition.start();
  } catch {
    els.voiceStatus.textContent = "Dictation is already starting.";
  }
}

function setDictationState(state, message) {
  const listening = state === "listening";
  els.toggleDictation.classList.toggle("is-listening", listening);
  els.toggleDictation.setAttribute("aria-pressed", String(listening));
  els.toggleDictation.textContent = listening ? "Stop Dictation" : "Start Dictation";
  els.voiceStatus.textContent = message;
}

function voiceErrorMessage(error) {
  if (error === "not-allowed" || error === "service-not-allowed") return "Microphone access was blocked.";
  if (error === "no-speech") return "No speech detected.";
  if (error === "audio-capture") return "No microphone was found.";
  if (error === "network") return "Voice dictation needs a network connection in this browser.";
  return "Voice dictation stopped.";
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
  const type = detectEntryType(lower);
  const durationMatch = lower.match(/\b(?:for|about|around)?\s*(\d{1,3})\s*(?:minutes?|mins?|min|hours?|hrs?)\b/);
  const score = type === "round" ? extractScore(lower) : "";
  const cost = type === "round" ? extractCost(lower) : "";
  const holes = extractHoles(lower);
  const teeTime = type === "round" ? extractTeeTime(lower) : "";
  const tees = extractTees(lower);
  const course = extractCourse(raw);
  const tags = inferTags(lower, type);

  const walking = /\bwalked|walking\b/.test(lower);
  const riding = /\brode|riding|cart\b/.test(lower);
  const durationMinutes = durationMatch ? normalizeDuration(durationMatch) : "";
  const focusAreas = inferFocusAreas(lower);
  const title = buildParsedTitle({ type, course, focusAreas, lower });

  return {
    type,
    title,
    courseName: course,
    entryDate: inferDate(lower) || today,
    teeTime,
    holes,
    tees,
    score,
    travel: walking ? "walking" : riding ? "riding" : "",
    durationMinutes,
    location: extractLocation(raw, type),
    focus: focusAreas.join(", "),
    cost,
    notes: raw,
    tags,
    confidence: buildConfidence({ type, title, score: type === "round" ? score : true, duration: type === "round" ? true : durationMatch }),
  };
}

function detectEntryType(lower) {
  if (/\b(workout|worked out|lift|lifting|mobility|core|strength|squat|squats|carries|carry|pull ups|push ups|zone 2|recovery)\b/.test(lower)) {
    return "workout";
  }

  if (/\b(practice|practiced|range|putting green|drill|drills|garage|worked on|working on|range session|chipping|bunker)\b/.test(lower)) {
    return "practice";
  }

  if (/\b(played|shot|scored|carded|posted|fired|walked|rode|holes?|tees?)\b/.test(lower)) {
    return "round";
  }

  if (/\b(swing thought|remember|reminder|note to self|mental note)\b/.test(lower)) {
    return "note";
  }

  if (/\b(note|thought)\b/.test(lower) && !/\b(shot|played|holes?)\b/.test(lower)) {
    return "note";
  }

  return "round";
}

function normalizeDuration(match) {
  const value = Number(match[1]);
  return /hour|hr/.test(match[0]) ? value * 60 : value;
}

function buildParsedTitle({ type, course, focusAreas, lower }) {
  if (type === "round") return course || "Untitled round";
  if (type === "practice") return focusAreas.length ? `${titleCase(focusAreas[0])} practice` : "Practice session";
  if (type === "workout") return /\bmobility\b/.test(lower) ? "Mobility workout" : "Golf workout";
  return "Golf note";
}

function extractScore(lower) {
  const patterns = [
    /\b(?:shot|scored|carded|posted|fired|made|had)\s+(?:a|an)?\s*(\d{2,3})\b/,
    /\b(?:finished|came in)\s+(?:with\s+)?(?:a|an)?\s*(\d{2,3})\b/,
    /\b(?:for|with)\s+(?:a|an)?\s*(\d{2,3})\s*(?:on the card|total)?\b/,
  ];

  const explicitScore = extractNumberFromPatterns(lower, patterns);
  if (explicitScore) return explicitScore;

  const scoreCandidateText = lower
    .replace(/\$\s*\d+(?:\.\d{1,2})?\b/g, "")
    .replace(/\b\d+(?:\.\d{1,2})?\s*(?:bucks|dollars|minutes?|mins?|min|hours?|hrs?|holes?)\b/g, "")
    .replace(/\b(?:at|around)\s+\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?|am|pm)?\b/g, "");
  const fallback = scoreCandidateText.match(/\b([6-9]\d|1[0-4]\d)\b/);
  return fallback ? Number(fallback[1]) : "";
}

function extractCost(lower) {
  const patterns = [
    /\b(?:cost(?:\s+was)?|paid|spent|green fee(?:\s+was)?|fee(?:\s+was)?)\s+(?:about|around)?\s*\$?(\d+(?:\.\d{1,2})?)\s*(?:bucks|dollars)?\b/,
    /\b(?:for)\s+\$?(\d+(?:\.\d{1,2})?)\s*(?:bucks|dollars)\b/,
    /\b(\d+(?:\.\d{1,2})?)\s*(?:bucks|dollars)\b/,
    /\$\s*(\d+(?:\.\d{1,2})?)\b/,
  ];

  return extractNumberFromPatterns(lower, patterns);
}

function extractHoles(lower) {
  if (/\b(?:front|back)\s+nine\b|\bnine\s+holes?\b/.test(lower)) return 9;
  if (/\beighteen\s+holes?\b/.test(lower)) return 18;

  const match = lower.match(/\b(9|18)\s*holes?\b/) || lower.match(/\b(?:walked|rode|played)\s+(9|18)\b/);
  return match ? Number(match[1]) : 18;
}

function extractTees(lower) {
  const match =
    lower.match(/\b(?:from the|off the|played the)\s+([a-z]+)\s+tees?\b/) ||
    lower.match(/\b(?:from|off)\s+([a-z]+)s\b/) ||
    lower.match(/\b(black|blue|white|gold|red|green|silver|tips?)\s+tees?\b/);

  if (!match?.[1]) return "";
  return match[1].replace(/s$/, "");
}

function extractTeeTime(lower) {
  const patterns = [
    /\b(?:tee(?:d)?\s*(?:off)?|tee time|at|around)\s+(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|am|pm|in the morning|at night|evening)?\b/,
    /\b(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?|am|pm|in the morning|at night|evening)?\b/,
    /\b(\d{1,2})\s*(a\.?m\.?|p\.?m\.?|am|pm|in the morning|at night|evening)\b/,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (!match) continue;
    if (!match[2] && !match[3] && Number(match[1]) > 12) continue;
    const normalized = match.length === 3 ? [match[0], match[1], "00", match[2]] : match;
    return normalizeTime(normalized);
  }

  return "";
}

function extractNumberFromPatterns(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return Number(match[1]);
  }

  return "";
}

function extractCourse(raw) {
  const patterns = [
    /\bplayed(?:\s+at)?\s+(.+?)(?:\s+(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|yesterday|today|at\s+\d|around\s+\d|on|from|off|walked|walking|rode|riding|shot|scored|carded|posted|fired|cost|paid|and)|,|\.|$)/i,
    /\b(?:round|played|shot\s+\d{2,3}|scored\s+\d{2,3})\s+at\s+([A-Z][A-Za-z0-9 '&.-]+?)(?:\s+at\s+\d|\s+around\s+\d|\s+from|\s+off|,|\.|$)/i,
    /\bat\s+([A-Z][A-Za-z0-9 '&.-]+?)(?:\s+at\s+\d|\s+around\s+\d|\s+from|\s+off|,|\.|$)/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      const course = cleanCourse(match[1]);
      if (isCourseLike(course)) return titleCase(course);
    }
  }

  return "";
}

function isCourseLike(value) {
  return value && !/^(?:around|about)?\s*\d+\s*holes?$/i.test(value) && !/^\d+$/.test(value);
}

function extractLocation(raw, type) {
  if (type === "round" || type === "note") return "";

  const match = raw.match(/\b(?:at|in|inside)\s+([A-Z]?[A-Za-z0-9 '&.-]+?)(?:\.|,|\s+for|\s+and|\s+focused|\s+worked|$)/);
  if (!match?.[1]) return "";

  const location = match[1].trim().replace(/^the\s+/i, "");
  if (/^(the|a|about|today)$/i.test(location)) return "";
  return titleCase(location);
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

  if (/\btoday\b/.test(lower)) {
    return today.toISOString().slice(0, 10);
  }

  if (/\byesterday\b/.test(lower)) {
    date.setDate(today.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  const numericDate = lower.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (numericDate) {
    return formatParsedDate(Number(numericDate[1]), Number(numericDate[2]), numericDate[3]);
  }

  const monthNames = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  const monthPattern = new RegExp(`\\b(${Object.keys(monthNames).join("|")})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`);
  const monthDate = lower.match(monthPattern);
  if (monthDate) {
    const parsed = new Date(today.getFullYear(), monthNames[monthDate[1]], Number(monthDate[2]));
    if (parsed > today) parsed.setFullYear(parsed.getFullYear() - 1);
    return parsed.toISOString().slice(0, 10);
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

function formatParsedDate(month, day, yearText) {
  const today = new Date();
  let year = yearText ? Number(yearText) : today.getFullYear();
  if (year < 100) year += 2000;

  const parsed = new Date(year, month - 1, day);
  if (!yearText && parsed > today) parsed.setFullYear(parsed.getFullYear() - 1);
  return parsed.toISOString().slice(0, 10);
}

function inferFocusAreas(lower) {
  const areas = {
    driver: ["driver", "tee shot", "tee shots"],
    irons: ["iron", "irons", "approach"],
    wedges: ["wedge", "wedges", "short game"],
    chipping: ["chip", "chipping"],
    putting: ["putt", "putting"],
    bunker: ["bunker", "sand"],
    alignment: ["alignment", "aim"],
    setup: ["setup", "posture", "ball position"],
    grip: ["grip"],
    takeaway: ["takeaway"],
    transition: ["transition"],
    contact: ["contact", "strike", "ball striking"],
    mobility: ["mobility", "hips", "rotation"],
    core: ["core", "plank", "planks"],
    strength: ["strength", "squat", "squats", "deadlift", "press", "carry", "carries"],
    tempo: ["tempo", "rhythm"],
    "start line": ["start line", "starting line"],
    "speed control": ["speed", "speed control", "pace"],
  };

  return Object.entries(areas)
    .filter(([, words]) => words.some((word) => lower.includes(word)))
    .map(([area]) => area);
}

function inferTags(lower, type = "round") {
  const tagMap = {
    [type]: [type],
    walking: ["walked", "walking"],
    riding: ["rode", "riding", "cart"],
    driver: ["driver", "tee shot", "tee shots"],
    irons: ["iron", "irons", "approach"],
    putting: ["putt", "putting"],
    wedges: ["wedge", "wedges", "short game", "chipping"],
    penalties: ["penalty", "penalties", "lost ball"],
    "best-round": ["best round", "personal best", "pb"],
    "early-morning": ["morning", "am", "a.m."],
    "miss-right": ["leaking right", "miss right", "missing right", "slice", "push"],
    "miss-left": ["pulled", "pull hook", "hook", "miss left", "missing left"],
    contact: ["contact", "strike", "ball striking"],
    tempo: ["tempo", "rhythm"],
    "swing-thought": ["swing thought", "remember", "reminder", "note to self", "mental note"],
    strength: ["felt good", "worked well", "solid", "best round", "contact felt better"],
    weakness: ["needs work", "need more work", "struggled", "shaky", "leaking", "missing", "inconsistent"],
    practice: ["practice", "practiced", "range", "drill", "drills"],
    workout: ["workout", "mobility", "core", "strength", "carries"],
    mobility: ["mobility", "hips", "rotation"],
    note: ["note", "thought", "reminder"],
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
  const type = entry.type || "round";
  els.entryType.value = type;
  els.entryTitle.value = entry.title || entry.courseName || "";
  els.entryDate.value = entry.entryDate || new Date().toISOString().slice(0, 10);
  els.teeTime.value = entry.teeTime || "";
  els.holes.value = String(entry.holes || 18);
  els.tees.value = entry.tees || "";
  els.score.value = entry.score || "";
  els.travel.value = entry.travel || (entry.walking ? "walking" : entry.riding ? "riding" : "");
  els.duration.value = entry.durationMinutes || "";
  els.location.value = entry.location || "";
  els.focus.value = entry.focus || entry.focusAreas?.join(", ") || entry.exercises?.map((exercise) => exercise.name).join(", ") || "";
  els.cost.value = entry.cost ?? "";
  els.notes.value = entry.notes || "";
  els.tags.value = (entry.tags || []).join(", ");
  els.confidence.textContent = entry.confidence || "Editing";
  updateFormMode();
  els.preview.classList.remove("hidden");
}

function formToEntry() {
  const now = new Date().toISOString();
  const type = els.entryType.value;
  const travel = els.travel.value;
  const title = els.entryTitle.value.trim();
  const score = Number(els.score.value);
  const entryDate = els.entryDate.value;
  const tags = els.tags.value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const baseEntry = {
    id: editingId || `${type}_${crypto.randomUUID()}`,
    type,
    source: dictationUsed ? "voice" : parsedRawInput ? "text" : "manual",
    createdAt: editingId ? getEntry(editingId)?.createdAt || now : now,
    updatedAt: now,
    entryDate,
    rawInput: parsedRawInput,
    title,
    summary: buildSummary(type),
    notes: els.notes.value.trim(),
    tags,
  };

  if (type === "round") {
    return {
      ...baseEntry,
      courseName: title,
      teeTime: els.teeTime.value || null,
      holes: Number(els.holes.value),
      tees: els.tees.value.trim() || null,
      score,
      walking: travel === "walking" ? true : travel === "riding" ? false : null,
      riding: travel === "riding" ? true : travel === "walking" ? false : null,
      cost: els.cost.value ? Number(els.cost.value) : null,
    };
  }

  if (type === "practice") {
    return {
      ...baseEntry,
      location: els.location.value.trim() || null,
      durationMinutes: els.duration.value ? Number(els.duration.value) : null,
      focusAreas: splitList(els.focus.value),
    };
  }

  if (type === "workout") {
    return {
      ...baseEntry,
      workoutType: inferWorkoutType(els.focus.value, els.notes.value),
      durationMinutes: els.duration.value ? Number(els.duration.value) : null,
      exercises: splitList(els.focus.value).map((name) => ({ name })),
      golfRelevance: els.notes.value.trim() || null,
    };
  }

  return baseEntry;
}

function buildSummary(type) {
  const pieces = [];

  if (type === "round") {
    if (els.travel.value) pieces.push(els.travel.value === "walking" ? `Walked ${els.holes.value}` : `Rode ${els.holes.value}`);
    if (els.tees.value.trim()) pieces.push(`${els.tees.value.trim()} tees`);
    if (els.cost.value) pieces.push(`$${Number(els.cost.value).toFixed(0)}`);
  } else {
    if (els.duration.value) pieces.push(`${Number(els.duration.value)} minutes`);
    if (els.location.value.trim()) pieces.push(els.location.value.trim());
    if (els.focus.value.trim()) pieces.push(els.focus.value.trim());
  }

  const note = els.notes.value.trim();
  return [pieces.join(" · "), note].filter(Boolean).join(". ");
}

function updateFormMode() {
  const type = els.entryType.value;
  const isRound = type === "round";
  els.roundFields.classList.toggle("hidden", !isRound);
  els.activityFields.classList.toggle("hidden", isRound || type === "note");
  els.cost.closest("label").classList.toggle("hidden", !isRound);
  els.score.required = isRound;
  els.saveEntry.textContent = `Save ${entryTypeLabel(type)}`;
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferWorkoutType(focus, notes) {
  const lower = `${focus} ${notes}`.toLowerCase();
  if (/\bmobility|hips|rotation|stretch\b/.test(lower)) return "mobility";
  if (/\bcore|plank\b/.test(lower)) return "core";
  if (/\bstrength|squat|deadlift|press|carry|carries\b/.test(lower)) return "strength";
  if (/\brecovery|easy\b/.test(lower)) return "recovery";
  return "golf-specific";
}

function entryTypeLabel(type) {
  return {
    round: "Round",
    practice: "Practice",
    workout: "Workout",
    note: "Note",
  }[type] || "Entry";
}

function entryMainStat(entry) {
  if (entry.type === "round") return entry.score || "—";
  if (entry.type === "practice" || entry.type === "workout") return entry.durationMinutes ? `${entry.durationMinutes}m` : "Log";
  return "Note";
}

function entryTitle(entry) {
  return entry.title || entry.courseName || entry.workoutType || "Untitled entry";
}

function entryTags(entry) {
  return Array.from(new Set([entry.type, ...(entry.tags || [])])).filter(Boolean);
}

function entryMeta(entry) {
  return `${entryTypeLabel(entry.type).toUpperCase()} · ${formatDate(entry.entryDate)}`;
}

function normalizeLegacyEntry(entry) {
  if (entry.type === "round" && !entry.title && entry.courseName) {
    return { ...entry, title: entry.courseName };
  }

  return entry;
}

function getEntry(id) {
  const entry = readStore().entries.find((item) => item.id === id);
  return entry ? normalizeLegacyEntry(entry) : undefined;
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
  const entries = [...store.entries].map(normalizeLegacyEntry).sort((a, b) => b.entryDate.localeCompare(a.entryDate));
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
    els.entryList.innerHTML = '<div class="empty-state">No entries logged yet. Add your first dictated round, practice session, workout, or note and it will show up here.</div>';
    return;
  }

  els.entryList.innerHTML = entries
    .map(
      (entry) => `
        <article class="entry-card entry-card-${escapeHtml(entry.type)}">
          <div>
            <p class="entry-meta">${escapeHtml(entryMeta(entry))}</p>
            <h3>${escapeHtml(entryTitle(entry))}</h3>
            <p class="entry-summary">${escapeHtml(entry.summary || entry.notes || "")}</p>
            <div class="tag-list">
              ${entryTags(entry).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="card-actions">
              <button class="text-button" data-action="edit" data-id="${entry.id}" type="button">Edit</button>
              <button class="text-button danger" data-action="delete" data-id="${entry.id}" type="button">Delete</button>
            </div>
          </div>
          <div class="score-badge score-badge-${escapeHtml(entry.type)}">${escapeHtml(entryMainStat(entry))}</div>
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

  const courseCounts = countBy(calculated.rounds.map((round) => round.courseName || round.title));
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
  if (isListening && recognition) recognition.stop();
  editingId = null;
  parsedRawInput = "";
  els.rawInput.value = "";
  dictationBaseText = "";
  dictationUsed = false;
  els.form.reset();
  updateFormMode();
  els.preview.classList.add("hidden");
  if (recognition) setDictationState("idle", "Voice dictation ready.");
});

els.toggleDictation.addEventListener("click", toggleDictation);

els.entryType.addEventListener("change", updateFormMode);

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = formToEntry();
  saveEntry(entry);
  editingId = null;
  parsedRawInput = "";
  els.rawInput.value = "";
  dictationBaseText = "";
  dictationUsed = false;
  els.form.reset();
  updateFormMode();
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
  const entries = [...store.entries, ...sampleEntries.filter((entry) => !ids.has(entry.id))];
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
updateFormMode();
setupDictation();
