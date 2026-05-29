function renderCalculator() {
  const mount = document.getElementById("calculator-mount");
  if (!mount) return;

  mount.innerHTML = `
    <div id="calculator-window" style="display: none">
      <div id="calculator-titlebar">
        <span>Calculator</span>
        <div id="calculator-controls">
          <button class="calc-btn" data-calc-action="minimize" title="Minimize">&#8212;</button>
          <button class="calc-btn calc-max" data-calc-action="maximize" title="Maximize">&#9633;</button>
          <button class="calc-btn calc-close" data-calc-action="close" title="Close">&#10005;</button>
        </div>
      </div>

      <div id="calculator-body">
        <div class="calculator-main">
          <input id="calculator-display" placeholder="0" readonly />

          <div class="calc-keys">
            <button data-calc-action="memory-clear">MC</button>
            <button data-calc-action="memory-recall">MR</button>
            <button data-calc-action="memory-add">M+</button>
            <button data-calc-action="memory-subtract">M-</button>
            <button class="calc-op" data-calc-action="clear">C</button>

            <button class="calc-op" data-calc-value="sin(">sin</button>
            <button class="calc-op" data-calc-value="cos(">cos</button>
            <button class="calc-op" data-calc-value="tan(">tan</button>
            <button class="calc-op" data-calc-value="log(">log</button>
            <button class="calc-op" data-calc-value="ln(">ln</button>

            <button data-calc-value="sqrt(">√</button>
            <button data-calc-value="^2">x²</button>
            <button data-calc-value="^">xʸ</button>
            <button data-calc-value="pi">π</button>
            <button data-calc-value="e">e</button>

            <button data-calc-value="7">7</button>
            <button data-calc-value="8">8</button>
            <button data-calc-value="9">9</button>
            <button class="calc-op" data-calc-value="/">÷</button>
            <button class="calc-op" data-calc-action="backspace">⌫</button>

            <button data-calc-value="4">4</button>
            <button data-calc-value="5">5</button>
            <button data-calc-value="6">6</button>
            <button class="calc-op" data-calc-value="*">×</button>
            <button class="calc-op" data-calc-value="(">(</button>

            <button data-calc-value="1">1</button>
            <button data-calc-value="2">2</button>
            <button data-calc-value="3">3</button>
            <button class="calc-op" data-calc-value="-">-</button>
            <button class="calc-op" data-calc-value=")">)</button>

            <button data-calc-value="0">0</button>
            <button data-calc-value=".">.</button>
            <button class="calc-eq" data-calc-action="calculate">=</button>
            <button class="calc-op" data-calc-value="+">+</button>
            <button class="calc-op calc-clear-history" data-calc-action="clear-history">CLR H</button>
          </div>
        </div>

        <div id="calculator-history"></div>
      </div>
    </div>
  `;
}

renderCalculator();

let calcDisplay = document.getElementById("calculator-display");
let calcHistoryBox = document.getElementById("calculator-history");
let calcMemory = 0;
let calcDragging = false;
let calcOffsetX = 0;
let calcOffsetY = 0;

function calcPress(v) {
  if (calcDisplay.value === "Error") {
    calcDisplay.value = "";
  }
  calcDisplay.value += v;
}

function calcClearDisplay() {
  calcDisplay.value = "";
}

function calcBackspace() {
  calcDisplay.value = calcDisplay.value.slice(0, -1);
}

function calcCalculate() {
  if (!calcDisplay.value) return;
  try {
    let result = evaluateCalculatorExpression(calcDisplay.value);
    if (typeof result === "number" && !Number.isInteger(result)) {
      result = Math.round(result * 100000000) / 100000000;
    }
    calcAddHistory(calcDisplay.value + " = " + result, result);
    calcDisplay.value = result;
  } catch {
    calcDisplay.value = "Error";
  }
}

