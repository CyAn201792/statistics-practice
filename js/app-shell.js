function startPracticing() {
  document.getElementById("landing-section")?.classList.add("hidden");
  document.getElementById("filters-section")?.classList.remove("hidden");
  document.getElementById("practice-section")?.classList.remove("hidden");
  document.getElementById("game-container")?.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
  document
    .getElementById("hero-start-practicing")
    ?.addEventListener("click", startPracticing);
  document
    .getElementById("category-select")
    ?.addEventListener("change", () => applyFilters());
  document
    .getElementById("difficulty-select")
    ?.addEventListener("change", () => applyFilters());

  document.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action === "open-reference-tables") openReferenceTables();
      if (action === "open-calculator") openCalculator();
      if (action === "reset-performance") resetPerformanceCounters();
    }

    const modeTarget = event.target.closest("[data-mode]");
    if (modeTarget) {
      switchGameMode(modeTarget.dataset.mode);
    }
  });
});
