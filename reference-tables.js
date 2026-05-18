// ==========================================================================
// 📊 STATISTICAL REFERENCE TABLES MODULE
// ==========================================================================

const zCriticalValues = [
  { confidence: "90%", alpha: 0.10, twoTailed: 1.645, oneTailed: 1.282 },
  { confidence: "95%", alpha: 0.05, twoTailed: 1.960, oneTailed: 1.645 },
  { confidence: "98%", alpha: 0.02, twoTailed: 2.330, oneTailed: 2.054 },
  { confidence: "99%", alpha: 0.01, twoTailed: 2.576, oneTailed: 2.326 }
];

const tCriticalValues = [
  { df: 1,  t90: 6.314, t95: 12.706, t98: 31.821, t99: 63.657 },
  { df: 2,  t90: 2.920, t95: 4.303,  t98: 6.965,  t99: 9.925 },
  { df: 3,  t90: 2.353, t95: 3.182,  t98: 4.541,  t99: 5.841 },
  { df: 4,  t90: 2.132, t95: 2.776,  t98: 3.747,  t99: 4.604 },
  { df: 5,  t90: 2.015, t95: 2.571,  t98: 3.365,  t99: 4.032 },

  { df: 6,  t90: 1.943, t95: 2.447,  t98: 3.143,  t99: 3.707 },
  { df: 7,  t90: 1.895, t95: 2.365,  t98: 2.998,  t99: 3.499 },
  { df: 8,  t90: 1.860, t95: 2.306,  t98: 2.896,  t99: 3.355 },
  { df: 9,  t90: 1.833, t95: 2.262,  t98: 2.821,  t99: 3.250 },
  { df: 10, t90: 1.812, t95: 2.228,  t98: 2.764,  t99: 3.169 },

  { df: 11, t90: 1.796, t95: 2.201,  t98: 2.718,  t99: 3.106 },
  { df: 12, t90: 1.782, t95: 2.179,  t98: 2.681,  t99: 3.055 },
  { df: 13, t90: 1.771, t95: 2.160,  t98: 2.650,  t99: 3.012 },
  { df: 14, t90: 1.761, t95: 2.145,  t98: 2.624,  t99: 2.977 },
  { df: 15, t90: 1.753, t95: 2.131,  t98: 2.602,  t99: 2.947 },

  { df: 16, t90: 1.746, t95: 2.120,  t98: 2.583,  t99: 2.921 },
  { df: 17, t90: 1.740, t95: 2.110,  t98: 2.567,  t99: 2.898 },
  { df: 18, t90: 1.734, t95: 2.101,  t98: 2.552,  t99: 2.878 },
  { df: 19, t90: 1.729, t95: 2.093,  t98: 2.539,  t99: 2.861 },
  { df: 20, t90: 1.725, t95: 2.086,  t98: 2.528,  t99: 2.845 },

  { df: 21, t90: 1.721, t95: 2.080,  t98: 2.518,  t99: 2.831 },
  { df: 22, t90: 1.717, t95: 2.074,  t98: 2.508,  t99: 2.819 },
  { df: 23, t90: 1.714, t95: 2.069,  t98: 2.500,  t99: 2.807 },
  { df: 24, t90: 1.711, t95: 2.064,  t98: 2.492,  t99: 2.797 },
  { df: 25, t90: 1.708, t95: 2.060,  t98: 2.485,  t99: 2.787 },

  { df: 26, t90: 1.706, t95: 2.056,  t98: 2.479,  t99: 2.779 },
  { df: 27, t90: 1.703, t95: 2.052,  t98: 2.473,  t99: 2.771 },
  { df: 28, t90: 1.701, t95: 2.048,  t98: 2.467,  t99: 2.763 },
  { df: 29, t90: 1.699, t95: 2.045,  t98: 2.462,  t99: 2.756 },
  { df: 30, t90: 1.697, t95: 2.042,  t98: 2.457,  t99: 2.750 },

  { df: "∞", t90: 1.645, t95: 1.960,  t98: 2.326,  t99: 2.576 }
];

