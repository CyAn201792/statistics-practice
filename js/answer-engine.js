// ⚙️ 5. LATEX-AWARE COMPUTATIONAL ALGEBRA ENGINE
// ==========================================
function normalizeRawAnswer(value) {
  return String(value)
    .replace(/\$/g, "")
    .replace(/(?<=\d),(?=\d{3}\b)/g, "")
    .replace(/,/g, " ")
    .trim();
}

function normalizeHypothesisExpression(value) {
  return String(value)
    .toLowerCase()
    .replace(/\\mu/g, "mu")
    .replace(/\\alpha/g, "alpha")
    .replace(/\\sigma/g, "sigma")
    .replace(/h_0:/g, "")
    .replace(/h_a:/g, "")
    .replace(/h0:/g, "")
    .replace(/ha:/g, "")
    .replace(/h₀:/g, "")
    .replace(/hₐ:/g, "")
    .replace(/\\le/g, "<=")
    .replace(/\\ge/g, ">=")
    .replace(/\s+/g, "")
    .trim();
}

function isHypothesisExpression(value) {
  return /^[a-z]+(?:=|<|>|<=|>=)-?\d+(\.\d+)?%?$/.test(
    normalizeHypothesisExpression(value)
  );
}

function approxEqual(userInput, expectedAnswer, tolerance = 0.05) {
  try {
    if (expectedAnswer === undefined || expectedAnswer === null) return false;

    function extractNumber(s) {
      if (s === null || s === undefined) return NaN;
      return parseFloat(
        String(s)
          .replace(/[\s\u200B-\u200D\uFEFF\u00A0]/g, "")
          .replace(/,/g, "")
          .replace("%", "")
          .replace(/\\,/g, "")
      );
    }
    
    const numInput = extractNumber(userInput);
    const numExpected = extractNumber(expectedAnswer);

    if (!isNaN(numInput) && !isNaN(numExpected)) {
      return Math.abs(numInput - numExpected) <= tolerance;
    }

    // ==========================================
    // 1. RAW INPUT CLEANUP
    // ==========================================
    let cleanInput = normalizeRawAnswer(userInput);
    let cleanExpected = normalizeRawAnswer(expectedAnswer);

    cleanInput = cleanInput.replace(/\\,/g, "").replace(/\s+/g, " ").trim();
    cleanExpected = cleanExpected.replace(/\\,/g, "").replace(/\s+/g, " ").trim();

    // ==========================================
    // 1.5. EARLY EXIT FOR DIRECT TEXT MATCH
    // ==========================================
    const normInput = cleanInput.toLowerCase().trim();
    const normExpected = cleanExpected.toLowerCase().trim();
    const decisionWords = ["reject", "fail to reject"];

    if (decisionWords.includes(normExpected) || decisionWords.includes(normInput)) {
      return (
        normInput === normExpected ||
        normInput.includes(normExpected) ||
        normExpected.includes(normInput)
      );
    }

    if (normInput === normExpected && normInput !== "") {
      return true;
    }

    // ==========================================
    // 2. HYPOTHESIS / EQUATION MATCHING
    // ==========================================
    function normalizeEquationString(s) {
      return String(s)
        .replace(/\$/g, "")
        .replace(/\s+/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "");
    }

    function parseEquation(s) {
      const match = normalizeEquationString(s).match(
        /^([a-zA-Zμσ])\s*(=|<=|>=|<|>)\s*(-?\d+(\.\d+)?)/
      );
      if (!match) return null;
      return {
        variable: match[1],
        operator: match[2],
        value: Number(match[3]),
      };
    }

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

    if (intervalPattern.test(cleanInput) && intervalPattern.test(cleanExpected)) {
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
    if (isHypothesisExpression(cleanExpected) && isHypothesisExpression(cleanInput)) {
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
      (cleanExpected.includes("μ") || cleanExpected.includes("σ") || cleanExpected.includes("X"))
    ) {
      const inputNumbers = cleanInput.match(/-?\d+(\.\d+)?/g) || [];
      const expectedNumbers = cleanExpected.match(/-?\d+(\.\d+)?/g) || [];

      if (inputNumbers.length !== expectedNumbers.length) return false;

      inputNumbers.sort((a, b) => Number(a) - Number(b));
      expectedNumbers.sort((a, b) => Number(a) - Number(b));

      return expectedNumbers.every(
        (num, idx) => Math.abs(Number(num) - Number(inputNumbers[idx])) < tolerance
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