function evaluateCalculatorExpression(expression) {
  if (typeof math !== "undefined" && math.evaluate) {
    return math.evaluate(expression);
  }

  const normalized = String(expression)
    .replace(/\bpi\b/g, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\^/g, "**")
    .replace(/\bsqrt\(/g, "Math.sqrt(")
    .replace(/\bsin\(/g, "Math.sin(")
    .replace(/\bcos\(/g, "Math.cos(")
    .replace(/\btan\(/g, "Math.tan(")
    .replace(/\blog\(/g, "Math.log10(")
    .replace(/\bln\(/g, "Math.log(");

  if (!/^[\d+\-*/().,\s%*MathPIEsqrtincologta]+$/.test(normalized)) {
    throw new Error("Unsupported calculator expression");
  }

  return Function(`"use strict"; return (${normalized});`)();
}

function calcAddHistory(item, value) {
  let div = document.createElement("div");
  div.className = "calc-hist-item";
  div.innerText = item;
  div.title = "Use this result";
  div.addEventListener("click", () => {
    calcDisplay.value = String(value);
    calcDisplay.focus();
  });
  calcHistoryBox.prepend(div);
}

function calcClearHistory() {
  calcHistoryBox.innerHTML = "";
}

function calcMemoryClear() {
  calcMemory = 0;
}

function calcMemoryRecall() {
  calcDisplay.value += calcMemory;
}

function calcMemoryAdd() {
  calcMemory += Number(calcDisplay.value) || 0;
}

function calcMemorySub() {
  calcMemory -= Number(calcDisplay.value) || 0;
}

function openCalculator() {
  document.getElementById("calculator-window").style.display = "flex";
  calcDisplay.focus();
}

function closeCalculator() {
  document.getElementById("calculator-window").style.display = "none";
}

function minimizeCalculator() {
  const body = document.getElementById("calculator-body");
  body.style.display = body.style.display === "none" ? "flex" : "none";
}

function maximizeCalculator() {
  const calcWindow = document.getElementById("calculator-window");
  if (calcWindow.style.width === "100vw") {
    calcWindow.style.position = "fixed";
    calcWindow.style.width = "380px";
    calcWindow.style.height = "auto";
    calcWindow.style.top = "80px";
    calcWindow.style.left = "80px";
    calcWindow.style.borderRadius = "14px";
  } else {
    calcWindow.style.position = "fixed";
    calcWindow.style.width = "100vw";
    calcWindow.style.height = "100vh";
    calcWindow.style.top = "0";
    calcWindow.style.left = "0";
    calcWindow.style.borderRadius = "0";
  }
}

const calcTitlebar = document.getElementById("calculator-titlebar");
const calcWindow = document.getElementById("calculator-window");

calcTitlebar.addEventListener("mousedown", (e) => {
  calcDragging = true;
  calcOffsetX = e.clientX - calcWindow.offsetLeft;
  calcOffsetY = e.clientY - calcWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!calcDragging) return;
  calcWindow.style.left = e.clientX - calcOffsetX + "px";
  calcWindow.style.top = e.clientY - calcOffsetY + "px";
});

document.addEventListener("mouseup", () => {
  calcDragging = false;
});

document.addEventListener("click", (event) => {
  const valueButton = event.target.closest("[data-calc-value]");
  if (valueButton) {
    calcPress(valueButton.dataset.calcValue);
    return;
  }

  const actionButton = event.target.closest("[data-calc-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.calcAction;
  if (action === "minimize") minimizeCalculator();
  if (action === "maximize") maximizeCalculator();
  if (action === "close") closeCalculator();
  if (action === "clear") calcClearDisplay();
  if (action === "backspace") calcBackspace();
  if (action === "calculate") calcCalculate();
  if (action === "clear-history") calcClearHistory();
  if (action === "memory-clear") calcMemoryClear();
  if (action === "memory-recall") calcMemoryRecall();
  if (action === "memory-add") calcMemoryAdd();
  if (action === "memory-subtract") calcMemorySub();
});

function isCalculatorOpen() {
  return calcWindow && calcWindow.style.display !== "none";
}

function isEditableElement(element) {
  if (!element || element === document.body || element === calcDisplay) {
    return false;
  }

  const tagName = element.tagName?.toLowerCase();
  return (
    element.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

document.addEventListener("keydown", (e) => {
  if (!isCalculatorOpen() || isEditableElement(e.target)) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const directKeys = "0123456789.+-*/()^%";

  if (directKeys.includes(e.key)) {
    e.preventDefault();
    calcPress(e.key);
    return;
  }

  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calcCalculate();
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    calcBackspace();
    return;
  }

  if (e.key === "Delete" || e.key.toLowerCase() === "c") {
    e.preventDefault();
    calcClearDisplay();
    return;
  }

  if (e.key === "Escape") {
    e.preventDefault();
    closeCalculator();
  }
});