const chiSquareCriticalValues = [
  { df: 1,  chi90: 2.706,  chi95: 3.841,  chi98: 5.412,  chi99: 6.635 },
  { df: 2,  chi90: 4.605,  chi95: 5.991,  chi98: 7.824,  chi99: 9.210 },
  { df: 3,  chi90: 6.251,  chi95: 7.815,  chi98: 9.837,  chi99: 11.345 },
  { df: 4,  chi90: 7.779,  chi95: 9.488,  chi98: 11.668, chi99: 13.277 },
  { df: 5,  chi90: 9.236,  chi95: 11.070, chi98: 13.388, chi99: 15.086 },

  { df: 6,  chi90: 10.645, chi95: 12.592, chi98: 15.033, chi99: 16.812 },
  { df: 7,  chi90: 12.017, chi95: 14.067, chi98: 16.622, chi99: 18.475 },
  { df: 8,  chi90: 13.362, chi95: 15.507, chi98: 18.168, chi99: 20.090 },
  { df: 9,  chi90: 14.684, chi95: 16.919, chi98: 19.679, chi99: 21.666 },
  { df: 10, chi90: 15.987, chi95: 18.307, chi98: 21.161, chi99: 23.209 },

  { df: 11, chi90: 17.275, chi95: 19.675, chi98: 22.618, chi99: 24.725 },
  { df: 12, chi90: 18.549, chi95: 21.026, chi98: 24.054, chi99: 26.217 },
  { df: 13, chi90: 19.812, chi95: 22.362, chi98: 25.472, chi99: 27.688 },
  { df: 14, chi90: 21.064, chi95: 23.685, chi98: 26.873, chi99: 29.141 },
  { df: 15, chi90: 22.307, chi95: 24.996, chi98: 28.259, chi99: 30.578 },

  { df: 16, chi90: 23.542, chi95: 26.296, chi98: 29.633, chi99: 31.999 },
  { df: 17, chi90: 24.769, chi95: 27.587, chi98: 30.995, chi99: 33.409 },
  { df: 18, chi90: 25.989, chi95: 28.869, chi98: 32.346, chi99: 34.805 },
  { df: 19, chi90: 27.204, chi95: 30.144, chi98: 33.687, chi99: 36.191 },
  { df: 20, chi90: 28.412, chi95: 31.410, chi98: 35.020, chi99: 37.566 },

  { df: 21, chi90: 29.615, chi95: 32.671, chi98: 36.343, chi99: 38.932 },
  { df: 22, chi90: 30.813, chi95: 33.924, chi98: 37.659, chi99: 40.289 },
  { df: 23, chi90: 32.007, chi95: 35.172, chi98: 38.968, chi99: 41.638 },
  { df: 24, chi90: 33.196, chi95: 36.415, chi98: 40.270, chi99: 42.980 },
  { df: 25, chi90: 34.382, chi95: 37.652, chi98: 41.566, chi99: 44.314 },

  { df: 26, chi90: 35.563, chi95: 38.885, chi98: 42.856, chi99: 45.642 },
  { df: 27, chi90: 36.741, chi95: 40.113, chi98: 44.140, chi99: 46.963 },
  { df: 28, chi90: 37.916, chi95: 41.337, chi98: 45.419, chi99: 48.278 },
  { df: 29, chi90: 39.087, chi95: 42.557, chi98: 46.693, chi99: 49.588 },
  { df: 30, chi90: 40.256, chi95: 43.773, chi98: 47.962, chi99: 50.892 }
];

// --------------------------------------------------------------------------
// Normal Distribution
// --------------------------------------------------------------------------

function normalCDF(z) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  const scaledZ = Math.abs(z) / Math.sqrt(2);

  const t = 1 / (1 + p * scaledZ);

  const erf =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-scaledZ * scaledZ);

  return 0.5 * (1 + sign * erf);
}

// --------------------------------------------------------------------------
// Shared Table Utilities
// --------------------------------------------------------------------------

const TABLE_ROW_CLASSES = [
  "bg-white dark:bg-slate-900",
  "bg-slate-50 dark:bg-slate-950",
];

const BASE_CELL_CLASSES =
  "border border-slate-300 p-2 text-center font-mono text-xs dark:border-slate-700 dark:text-slate-300";

function createCell(text, extraClasses = "") {
  const td = document.createElement("td");
  td.className = `${BASE_CELL_CLASSES} ${extraClasses}`;
  // Fallback to empty string if text is null/undefined to prevent crashing
  td.textContent = text !== undefined && text !== null ? text : ""; 
  return td;
}

function createRow(index) {
  const tr = document.createElement("tr");
  tr.className = TABLE_ROW_CLASSES[index % 2];
  return tr;
}

function renderSimpleTable(tbodyId, data, columns) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  // Safety: If data array somehow missing, stop gracefully
  if (!data || !Array.isArray(data)) return; 

  data.forEach((rowData, index) => {
    const tr = createRow(index);

    columns.forEach((column) => {
      let value = rowData[column.key];

      // Safe decimal converting tool
      if (column.decimals !== undefined && !isNaN(parseFloat(value))) {
        value = parseFloat(value).toFixed(column.decimals);
      }

      tr.appendChild(
        createCell(
          value,
          column.bold ? "font-bold text-blue-700 dark:text-blue-300" : "",
        ),
      );
    });

    tbody.appendChild(tr);
  });
}

