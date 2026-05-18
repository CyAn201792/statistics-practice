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
  { df: 2,  t90: 2.920, t95: 4.303,  t98: 6.965,  t99: 9.925  },
  { df: 3,  t90: 2.353, t95: 3.182,  t98: 4.541,  t99: 5.841  },
  { df: 4,  t90: 2.132, t95: 2.776,  t98: 3.747,  t99: 4.604  },
  { df: 5,  t90: 2.015, t95: 2.571,  t98: 3.365,  t99: 4.032  },
  { df: 10, t90: 1.812, t95: 2.228,  t98: 2.764,  t99: 3.169  },
  { df: 20, t90: 1.725, t95: 2.086,  t98: 2.528,  t99: 2.845  },
  { df: 30, t90: 1.697, t95: 2.042,  t98: 2.457,  t99: 2.750  },
  { df: "∞", t90: 1.645, t95: 1.960,  t98: 2.326,  t99: 2.576  }
];

const chiSquareCriticalValues = [
  { df: 1,  chi90: 2.706,  chi95: 3.841,  chi98: 5.412,  chi99: 6.635  },
  { df: 2,  chi90: 4.605,  chi95: 5.991,  chi98: 7.824,  chi99: 9.210  },
  { df: 3,  chi90: 6.251,  chi95: 7.815,  chi98: 9.837,  chi99: 11.345 },
  { df: 4,  chi90: 7.779,  chi95: 9.488,  chi98: 11.668, chi99: 13.277 },
  { df: 5,  chi90: 9.236,  chi95: 11.070, chi98: 13.388, chi99: 15.086 },
  { df: 10, chi90: 15.987, chi95: 18.307, chi98: 21.161, chi99: 23.209 },
  { df: 20, chi90: 28.412, chi95: 31.410, chi98: 35.020, chi99: 37.566 },
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
  td.textContent = text;
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

  data.forEach((rowData, index) => {
    const tr = createRow(index);

    columns.forEach((column) => {
      let value = rowData[column.key];

      if (typeof value === "number" && column.decimals !== undefined) {
        value = value.toFixed(column.decimals);
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
// Table Navigation
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

  if (tableType === "z-table") {
    generateZTable();
  }
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
