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

document.addEventListener("DOMContentLoaded", async () => {
  applyStoredTheme();

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

  applyFilters();
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

function renderStepPrefix(prefix) {
  if (!prefix) return "";

  return `<span class="px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-bold font-mono dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">${formatHypothesisPrefix(prefix)}</span>`;
}

function applyFilters() {
  const selectedTopic = document.getElementById("category-select").value;
  const selectedDiff = normalizeDifficulty(
    document.getElementById("difficulty-select").value,
  );
  const questionBank = getCurrentQuestionBank();

  activeQuestions = questionBank.filter((q) => {
    const matchesTopic =
      selectedTopic === "all" || q.type.includes(selectedTopic);
    const matchesDiff =
      selectedDiff === "all" ||
      normalizeDifficulty(q.difficulty) === selectedDiff;
    return matchesTopic && matchesDiff;
  });

  currentQuestionIndex = 0;
  currentStepIndex = 0;
  renderNavigatorGrid();
  renderQuestionCard();
}

function switchGameMode(mode) {
  currentGameMode = mode;

  const btnGuided = document.getElementById("btn-mode-guided");
  const btnExam = document.getElementById("btn-mode-exam");

  if (mode === "guided") {
    btnGuided.className =
      "w-1/2 text-center py-1 rounded text-xs font-bold transition-all bg-white text-slate-900 shadow-sm cursor-pointer dark:bg-slate-700 dark:text-white";
    btnExam.className =
      "w-1/2 text-center py-1 rounded text-xs font-bold transition-all text-slate-500 hover:text-slate-800 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100";
  } else {
    btnExam.className =
      "w-1/2 text-center py-1 rounded text-xs font-bold transition-all bg-white text-slate-900 shadow-sm cursor-pointer dark:bg-slate-700 dark:text-white";
    btnGuided.className =
      "w-1/2 text-center py-1 rounded text-xs font-bold transition-all text-slate-500 hover:text-slate-800 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100";
  }

  currentStepIndex = 0;
  applyFilters();
}

function resetPerformanceCounters() {
  totalQuestionsCompleted = 0;
  totalCorrectSteps = 0;
  totalWrongAttempts = 0;
  answeredQuestionsMap = {};
  document.getElementById("metric-completed").textContent = "0";
  document.getElementById("metric-correct").textContent = "0";
  document.getElementById("metric-wrong").textContent = "0";
  applyFilters();
}

// ==========================================
// 🧮 2. VISUAL FORMULA INPUT PALETTE UTILITY
// ==========================================
function injectSymbol(latexSymbol) {
  let mathFieldEl = null;

  if (currentGameMode === "guided") {
    mathFieldEl = document.getElementById(`step-input-${currentStepIndex}`);
  } else {
    mathFieldEl = document.getElementById("exam-final-input");
  }

  if (!mathFieldEl) return;

  mathFieldEl.focus();

  const start = mathFieldEl.selectionStart;
  const end = mathFieldEl.selectionEnd;

  const value = mathFieldEl.value;

  mathFieldEl.value =
    value.substring(0, start) + latexSymbol + value.substring(end);

  mathFieldEl.selectionStart = mathFieldEl.selectionEnd =
    start + latexSymbol.length;
}

function generateFormulaPaletteHTML() {
  return `
        <div class="flex flex-wrap items-center gap-1.5 mb-4 bg-slate-100 p-1.5 rounded border border-slate-200 w-fit dark:bg-slate-950 dark:border-slate-800">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 font-mono dark:text-slate-500">Insert Symbol:</span>
            <button type="button" onclick="injectSymbol('\\sqrt{#?}')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">√ sqrt</button>
            <button type="button" onclick="injectSymbol('^{2}')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">x²</button>
            <button type="button" onclick="injectSymbol('\\frac{#?}{#?}')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">½ fraction</button>
            <button type="button" onclick="injectSymbol('\\times')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">×</button>
            <button type="button" onclick="injectSymbol('\\mu')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">μ mean</button>
            <button type="button" onclick="injectSymbol('\\sigma')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">σ std dev</button>
            <button type="button" onclick="injectSymbol('X')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">X</button>
            <button type="button" onclick="injectSymbol('=')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">=</button>
            <button type="button" onclick="injectSymbol('<')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">&lt;</button>
            <button type="button" onclick="injectSymbol('>')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">&gt;</button>
            <button type="button" onclick="injectSymbol('\\le')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">≤</button>
            <button type="button" onclick="injectSymbol('\\ge')" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">≥</button>
            <button type="button" onclick="injectSymbol('(')" class="px-1.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">(</button>
            <button type="button" onclick="injectSymbol(')')" class="px-1.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">)</button>
        </div>
    `;
}

// ==========================================
// 🎨 3. NAVIGATION & CANVAS DRAWERS
// ==========================================
function renderNavigatorGrid() {
  const navGrid = document.getElementById("question-navigator-grid");
  navGrid.innerHTML = "";

  if (activeQuestions.length === 0) return;

  activeQuestions.forEach((q, idx) => {
    const btn = document.createElement("button");
    btn.textContent = idx + 1;

    let baseClass =
      "h-9 rounded text-xs font-mono font-bold tracking-tight border transition-all cursor-pointer ";

    if (idx === currentQuestionIndex) {
      baseClass +=
        "bg-blue-600 border-blue-700 text-white shadow-sm ring-2 ring-blue-100 dark:ring-blue-900";
    } else if (answeredQuestionsMap[getQuestionProgressKey(q)]) {
      baseClass +=
        "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300";
    } else {
      baseClass +=
        "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100";
    }

    btn.className = baseClass;
    btn.onclick = () => jumpToQuestion(idx);
    navGrid.appendChild(btn);
  });
}

function jumpToQuestion(idx) {
  if (idx >= 0 && idx < activeQuestions.length) {
    currentQuestionIndex = idx;
    currentStepIndex = 0;
    renderNavigatorGrid();
    renderQuestionCard();
  }
}

function renderQuestionCard() {
  const container = document.getElementById("game-container");

  if (activeQuestions.length === 0) {
    container.innerHTML = `
            <div class="text-center py-16 text-slate-400 font-medium text-sm dark:text-slate-500">
                No exam sections found matching the selected Topic & Difficulty criteria matrix.
            </div>`;
    document.getElementById("chart-context-label").textContent = "N/A";
    if (statsChartInstance) statsChartInstance.destroy();
    setChartPanelVisible(false);
    return;
  }

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const isQuestionComplete = Boolean(
    answeredQuestionsMap[getQuestionProgressKey(currentQuestion)],
  );
  const displayPrompt =
    currentGameMode === "exam"
      ? currentQuestion.examPrompt || currentQuestion.prompt
      : currentQuestion.prompt;
  const difficultyLevel = normalizeDifficulty(currentQuestion.difficulty);
  const difficultyLabel = formatDifficultyLabel(currentQuestion.difficulty);
  document.getElementById("chart-context-label").textContent =
    `Question ${currentQuestion.id} [${difficultyLabel}]`;

  let html = `
        <div class="mb-5 flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-2 dark:border-slate-800">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase font-mono tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded dark:bg-slate-800 dark:text-slate-300">
                    Question ${currentQuestionIndex + 1} of ${activeQuestions.length}
                </span>
                <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  difficultyLevel === "easy"
                    ? "bg-emerald-100 text-emerald-800"
                    : difficultyLevel === "intermediate"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                }">
                    ${difficultyLabel}
                </span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="openReferenceTables()" class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900 dark:border-indigo-800">
                    Reference Tables
                </button>
                <span class="text-xs text-slate-400 font-mono dark:text-slate-500">
                    Type: ${currentQuestion.type.replace(/_/g, " ").toUpperCase()}
                </span>
            </div>
        </div>
        <p class="text-[15px] text-slate-800 font-medium mb-4 leading-relaxed select-text dark:text-slate-100">${displayPrompt}</p>
        
        ${generateFormulaPaletteHTML()}

        <div class="space-y-4" id="steps-container">
    `;

  if (currentGameMode === "guided") {
    currentQuestion.steps.forEach((step, index) => {
      const isCurrent = index === currentStepIndex;
      const isPast = index < currentStepIndex;
      const blueprintHint =
        step.hint || `${step.expected.replace(/\d+(\.\d+)?/g, "[Value]")}`;

      html += `
                <div id="step-card-${index}" class="p-4 rounded border transition-all duration-150 ${
                  isCurrent
                    ? "bg-slate-50/70 border-slate-400 ring-1 ring-slate-200 dark:bg-slate-950/70 dark:border-slate-600 dark:ring-slate-700"
                    : isPast
                      ? "bg-emerald-50/40 border-emerald-200 opacity-90 dark:bg-emerald-950/30 dark:border-emerald-900"
                      : "bg-white border-slate-100 opacity-30 select-none pointer-events-none dark:bg-slate-900 dark:border-slate-800"
                }">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold uppercase tracking-wide text-slate-900 font-mono dark:text-slate-300">${step.label}</span>
                            ${
                              isCurrent
                                ? `
                                <button type="button" onclick="toggleHint(${index})" class="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer dark:text-slate-500 dark:hover:text-blue-300" title="Toggle Explanation Breakdown">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.056 1.056L10.5 14.25M12 7.5h.008v.008H12V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </button>
                            `
                                : ""
                            }
                        </div>
                        <div class="flex items-center gap-2">
                            ${renderStepPrefix(step.prefix)}
                            <input
                              id="step-input-${index}"
                              type="text"
                              class="math-input w-60 font-mono px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                            />
                            
                            ${isCurrent ? `<button onclick="submitStep(${index})" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-sm transition-colors cursor-pointer uppercase tracking-wider h-12">Check My Work</button>` : ""}
                            ${isPast ? `<span class="text-emerald-600 font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1 dark:text-emerald-300"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> Correct</span>` : ""}
                        </div>
                    </div>
                    
                    <div id="step-hint-${index}" class="mt-2.5 p-3 bg-blue-50/50 border border-blue-100 text-slate-700 rounded text-xs font-mono hidden leading-relaxed dark:bg-blue-950/30 dark:border-blue-900 dark:text-slate-200">
                        <span class="font-bold text-blue-800 uppercase block mb-1 text-[10px] dark:text-blue-300">Expected Format:</span>
                        ${blueprintHint}
                    </div>
                    <div id="step-feedback-${index}" class="mt-2 text-xs font-mono hidden"></div>
                </div>
            `;
    });
  } else {
    html += `
            <div id="step-card-exam" class="p-5 rounded border border-slate-300 bg-slate-50/50 dark:bg-slate-950/70 dark:border-slate-700">
                <div class="flex flex-col gap-3">
                    ${
                      currentQuestion.answerFormat
                        ? `<div class="text-xs text-slate-600 bg-white border border-slate-200 rounded p-3 leading-relaxed dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                            <span class="font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1 dark:text-slate-400">Directions:</span>
                            ${currentQuestion.answerFormat}
                          </div>`
                        : ""
                    }
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input id="exam-final-input" type="text" class="math-input w-60 font-mono px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700" />
                        
                        <button onclick="submitExamAnswer()" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow transition-colors cursor-pointer uppercase tracking-wider h-9">Submit</button>
                    </div>
                </div>
                <div id="exam-feedback" class="mt-3 text-xs font-mono hidden"></div>
            </div>
        `;
  }

  html += `</div>`;

  html += `
        <div id="explanation-box" class="mt-6 p-4 bg-slate-50 border border-slate-200 rounded hidden dark:bg-slate-950 dark:border-slate-800">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 font-mono pb-1.5 border-b border-slate-200 dark:text-slate-100 dark:border-slate-800">Explanation:</h4>
            <p class="text-sm text-slate-600 font-medium leading-relaxed select-text dark:text-slate-300">${currentQuestion.explanation}</p>
            <button onclick="nextQuestion()" class="mt-4 px-4 py-2 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded shadow transition-colors cursor-pointer">
                ${currentQuestionIndex === activeQuestions.length - 1 ? "Retry 🔄" : "Next Question ➡️"}
            </button>
        </div>
    `;

  container.innerHTML = html;

  setTimeout(() => {
    if (currentGameMode === "guided") {
      const activeInput = document.getElementById(
        `step-input-${currentStepIndex}`,
      );
      if (activeInput) {
        activeInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitStep(currentStepIndex);
        });
      }
    } else {
      const examInput = document.getElementById("exam-final-input");
      if (examInput) {
        examInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitExamAnswer();
        });
      }
    }
  }, 50);

  if (isQuestionComplete) {
    setChartPanelVisible(true);
    drawQuestionChart(
      currentQuestion.chartData,
      currentQuestion.chartData.targetX,
    );
  } else {
    setChartPanelVisible(false);
  }
}

// ==========================================
// ⚡ 4. COMPILATION RUNTIMES & ACTION HANDLERS
// ==========================================
function submitStep(stepIdx) {
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const stepData = currentQuestion.steps[stepIdx];
  const inputEl = document.getElementById(`step-input-${stepIdx}`);
  const cardEl = document.getElementById(`step-card-${stepIdx}`);
  const feedbackEl = document.getElementById(`step-feedback-${stepIdx}`);

  const userInput = inputEl ? inputEl.value.trim() : "";

  if (!userInput) return;

  // Reset card error animations/color shifts before evaluating
  cardEl.classList.remove(
    "animate-shake",
    "border-rose-300",
    "bg-rose-50/30",
    "dark:border-rose-800",
    "dark:bg-rose-950/30",
  );
  if (inputEl)
    inputEl.classList.remove(
      "border-rose-400",
      "bg-rose-50/50",
      "dark:border-rose-700",
      "dark:bg-rose-950/40",
    );

  if (approxEqual(userInput, stepData.expected)) {
    showFeedback(
      feedbackEl,
      "✓ Perfect. Calculation verified successfully.",
      "text-emerald-600",
    );
    totalCorrectSteps++;
    currentStepIndex++;
    updateMetricsDisplay();

    if (currentStepIndex < currentQuestion.steps.length) {
      setTimeout(() => {
        renderQuestionCard();
      }, 600);
    } else {
      setTimeout(() => {
        totalQuestionsCompleted++;
        answeredQuestionsMap[getQuestionProgressKey(currentQuestion)] = true;
        updateMetricsDisplay();
        renderNavigatorGrid();
        document.getElementById("explanation-box").classList.remove("hidden");
        setChartPanelVisible(true);
        drawQuestionChart(
          currentQuestion.chartData,
          currentQuestion.chartData.targetX,
        );
      }, 550);
    }
  } else {
    totalWrongAttempts++;
    updateMetricsDisplay();
    showFeedback(
      feedbackEl,
      "✕ Discrepancy detected. Review values or operators.",
      "text-rose-600",
    );
    cardEl.classList.add(
      "animate-shake",
      "border-rose-300",
      "bg-rose-50/30",
      "dark:border-rose-800",
      "dark:bg-rose-950/30",
    );
    if (inputEl)
      inputEl.classList.add(
        "border-rose-400",
        "bg-rose-50/50",
        "dark:border-rose-700",
        "dark:bg-rose-950/40",
      );
  }
}

function submitExamAnswer() {
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const finalAnswer =
    currentQuestion.answer || currentQuestion.steps?.at(-1)?.expected;

  const inputEl = document.getElementById("exam-final-input");
  const cardEl = document.getElementById("step-card-exam");
  const feedbackEl = document.getElementById("exam-feedback");

  const userInput = inputEl?.value.trim();

  if (!userInput) return;

  // Reset previous error styling
  cardEl.classList.remove(
    "animate-shake",
    "border-rose-300",
    "bg-rose-50/30",
    "dark:border-rose-800",
    "dark:bg-rose-950/30",
  );

  inputEl?.classList.remove(
    "border-rose-400",
    "bg-rose-50/50",
    "dark:border-rose-700",
    "dark:bg-rose-950/40",
  );

  const isCorrect = approxEqual(userInput, finalAnswer);

  // ------------------------------------------------------------------
  // Correct Answer
  // ------------------------------------------------------------------

  if (isCorrect) {
    showFeedback(feedbackEl, "✅ Correct!", "success");

    totalCorrectSteps++;
    totalQuestionsCompleted++;

    answeredQuestionsMap[getQuestionProgressKey(currentQuestion)] = true;

    updateMetricsDisplay();
    renderNavigatorGrid();

    document.getElementById("explanation-box")?.classList.remove("hidden");

    setChartPanelVisible(true);

    drawQuestionChart(
      currentQuestion.chartData,
      currentQuestion.chartData.targetX,
    );

    return;
  }

  // ------------------------------------------------------------------
  // Incorrect Answer
  // ------------------------------------------------------------------

  totalWrongAttempts++;

  updateMetricsDisplay();

  showFeedback(feedbackEl, "❌ Not quite! Try again.", "error");

  cardEl.classList.add(
    "animate-shake",
    "border-rose-300",
    "bg-rose-50/30",
    "dark:border-rose-800",
    "dark:bg-rose-950/30",
  );

  inputEl?.classList.add(
    "border-rose-400",
    "bg-rose-50/50",
    "dark:border-rose-700",
    "dark:bg-rose-950/40",
  );
}
function nextQuestion() {
  if (currentQuestionIndex === activeQuestions.length - 1) {
    applyFilters();
  } else {
    currentQuestionIndex++;
    currentStepIndex = 0;
    renderNavigatorGrid();
    renderQuestionCard();
  }
}

function updateMetricsDisplay() {
  document.getElementById("metric-completed").textContent =
    totalQuestionsCompleted;
  document.getElementById("metric-correct").textContent = totalCorrectSteps;
  document.getElementById("metric-wrong").textContent = totalWrongAttempts;
}

function showFeedback(element, message, type = "success") {
  if (!element) return;

  const styles = {
    success: "text-emerald-600",
    error: "text-rose-600",
    info: "text-blue-600",
  };

  element.className = `mt-3 font-semibold ${styles[type]}`;
  element.textContent = message;
}

function toggleHint(stepIdx) {
  const hintElement = document.getElementById(`step-hint-${stepIdx}`);
  if (hintElement) hintElement.classList.toggle("hidden");
}

function setChartPanelVisible(isVisible) {
  const chartPanel = document.getElementById("chart-panel");
  if (!chartPanel) return;

  chartPanel.classList.toggle("hidden", !isVisible);

  if (!isVisible && statsChartInstance) {
    statsChartInstance.destroy();
    statsChartInstance = null;
  }
}

// ==========================================
// ⚙️ 5. LATEX-AWARE COMPUTATIONAL ALGEBRA ENGINE
// ==========================================

function normalizeRawAnswer(value) {
  return String(value)
    .replace(/\$/g, "")
    .replace(/(?<=\d),(?=\d{3}\b)/g, "")
    .replace(/,/g, " ")
    .trim();
}

function isHypothesisExpression(value) {
  return /^[a-z]+(?:=|<|>|<=|>=)-?\d+(\.\d+)?%?$/.test(
    normalizeHypothesisExpression(value),
  );
}

function approxEqual(userInput, expectedAnswer, tolerance = 0.05) {
  try {
    if (expectedAnswer === undefined || expectedAnswer === null) return false;

    function extractNumber(s) {
      if (s === null || s === undefined) return NaN;

      return parseFloat(
        String(s)
          .replace(/[\s\u200B-\u200D\uFEFF\u00A0]/g, "") // remove hidden spaces
          .replace(/,/g, "")
          .replace("%", "")
          .replace(/\\,/g, ""),
      );
    }
    const numInput = extractNumber(userInput);
    const numExpected = extractNumber(expectedAnswer);

    function normalizeText(s) {
      return String(s)
        .toLowerCase()
        .replace(/h0/g, "h0")
        .replace(/h₀/g, "h0")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!isNaN(numInput) && !isNaN(numExpected)) {
      return Math.abs(numInput - numExpected) <= tolerance;
    }
    // ==========================================
    // 1. RAW INPUT CLEANUP (MathLive + LaTeX)
    // ==========================================
    let cleanInput = normalizeRawAnswer(userInput);
    let cleanExpected = normalizeRawAnswer(expectedAnswer);

    // ... [Keep your exact Step 1 cleanup code here] ...

    cleanInput = cleanInput.replace(/\s+/g, " ").trim();
    cleanExpected = cleanExpected.replace(/\s+/g, " ").trim();

    // ==========================================
    // 1.5. EARLY EXIT FOR DIRECT TEXT MATCH (Fixes "Reject" bug)
    // ==========================================
    const normInput = cleanInput.toLowerCase().trim();
    const normExpected = cleanExpected.toLowerCase().trim();
    const decisionWords = ["reject", "fail to reject"];

    // If it's a known text conclusion, handle it immediately and exit
    if (
      decisionWords.includes(normExpected) ||
      decisionWords.includes(normInput)
    ) {
      return (
        normInput === normExpected ||
        normInput.includes(normExpected) ||
        normExpected.includes(normInput)
      );
    }

    // Generic text exact match fallback
    if (normInput === normExpected && normInput !== "") {
      return true;
    }

    // ==========================================
    // 2. HYPOTHESIS / EQUATION MATCHING
    // ==========================================

    // Removes hidden / MathLive / formatting artifacts
    function normalizeEquationString(s) {
      return String(s)
        .replace(/\$/g, "")
        .replace(/\s+/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, ""); // zero-width chars
    }

    // Parses something like: p = 0.5, μ>=10, x<3.2
    function parseEquation(s) {
      const match = normalizeEquationString(s).match(
        /^([a-zA-Zμσ])\s*(=|<=|>=|<|>)\s*(-?\d+(\.\d+)?)/,
      );

      if (!match) return null;

      return {
        variable: match[1],
        operator: match[2],
        value: Number(match[3]),
      };
    }

    // Handle equation-style answers FIRST (before fallback logic)
    const eqInput = parseEquation(cleanInput);
    const eqExpected = parseEquation(cleanExpected);

    if (eqInput && eqExpected) {
      return (
        eqInput.variable === eqExpected.variable &&
        eqInput.operator === eqExpected.operator &&
        Math.abs(eqInput.value - eqExpected.value) <= tolerance
      );
    }
    // ==========================================
    // 3. INTERVAL / ORDERED PAIR HANDLING
    // ==========================================
    const intervalPattern = /^\(?\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)?$/;

    if (
      intervalPattern.test(cleanInput) &&
      intervalPattern.test(cleanExpected)
    ) {
      const inputNums = cleanInput.match(/-?\d+(\.\d+)?/g).map(Number);
      const expectedNums = cleanExpected.match(/-?\d+(\.\d+)?/g).map(Number);

      return (
        Math.abs(inputNums[0] - expectedNums[0]) <= tolerance &&
        Math.abs(inputNums[1] - expectedNums[1]) <= tolerance
      );
    }

    // ==========================================
    // 4. STRUCTURED HYPOTHESIS EXPRESSIONS
    // ==========================================
    if (
      isHypothesisExpression(cleanExpected) &&
      isHypothesisExpression(cleanInput)
    ) {
      return (
        normalizeHypothesisExpression(cleanInput) ===
        normalizeHypothesisExpression(cleanExpected)
      );
    }

    // ==========================================
    // 5. MULTI-COMPONENT NUMERIC MATCH
    // ==========================================
    if (
      cleanExpected.includes("=") &&
      (cleanExpected.includes("μ") ||
        cleanExpected.includes("σ") ||
        cleanExpected.includes("X"))
    ) {
      const inputNumbers = cleanInput.match(/-?\d+(\.\d+)?/g) || [];
      const expectedNumbers = cleanExpected.match(/-?\d+(\.\d+)?/g) || [];

      if (inputNumbers.length !== expectedNumbers.length) return false;

      inputNumbers.sort((a, b) => Number(a) - Number(b));
      expectedNumbers.sort((a, b) => Number(a) - Number(b));

      return expectedNumbers.every(
        (num, idx) =>
          Math.abs(Number(num) - Number(inputNumbers[idx])) < tolerance,
      );
    }

    // ==========================================
    // 6. MATH EVALUATION FALLBACK
    // ==========================================
    if (cleanInput.endsWith("%")) {
      cleanInput = "(" + cleanInput.slice(0, -1) + ") / 100";
    }

    cleanInput = cleanInput
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, "($1)/($2)")
      .replace(/\\sqrt{([^}]+)}/g, "sqrt($1)")
      .replace(/\\times/g, "*")
      .replace(/\\div/g, "/")
      .replace(/[{}]/g, "");

    if (typeof math !== "undefined" && math.evaluate) {
      const userValue = math.evaluate(cleanInput);
      const expectedValue = math.evaluate(cleanExpected);

      if (
        typeof userValue !== "number" ||
        typeof expectedValue !== "number" ||
        isNaN(userValue) ||
        isNaN(expectedValue)
      ) {
        return false;
      }

      return Math.abs(userValue - expectedValue) <= tolerance;
    } else {
      const userNum = parseFloat(cleanInput);
      const expectedNum = parseFloat(cleanExpected);

      if (!isNaN(userNum) && !isNaN(expectedNum)) {
        return Math.abs(userNum - expectedNum) <= tolerance;
      }
    }
  } catch (err) {
    console.warn("Error running analytical evaluation metrics:", err);
  }

  return false;
}
function normalPDF(x, mu, sigma) {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
  );
}

// ==========================================
// 📊 CHART RENDERING ENGINES
// ==========================================

function drawQuestionChart(chartData, shadeThreshold = null) {
  if (!chartData) return;

  if (chartData.type === "bar") {
    drawBarChart(chartData);
    return;
  }

  if (chartData.type === "expected_value_profit") {
    drawExpectedValueProfitChart(chartData);
    return;
  }

  if (chartData.type === "pie" || chartData.type === "doughnut") {
    drawPieChart(chartData);
    return;
  }

  if (chartData.type === "confidence_interval_bounds") {
    drawConfidenceIntervalBounds(chartData);
    return;
  }

  drawNormalCurve(chartData.mu, chartData.sigma, shadeThreshold);
}

function resetChartCanvas() {
  const canvas = document.getElementById("statsChart");
  if (!canvas) return null;

  if (typeof statsChartInstance !== "undefined" && statsChartInstance) {
    statsChartInstance.destroy();
  }

  return canvas.getContext("2d");
}
function drawConfidenceIntervalBounds(chartData) {
  const ctx = resetChartCanvas();
  if (!ctx) return;

  const mu = chartData.mu;
  const sigma = chartData.sigma;

  const lower = mu - sigma;
  const upper = mu + sigma;

  const gridColor = isDarkMode() ? "#1e293b" : "#f1f5f9";
  const tickColor = isDarkMode() ? "#cbd5e1" : "#475569";

  statsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Confidence Interval"],
      datasets: [
        {
          label: "Lower Bound",
          data: [lower],
          backgroundColor: "rgba(37, 99, 235, 0.7)",
        },
        {
          label: "Mean",
          data: [mu],
          backgroundColor: "rgba(5, 150, 105, 0.7)",
        },
        {
          label: "Upper Bound",
          data: [upper],
          backgroundColor: "rgba(220, 38, 38, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            callback: (v) => `$${Number(v).toLocaleString()}`,
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: tickColor },
        },
      },
    },
  });
}

function getChartColors(alpha = 0.72) {
  return [
    `rgba(37, 99, 235, ${alpha})`,
    `rgba(5, 150, 105, ${alpha})`,
    `rgba(217, 119, 6, ${alpha})`,
    `rgba(220, 38, 38, ${alpha})`,
    `rgba(79, 70, 229, ${alpha})`,
    `rgba(8, 145, 178, ${alpha})`,
  ];
}

function formatDatasetLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getNumericChartKeys(chartData) {
  return Object.keys(chartData).filter((key) => {
    if (
      key === "type" ||
      key === "categories" ||
      key === "labels" ||
      key === "id"
    )
      return false;
    return (
      Array.isArray(chartData[key]) &&
      chartData[key].length > 0 &&
      chartData[key].every((value) => typeof value === "number")
    );
  });
}

function drawBarChart(chartData) {
  const ctx = resetChartCanvas();
  if (!ctx) return;

  const labels = chartData.categories || chartData.labels || [];
  const numericKeys = getNumericChartKeys(chartData);
  const colors = getChartColors();
  const gridColor = isDarkMode() ? "#1e293b" : "#f1f5f9";
  const tickColor = isDarkMode() ? "#cbd5e1" : "#475569";

  const datasets = numericKeys.map((key, index) => ({
    label: formatDatasetLabel(key),
    data: chartData[key],
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length].replace("0.72", "1"),
    borderWidth: 1,
    borderRadius: 3,
  }));

  statsChartInstance = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tickColor,
            font: { family: "Courier New", size: 10 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { family: "Courier New", size: 10 },
          },
        },
      },
      plugins: {
        legend: {
          display: datasets.length > 1,
          labels: { color: tickColor, boxWidth: 10, font: { size: 10 } },
        },
      },
    },
  });
}

function drawExpectedValueProfitChart(chartData) {
  const ctx = resetChartCanvas();
  if (!ctx) return;

  const labels = chartData.categories || chartData.labels || [];
  const probabilities = chartData.probabilities || [];
  const netProfit = chartData.netProfit || chartData.net_profit || [];
  const expectedProfit = chartData.expectedProfit;
  const gridColor = isDarkMode() ? "#1e293b" : "#f1f5f9";
  const tickColor = isDarkMode() ? "#cbd5e1" : "#475569";
  const expectedLineColor = isDarkMode() ? "#fbbf24" : "#b45309";

  const datasets = [
    {
      type: "bar",
      label: "Probability",
      data: probabilities,
      yAxisID: "probability",
      backgroundColor: "rgba(37, 99, 235, 0.68)",
      borderColor: "rgba(37, 99, 235, 1)",
      borderWidth: 1,
      borderRadius: 3,
    },
    {
      type: "bar",
      label: "Net Profit",
      data: netProfit,
      yAxisID: "profit",
      backgroundColor: "rgba(5, 150, 105, 0.68)",
      borderColor: "rgba(5, 150, 105, 1)",
      borderWidth: 1,
      borderRadius: 3,
    },
  ];

  if (typeof expectedProfit === "number") {
    datasets.push({
      type: "line",
      label: "Expected Profit",
      data: labels.map(() => expectedProfit),
      yAxisID: "profit",
      borderColor: expectedLineColor,
      backgroundColor: expectedLineColor,
      borderDash: [6, 4],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0,
    });
  }

  statsChartInstance = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tickColor,
            font: { family: "Courier New", size: 10 },
          },
        },
        probability: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          suggestedMax: 1,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            callback: (value) => `${Math.round(value * 100)}%`,
            font: { family: "Courier New", size: 10 },
          },
          title: {
            display: true,
            text: "Probability",
            color: tickColor,
            font: { size: 10, weight: "bold" },
          },
        },
        profit: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: {
            color: tickColor,
            callback: (value) => `$${Number(value).toLocaleString()}`,
            font: { family: "Courier New", size: 10 },
          },
          title: {
            display: true,
            text: "Net Profit",
            color: tickColor,
            font: { size: 10, weight: "bold" },
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: tickColor, boxWidth: 10, font: { size: 10 } },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              if (context.dataset.yAxisID === "probability") {
                return `${context.dataset.label}: ${Math.round(context.parsed.y * 100)}%`;
              }
              return `${context.dataset.label}: $${Number(context.parsed.y).toLocaleString()}`;
            },
          },
        },
      },
    },
  });
}

function drawPieChart(chartData) {
  const ctx = resetChartCanvas();
  if (!ctx) return;

  const labels = chartData.categories || chartData.labels || [];
  const numericKeys = getNumericChartKeys(chartData);
  const dataKey = chartData.valueKey || numericKeys[0];
  const labelColor = isDarkMode() ? "#cbd5e1" : "#475569";

  statsChartInstance = new Chart(ctx, {
    type: chartData.type === "doughnut" ? "doughnut" : "pie",
    data: {
      labels,
      datasets: [
        {
          data: chartData.values || chartData.data || chartData[dataKey] || [],
          backgroundColor: getChartColors(0.78),
          borderColor: isDarkMode() ? "#0f172a" : "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { color: labelColor, boxWidth: 10, font: { size: 10 } },
        },
      },
    },
  });
}

function drawNormalCurve(mu, sigma, shadeThreshold = null) {
  const ctx = resetChartCanvas();
  if (!ctx) return;

  const curveColor = isDarkMode() ? "#93c5fd" : "#0A192F";
  const gridColor = isDarkMode() ? "#1e293b" : "#f1f5f9";
  const fillColor = isDarkMode()
    ? "rgba(147, 197, 253, 0.06)"
    : "rgba(10, 25, 47, 0.02)";
  const shadedColor = isDarkMode()
    ? "rgba(251, 113, 133, 0.25)"
    : "rgba(225, 29, 72, 0.2)";
  const tickColor = isDarkMode() ? "#cbd5e1" : "#475569";

  const unshadedPoints = [];
  const shadedPoints = [];
  const startX = mu - 4 * sigma;
  const endX = mu + 4 * sigma;
  const step = (endX - startX) / 150;

  let addedThresholdIntersection = false;

  for (let x = startX; x <= endX; x += step) {
    const y = normalPDF(x, mu, sigma);

    if (shadeThreshold !== null) {
      if (x <= shadeThreshold) {
        shadedPoints.push({ x, y });
      } else {
        // Inject intersection crossover coordinate so Chart fills match seamlessly
        if (!addedThresholdIntersection && shadedPoints.length > 0) {
          const intersectY = normalPDF(shadeThreshold, mu, sigma);
          shadedPoints.push({ x: shadeThreshold, y: intersectY });
          unshadedPoints.push({ x: shadeThreshold, y: intersectY });
          addedThresholdIntersection = true;
        }
        unshadedPoints.push({ x, y });
      }
    } else {
      unshadedPoints.push({ x, y });
    }
  }

  // Define dynamic datasets
  const datasets = [
    {
      label: "Distribution Curve",
      data: unshadedPoints,
      borderColor: curveColor,
      backgroundColor: fillColor,
      borderWidth: 1.5,
      pointRadius: 0,
      fill: true,
      tension: 0.1,
    },
  ];

  // Append background shaded coordinates sequence securely
  if (shadeThreshold !== null && shadedPoints.length > 0) {
    datasets.push({
      label: "Shaded Left-Tail Region",
      data: shadedPoints,
      borderColor: "transparent",
      backgroundColor: shadedColor,
      borderWidth: 0,
      pointRadius: 0,
      fill: true,
      tension: 0.1,
    });
  }

  statsChartInstance = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { family: "Courier New" } },
        },
        y: { display: false },
      },
      plugins: { legend: { display: false } },
    },
  });
}
