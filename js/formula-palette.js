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
            <button type="button" data-symbol="H_0:" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">H₀:</button>
            <button type="button" data-symbol="H_a:" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">Hₐ:</button>
            <button type="button" data-symbol="\\sqrt{#?}" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">√ sqrt</button>
            <button type="button" data-symbol="^{2}" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">x²</button>
            <button type="button" data-symbol="\\frac{#?}{#?}" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">½ fraction</button>
            <button type="button" data-symbol="\\times" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">×</button>
            <button type="button" data-symbol="\\mu" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">μ mean</button>
            <button type="button" data-symbol="\\sigma" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">σ std dev</button>
            <button type="button" data-symbol="X" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">X</button>
            <button type="button" data-symbol="=" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">=</button>
            <button type="button" data-symbol="<" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">&lt;</button>
            <button type="button" data-symbol=">" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">&gt;</button>
            <button type="button" data-symbol="\\le" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">≤</button>
            <button type="button" data-symbol="\\ge" class="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">≥</button>
            <button type="button" data-symbol="(" class="px-1.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">(</button>
            <button type="button" data-symbol=")" class="px-1.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-mono text-xs font-bold rounded border border-slate-300 shadow-sm cursor-pointer transition-all dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:text-slate-200 dark:border-slate-700">)</button>
        </div>
    `;
}

document.addEventListener("click", (event) => {
  const symbolButton = event.target.closest("[data-symbol]");
  if (!symbolButton) return;
  injectSymbol(symbolButton.dataset.symbol);
});

// ==========================================
