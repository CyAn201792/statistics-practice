// 🎨 3. NAVIGATION & CANVAS DRAWERS
// ==========================================
function renderNavigatorGrid() {
  const navGrid = document.getElementById("question-navigator-grid");
  if (!navGrid) return;
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
  if (!container) return;

  if (activeQuestions.length === 0) {
    container.innerHTML = `
            <div class="text-center py-16 text-slate-400 font-medium text-sm dark:text-slate-500">
                No questions match the selected topic and difficulty filters.
            </div>`;
    const contextLabel = document.getElementById("chart-context-label");
    if (contextLabel) contextLabel.textContent = "N/A";
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
  
  const contextLabel = document.getElementById("chart-context-label");
  if (contextLabel) {
    contextLabel.textContent = `Question ${currentQuestion.id} [${difficultyLabel}]`;
  }

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
                <button data-action="open-reference-tables" class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900 dark:border-indigo-800">
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
                            <span class="text-xs font-bold tracking-wide text-slate-900 font-mono dark:text-slate-300">${step.label}</span>
                            ${
                              isCurrent
                                ? `
                                <button type="button" data-toggle-hint="${index}" class="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer dark:text-slate-500 dark:hover:text-blue-300" title="Toggle Explanation Breakdown">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.056 1.056L10.5 14.25M12 7.5h.008v.008H12V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </button>
                            `
                                : ""
                            }
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                              id="step-input-${index}"
                              type="text"
                              class="math-input w-60 font-mono px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                              ${!isCurrent ? "disabled" : ""}
                            />
                            
                            ${
                              isCurrent
                                ? `
                             <button 
                             data-submit-step="${index}"
                             class="practice-action-button bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer text-center whitespace-normal break-words"
                             >
                             Check My Work
                             </button>
                             `
                                : ""
                            }
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
                        
                        <button data-action="submit-exam-answer" class="practice-action-button bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer">Submit</button>
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
            <button data-action="next-question" class="practice-action-button mt-4 bg-[#0A192F] hover:bg-slate-800 text-white shadow cursor-pointer">
                ${currentQuestionIndex === activeQuestions.length - 1 ? "Retry 🔄" : "Next Question ➡️"}
            </button>
        </div>
    `;

  container.innerHTML = html;

  setTimeout(() => {
    if (currentGameMode === "guided") {
      const activeInput = document.getElementById(`step-input-${currentStepIndex}`);
      if (activeInput) {
        activeInput.focus();
        activeInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitStep(currentStepIndex);
        });
      }
    } else {
      const examInput = document.getElementById("exam-final-input");
      if (examInput) {
        examInput.focus();
        examInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitExamAnswer();
        });
      }
    }
  }, 50);

  if (isQuestionComplete) {
    setChartPanelVisible(true);
    if (currentQuestion.chartData) {
      drawQuestionChart(currentQuestion.chartData, currentQuestion.chartData.targetX);
    }
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

  cardEl.classList.remove("animate-shake", "border-rose-300", "bg-rose-50/30", "dark:border-rose-800", "dark:bg-rose-950/30");
  if (inputEl) inputEl.classList.remove("border-rose-400", "bg-rose-50/50", "dark:border-rose-700", "dark:bg-rose-950/40");

  if (approxEqual(userInput, stepData.expected)) {
    clearMissedAttempts(getAnswerAttemptKey(currentQuestion, "step", stepIdx));
    showFeedback(feedbackEl, "✓ Perfect!", "success");
    totalCorrectSteps++;
    currentStepIndex++;
    updateMetricsDisplay();
    saveMetrics();

    if (currentStepIndex < currentQuestion.steps.length) {
      setTimeout(() => { renderQuestionCard(); }, 600);
    } else {
      setTimeout(() => {
        totalQuestionsCompleted++;
        answeredQuestionsMap[getQuestionProgressKey(currentQuestion)] = true;
        updateMetricsDisplay();
        saveAnsweredMap();
        saveMetrics();
        renderNavigatorGrid();
        
        const expBox = document.getElementById("explanation-box");
        if (expBox) expBox.classList.remove("hidden");
        
        setChartPanelVisible(true);
        if (currentQuestion.chartData) {
          drawQuestionChart(currentQuestion.chartData, currentQuestion.chartData.targetX);
        }
      }, 550);
    }
  } else {
    totalWrongAttempts++;
    const attemptCount = recordMissedAttempt(
      getAnswerAttemptKey(currentQuestion, "step", stepIdx),
    );
    updateMetricsDisplay();
    saveMetrics();
    showIncorrectFeedback(
      feedbackEl,
      "✕ Incorrect. Please try again.",
      attemptCount,
      stepData.expected,
      () => revealStepAnswer(stepIdx),
    );
    cardEl.classList.add("animate-shake", "border-rose-300", "bg-rose-50/30", "dark:border-rose-800", "dark:bg-rose-950/30");
    if (inputEl) inputEl.classList.add("border-rose-400", "bg-rose-50/50", "dark:border-rose-700", "dark:bg-rose-950/40");
  }
}

function submitExamAnswer() {
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const finalAnswer = currentQuestion.answer || currentQuestion.steps?.at(-1)?.expected;

  const inputEl = document.getElementById("exam-final-input");
  const cardEl = document.getElementById("step-card-exam");
  const feedbackEl = document.getElementById("exam-feedback");

  const userInput = inputEl ? inputEl.value.trim() : "";
  if (!userInput) return;

  if (cardEl) cardEl.classList.remove("animate-shake", "border-rose-300", "bg-rose-50/30", "dark:border-rose-800", "dark:bg-rose-950/30");
  if (inputEl) inputEl.classList.remove("border-rose-400", "bg-rose-50/50", "dark:border-rose-700", "dark:bg-rose-950/40");

  const isCorrect = approxEqual(userInput, finalAnswer);

  if (isCorrect) {
    clearMissedAttempts(getAnswerAttemptKey(currentQuestion, "exam"));
    showFeedback(feedbackEl, "✅ Correct!", "success");
    totalCorrectSteps++;
    totalQuestionsCompleted++;
    answeredQuestionsMap[getQuestionProgressKey(currentQuestion)] = true;

    updateMetricsDisplay();
    saveAnsweredMap();
    saveMetrics();
    renderNavigatorGrid();

    const expBox = document.getElementById("explanation-box");
    if (expBox) expBox.classList.remove("hidden");

    setChartPanelVisible(true);
    if (currentQuestion.chartData) {
      drawQuestionChart(currentQuestion.chartData, currentQuestion.chartData.targetX);
    }
    return;
  }

  totalWrongAttempts++;
  const attemptCount = recordMissedAttempt(
    getAnswerAttemptKey(currentQuestion, "exam"),
  );
  updateMetricsDisplay();
  saveMetrics();
  showIncorrectFeedback(
    feedbackEl,
    "❌ Not quite! Try again.",
    attemptCount,
    finalAnswer,
    revealExamAnswer,
  );

  if (cardEl) cardEl.classList.add("animate-shake", "border-rose-300", "bg-rose-50/30", "dark:border-rose-800", "dark:bg-rose-950/30");
  if (inputEl) inputEl.classList.add("border-rose-400", "bg-rose-50/50", "dark:border-rose-700", "dark:bg-rose-950/40");
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
  const mComp = document.getElementById("metric-completed");
  const mCorr = document.getElementById("metric-correct");
  const mWrong = document.getElementById("metric-wrong");
  
  if (mComp) mComp.textContent = totalQuestionsCompleted;
  if (mCorr) mCorr.textContent = totalCorrectSteps;
  if (mWrong) mWrong.textContent = totalWrongAttempts;
}

function showFeedback(element, message, type = "success") {
  if (!element) return;
  const styles = {
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-rose-600 dark:text-rose-400",
    info: "text-blue-600 dark:text-blue-400",
  };
  element.className = `mt-3 font-semibold ${styles[type]}`;
  element.textContent = message;
}

function showIncorrectFeedback(element, message, attemptCount, answer, onReveal) {
  showFeedback(element, message, "error");

  if (attemptCount < SHOW_ANSWER_AFTER_MISSES) return;

  const revealButton = document.createElement("button");
  revealButton.type = "button";
  revealButton.className =
    "ml-2 px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 text-[11px] font-bold uppercase tracking-wide dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800";
  revealButton.textContent = "Show Answer";
  revealButton.addEventListener("click", () => {
    onReveal();
    element.textContent = `Answer: ${answer}`;
    element.className = "mt-3 font-semibold text-blue-600 dark:text-blue-400";
  });

  element.appendChild(revealButton);
}

function getAnswerAttemptKey(question, scope, stepIdx = "final") {
  return `${getQuestionProgressKey(question)}:${scope}:${stepIdx}`;
}

function recordMissedAttempt(key) {
  missedAttemptsMap[key] = (missedAttemptsMap[key] || 0) + 1;
  return missedAttemptsMap[key];
}

function clearMissedAttempts(key) {
  delete missedAttemptsMap[key];
}

function revealStepAnswer(stepIdx) {
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const inputEl = document.getElementById(`step-input-${stepIdx}`);
  if (!inputEl || !currentQuestion?.steps?.[stepIdx]) return;
  inputEl.value = currentQuestion.steps[stepIdx].expected;
  inputEl.focus();
}

function revealExamAnswer() {
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const inputEl = document.getElementById("exam-final-input");
  if (!inputEl || !currentQuestion) return;
  inputEl.value = currentQuestion.answer || currentQuestion.steps?.at(-1)?.expected || "";
  inputEl.focus();
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

function applyFilters(shouldSavePreferences = true) {
  const catSelect = document.getElementById("category-select");
  const diffSelect = document.getElementById("difficulty-select");
  if (!catSelect || !diffSelect) return;

  const selectedTopic = catSelect.value;
  const selectedDiff = normalizeDifficulty(diffSelect.value);
  const questionBank = getCurrentQuestionBank();

  activeQuestions = questionBank.filter((q) => {
    const matchesTopic = selectedTopic === "all" || q.type.includes(selectedTopic);
    const matchesDiff = selectedDiff === "all" || normalizeDifficulty(q.difficulty) === selectedDiff;
    return matchesTopic && matchesDiff;
  });

  currentQuestionIndex = 0;
  currentStepIndex = 0;
  if (shouldSavePreferences) savePracticePreferences();
  renderNavigatorGrid();
  renderQuestionCard();
}

function updateGameModeButtons() {
  const btnGuided = document.getElementById("btn-mode-guided");
  const btnExam = document.getElementById("btn-mode-exam");

  if (currentGameMode === "guided") {
    if (btnGuided) btnGuided.className = "w-1/2 text-center py-2 rounded text-xs font-bold transition-all bg-white text-slate-900 shadow-sm cursor-pointer dark:bg-slate-700 dark:text-white";
    if (btnExam) btnExam.className = "w-1/2 text-center py-2 rounded text-xs font-bold transition-all text-slate-500 hover:text-slate-800 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100";
  } else {
    if (btnExam) btnExam.className = "w-1/2 text-center py-2 rounded text-xs font-bold transition-all bg-white text-slate-900 shadow-sm cursor-pointer dark:bg-slate-700 dark:text-white";
    if (btnGuided) btnGuided.className = "w-1/2 text-center py-2 rounded text-xs font-bold transition-all text-slate-500 hover:text-slate-800 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100";
  }
}

function switchGameMode(mode) {
  currentGameMode = mode;
  updateGameModeButtons();

  currentStepIndex = 0;
  applyFilters();
}

function resetPerformanceCounters() {
  totalQuestionsCompleted = 0;
  totalCorrectSteps = 0;
  totalWrongAttempts = 0;
  answeredQuestionsMap = {};

  localStorage.removeItem(LS_KEYS.ANSWERS);
  localStorage.removeItem(LS_KEYS.METRICS);

  updateMetricsDisplay();
  applyFilters();
}

document.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-submit-step]");
  if (stepButton) {
    submitStep(Number(stepButton.dataset.submitStep));
    return;
  }

  const hintButton = event.target.closest("[data-toggle-hint]");
  if (hintButton) {
    toggleHint(Number(hintButton.dataset.toggleHint));
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  if (actionTarget.dataset.action === "submit-exam-answer") {
    submitExamAnswer();
  }

  if (actionTarget.dataset.action === "next-question") {
    nextQuestion();
  }
});

// ==========================================