// --------------------------------------------------------------------------
// Z Critical Table
// --------------------------------------------------------------------------

function generateZCriticalTable() {
  renderSimpleTable("z-critical-body", zCriticalValues, [
    { key: "confidence" },
    { key: "alpha" },
    { key: "twoTailed", bold: true },
    { key: "oneTailed" },
  ]);
}

// --------------------------------------------------------------------------
// T Distribution Table
// --------------------------------------------------------------------------

function generateTTable() {
  renderSimpleTable("t-table-body", tCriticalValues, [
    { key: "df", bold: true },
    { key: "t90", decimals: 3 },
    { key: "t95", decimals: 3, bold: true },
    { key: "t98", decimals: 3 },
    { key: "t99", decimals: 3 },
  ]);
}

// --------------------------------------------------------------------------
// Chi-Square Table
// --------------------------------------------------------------------------

function generateChiSquareTable() {
  renderSimpleTable("chi-square-body", chiSquareCriticalValues, [
    { key: "df", bold: true },
    { key: "chi90", decimals: 3 },
    { key: "chi95", decimals: 3, bold: true },
    { key: "chi98", decimals: 3 },
    { key: "chi99", decimals: 3 },
  ]);
}

// --------------------------------------------------------------------------
// Z Table Generator
// --------------------------------------------------------------------------

function generateZTable() {
  const tbody = document.getElementById("z-table-body");
  const typeSelect = document.getElementById("z-table-type");

  if (!tbody) return;

  tbody.innerHTML = "";

  const isMeanToZ = typeSelect?.value === "meanToZ";

  for (let baseZ = 0; baseZ <= 3.9; baseZ += 0.1) {
    const tr = document.createElement("tr");

    tr.className =
      "hover:bg-slate-50/40 transition-colors border-b border-slate-100 dark:hover:bg-slate-800/60 dark:border-slate-800";

    const headerCell = document.createElement("td");

    headerCell.className =
      "border border-slate-300 p-2 bg-slate-50 font-bold text-center text-xs font-mono sticky left-0 z-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100";

    headerCell.textContent = baseZ.toFixed(1);

    tr.appendChild(headerCell);

    for (let increment = 0; increment <= 0.09; increment += 0.01) {
      const z = parseFloat((baseZ + increment).toFixed(2));

      let probability = normalCDF(z);

      if (isMeanToZ) {
        probability -= 0.5;
      }

      probability = Math.max(0, Math.min(probability, 1));

      const td = document.createElement("td");

      td.className =
        "border border-slate-300 p-1.5 text-center font-mono text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300";

      if (z === 1.64 || z === 1.65) {
        td.className +=
          " bg-amber-50 text-amber-900 font-bold dark:bg-amber-950 dark:text-amber-200";
      }

      td.textContent = probability.toFixed(4);

      td.title = isMeanToZ ? `Area from mean to ${z}` : `P(Z ≤ ${z})`;

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

// --------------------------------------------------------------------------
// Table Navigation (Fixed to re-render dynamically)
// --------------------------------------------------------------------------

function showTable(tableType) {
  const sections = [
    "z-table-content",
    "z-critical-content",
    "t-table-content",
    "chi-square-content",
  ];

  sections.forEach((id) => {
    document.getElementById(id)?.classList.add("hidden");
  });

  document.querySelectorAll(".table-selector-btn").forEach((btn) => {
    btn.classList.remove("bg-indigo-600", "text-white");
    btn.classList.add("bg-slate-300", "text-slate-700");
  });

  const activeSection = document.getElementById(`${tableType}-content`);
  activeSection?.classList.remove("hidden");

  const activeButton = [
    ...document.querySelectorAll(".table-selector-btn"),
  ].find((btn) => btn.getAttribute("onclick")?.includes(tableType));

  activeButton?.classList.remove("bg-slate-300", "text-slate-700");
  activeButton?.classList.add("bg-indigo-600", "text-white");

  // RE-RENDER TRIGGER: Regenerate the active table dynamically when clicked
  if (tableType === "z-table") generateZTable();
  if (tableType === "z-critical") generateZCriticalTable();
  if (tableType === "t-table") generateTTable();
  if (tableType === "chi-square") generateChiSquareTable();
}

// --------------------------------------------------------------------------
// Modal Controls
// --------------------------------------------------------------------------

function openReferenceTables() {
  document.getElementById("reference-tables-modal")?.classList.remove("hidden");

  generateZTable();
  generateZCriticalTable();
  generateTTable();
  generateChiSquareTable();

  showTable("z-table");
}

function closeReferenceTables() {
  document.getElementById("reference-tables-modal")?.classList.add("hidden");
}

// --------------------------------------------------------------------------
// Startup Events
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reference-tables-modal");

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeReferenceTables();
    }
  });
});
