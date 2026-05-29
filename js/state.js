// ==========================================
// 🕹️ 1. GLOBAL TERMINAL STATE MANAGEMENT
// ==========================================
let guidedQuestionBank = [];
let examQuestionBank = [];
let activeQuestions = [];
let currentQuestionIndex = 0;
let currentStepIndex = 0;
let statsChartInstance = null;
let currentGameMode = "guided";

let answeredQuestionsMap = {};

let totalQuestionsCompleted = 0;
let totalCorrectSteps = 0;
let totalWrongAttempts = 0;
let missedAttemptsMap = {};

const SHOW_ANSWER_AFTER_MISSES = 3;

// ==========================================
// 💾 LOCAL STORAGE KEYS
// ==========================================
const LS_KEYS = {
  ANSWERS: "statsAnsweredQuestions",
  METRICS: "statsMetrics",
  PREFERENCES: "statsPracticePreferences",
};

// ==========================================
// 💾 LOAD SAVED STATE
// ==========================================
function loadPersistedState() {
  try {
    const savedAnswers = localStorage.getItem(LS_KEYS.ANSWERS);
    const savedMetrics = localStorage.getItem(LS_KEYS.METRICS);

    if (savedAnswers) {
      answeredQuestionsMap = JSON.parse(savedAnswers);
    }

    if (savedMetrics) {
      const m = JSON.parse(savedMetrics);
      totalQuestionsCompleted = m.completed ?? 0;
      totalCorrectSteps = m.correct ?? 0;
      totalWrongAttempts = m.wrong ?? 0;
    }
  } catch (err) {
    console.warn("Failed to load persisted state:", err);
  }
}

function loadPracticePreferences() {
  try {
    const savedPreferences = localStorage.getItem(LS_KEYS.PREFERENCES);
    if (!savedPreferences) return;

    const preferences = JSON.parse(savedPreferences);
    if (preferences.mode === "guided" || preferences.mode === "exam") {
      currentGameMode = preferences.mode;
    }
  } catch (err) {
    console.warn("Failed to load practice preferences:", err);
  }
}

function applyPracticePreferencesToControls() {
  try {
    const savedPreferences = localStorage.getItem(LS_KEYS.PREFERENCES);
    if (!savedPreferences) {
      updateGameModeButtons();
      return;
    }

    const preferences = JSON.parse(savedPreferences);
    const categorySelect = document.getElementById("category-select");
    const difficultySelect = document.getElementById("difficulty-select");

    if (categorySelect && preferences.topic) {
      categorySelect.value = preferences.topic;
    }

    if (difficultySelect && preferences.difficulty) {
      difficultySelect.value = normalizeDifficulty(preferences.difficulty);
    }

    updateGameModeButtons();
  } catch (err) {
    console.warn("Failed to apply practice preferences:", err);
    updateGameModeButtons();
  }
}

// ==========================================
// 💾 SAVE STATE
// ==========================================
function saveAnsweredMap() {
  localStorage.setItem(LS_KEYS.ANSWERS, JSON.stringify(answeredQuestionsMap));
}

function saveMetrics() {
  localStorage.setItem(
    LS_KEYS.METRICS,
    JSON.stringify({
      completed: totalQuestionsCompleted,
      correct: totalCorrectSteps,
      wrong: totalWrongAttempts,
    }),
  );
}

function savePracticePreferences() {
  const categorySelect = document.getElementById("category-select");
  const difficultySelect = document.getElementById("difficulty-select");

  localStorage.setItem(
    LS_KEYS.PREFERENCES,
    JSON.stringify({
      mode: currentGameMode,
      topic: categorySelect?.value || "all",
      difficulty: normalizeDifficulty(difficultySelect?.value || "all"),
    }),
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  applyStoredTheme();
  loadPersistedState();
  loadPracticePreferences();

  // Fetch separate question sets for each practice mode.
  try {
    const [guidedResponse, examResponse] = await Promise.all([
      fetch("guided-questions.json"),
      fetch("exam-questions.json"),
    ]);
    if (!guidedResponse.ok)
      throw new Error(
        `Failed to load guided questions: ${guidedResponse.statusText}`,
      );
    if (!examResponse.ok)
      throw new Error(
        `Failed to load exam questions: ${examResponse.statusText}`,
      );

    guidedQuestionBank = await guidedResponse.json();
    examQuestionBank = await examResponse.json();
    activeQuestions = [...getCurrentQuestionBank()];
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Failed to load questions. Please refresh the page.");
    return;
  }

  applyPracticePreferencesToControls();
  updateMetricsDisplay();
  applyFilters(false);
});

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function applyStoredTheme() {
  const savedTheme = localStorage.getItem("statsPracticeTheme");
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;
  const useDark = savedTheme ? savedTheme === "dark" : prefersDark;

  document.documentElement.classList.toggle("dark", useDark);
  updateThemeToggleLabel();
}

function toggleTheme() {
  const html = document.documentElement;

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("statsPracticeTheme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("statsPracticeTheme", "dark");
  }

  updateThemeToggleLabel();

  if (activeQuestions.length > 0) {
    renderNavigatorGrid();
    renderQuestionCard();
  }
}

function updateThemeToggleLabel() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.textContent = isDarkMode() ? "Light" : "Dark";
}

function getCurrentQuestionBank() {
  return currentGameMode === "exam" ? examQuestionBank : guidedQuestionBank;
}

function getQuestionProgressKey(question) {
  return `${currentGameMode}:${question.id}`;
}

function normalizeDifficulty(difficulty) {
  const value = String(difficulty || "").toLowerCase();
  if (value === "medium") return "intermediate";
  return value;
}

function formatDifficultyLabel(difficulty) {
  const value = normalizeDifficulty(difficulty);
  if (value === "easy") return "Easy";
  if (value === "intermediate") return "Intermediate";
  if (value === "hard") return "Hard";
  return String(difficulty || "Unleveled");
}

function formatHypothesisPrefix(prefix) {
  if (prefix === "H0:") return "H<sub>0</sub>:";
  if (prefix === "Ha:") return "H<sub>a</sub>:";
  return prefix;
}

// ==========================================
