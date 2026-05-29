// ==========================================================================
// 📊 STATISTICAL REFERENCE TABLES MODULE
// ==========================================================================

function renderReferenceTablesModal() {
  const mount = document.getElementById("reference-tables-mount");
  if (!mount) return;

  mount.innerHTML = `
    <div
      id="reference-tables-modal"
      class="hidden fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-2 sm:p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col dark:bg-slate-900"
      >
        <div class="bg-indigo-600 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-bold">Statistical Reference Tables</h2>
          <button data-reference-close class="text-xl hover:text-indigo-200 transition-colors">✕</button>
        </div>

        <div class="overflow-y-auto flex-1 mobile-scroll">
          <div class="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-3 sticky top-0 z-10 dark:bg-slate-950 dark:border-slate-800">
            <div class="flex gap-2 flex-wrap">
              <button data-table="z-table" class="table-selector-btn active px-3 py-2 bg-indigo-600 text-white rounded text-xs font-bold transition-colors">Z-Table</button>
              <button data-table="z-critical" class="table-selector-btn px-3 py-2 bg-slate-300 text-slate-700 rounded text-xs font-bold hover:bg-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Z-Critical Values</button>
              <button data-table="t-table" class="table-selector-btn px-3 py-2 bg-slate-300 text-slate-700 rounded text-xs font-bold hover:bg-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">T-Table</button>
              <button data-table="chi-square" class="table-selector-btn px-3 py-2 bg-slate-300 text-slate-700 rounded text-xs font-bold hover:bg-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Chi-Square</button>
            </div>
          </div>

          <div id="z-table-content" class="p-6 block">
            <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-100">Standard Normal Distribution Table</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Dynamically mapping critical mathematical data variations</p>
              </div>
              <div class="flex items-center gap-2">
                <label for="z-table-type" class="text-xs font-bold text-slate-500 font-mono whitespace-nowrap dark:text-slate-400">Format:</label>
                <select id="z-table-type" class="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold font-mono text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                  <option value="cumulative">Cumulative Left-Tail [P(Z ≤ z)]</option>
                  <option value="meanToZ">Area from Mean to Z</option>
                </select>
              </div>
            </div>
            <div class="overflow-x-auto max-h-[420px] border border-slate-300 rounded shadow-inner dark:border-slate-700">
              <table class="w-full border-collapse text-xs font-mono">
                <thead class="bg-slate-200 sticky top-0 border-b border-slate-300 z-10 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                  <tr>
                    <th class="border border-slate-300 p-2 text-center font-bold bg-slate-200 sticky left-0 dark:bg-slate-800 dark:border-slate-700">z</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.00</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.01</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.02</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.03</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.04</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.05</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.06</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.07</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.08</th>
                    <th class="border border-slate-300 p-2 text-center font-bold dark:border-slate-700">0.09</th>
                  </tr>
                </thead>
                <tbody id="z-table-body" class="bg-white divide-y divide-slate-100 dark:bg-slate-900 dark:divide-slate-800"></tbody>
              </table>
            </div>
          </div>

          <div id="z-critical-content" class="p-6 hidden">
            <h3 class="text-sm font-bold text-slate-700 mb-3 dark:text-slate-100">Critical Z-Values for Common Confidence Levels</h3>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-xs font-mono border border-slate-300 dark:border-slate-700">
                <thead class="bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                  <tr>
                    <th class="border border-slate-300 p-2 text-left font-bold">Confidence Level</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">Alpha (α)</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">Z-Critical (Two-Tailed)</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">Z-Critical (One-Tailed)</th>
                  </tr>
                </thead>
                <tbody id="z-critical-body" class="bg-white dark:bg-slate-900"></tbody>
              </table>
            </div>
          </div>

          <div id="t-table-content" class="p-6 hidden">
            <h3 class="text-sm font-bold text-slate-700 mb-3 dark:text-slate-100">Student's T-Distribution Critical Values</h3>
            <p class="text-xs text-slate-600 mb-4 dark:text-slate-400">Two-tailed test values for common degrees of freedom</p>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-xs font-mono border border-slate-300 dark:border-slate-700">
                <thead class="bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                  <tr>
                    <th rowspan="2" class="border border-slate-300 p-2 text-left font-bold align-middle">df</th>
                    <th colspan="10" class="border border-slate-300 p-2 text-center font-bold">One-Tail Probability</th>
                  </tr>
                  <tr>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.25</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.20</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.15</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.10</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.05</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.025</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.01</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.005</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.001</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">0.0005</th>
                  </tr>
                </thead>
                <tbody id="t-table-body" class="bg-white dark:bg-slate-900"></tbody>
              </table>
            </div>
          </div>

          <div id="chi-square-content" class="p-6 hidden">
            <h3 class="text-sm font-bold text-slate-700 mb-3 dark:text-slate-100">Chi-Square Distribution Critical Values</h3>
            <p class="text-xs text-slate-600 mb-4 dark:text-slate-400">Right-tail critical values for common degrees of freedom</p>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-xs font-mono border border-slate-300 dark:border-slate-700">
                <thead class="bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                  <tr>
                    <th class="border border-slate-300 p-2 text-left font-bold">df</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">90%</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">95%</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">98%</th>
                    <th class="border border-slate-300 p-2 text-center font-bold">99%</th>
                  </tr>
                </thead>
                <tbody id="chi-square-body" class="bg-white dark:bg-slate-900"></tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end dark:bg-slate-950 dark:border-slate-800">
          <button data-reference-close class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-sm font-bold transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200">Close</button>
        </div>
      </div>
    </div>
  `;
}

renderReferenceTablesModal();

const zCriticalValues = [
  { confidence: "90%", alpha: 0.10, twoTailed: 1.645, oneTailed: 1.282 },
  { confidence: "95%", alpha: 0.05, twoTailed: 1.960, oneTailed: 1.645 },
  { confidence: "98%", alpha: 0.02, twoTailed: 2.330, oneTailed: 2.054 },
  { confidence: "99%", alpha: 0.01, twoTailed: 2.576, oneTailed: 2.326 }
];

const tCriticalValues = [
  { df: 1,  t025: 1.000, t020: 1.376, t015: 1.963, t010: 3.078, t005: 6.314, t0025: 12.706, t001: 31.821, t0005: 63.657, t0001: 318.31, t00005: 636.62 },
  { df: 2,  t025: 0.816, t020: 1.061, t015: 1.386, t010: 1.886, t005: 2.920, t0025: 4.303, t001: 6.965, t0005: 9.925, t0001: 22.327, t00005: 31.599 },
  { df: 3,  t025: 0.765, t020: 0.978, t015: 1.250, t010: 1.638, t005: 2.353, t0025: 3.182, t001: 4.541, t0005: 5.841, t0001: 10.215, t00005: 12.924 },
  { df: 4,  t025: 0.741, t020: 0.941, t015: 1.190, t010: 1.533, t005: 2.132, t0025: 2.776, t001: 3.747, t0005: 4.604, t0001: 7.173, t00005: 8.610 },
  { df: 5,  t025: 0.727, t020: 0.920, t015: 1.156, t010: 1.476, t005: 2.015, t0025: 2.571, t001: 3.365, t0005: 4.032, t0001: 5.893, t00005: 6.869 },

  { df: 6,  t025: 0.718, t020: 0.906, t015: 1.134, t010: 1.440, t005: 1.943, t0025: 2.447, t001: 3.143, t0005: 3.707, t0001: 5.208, t00005: 5.959 },
  { df: 7,  t025: 0.711, t020: 0.896, t015: 1.119, t010: 1.415, t005: 1.895, t0025: 2.365, t001: 2.998, t0005: 3.499, t0001: 4.785, t00005: 5.408 },
  { df: 8,  t025: 0.706, t020: 0.889, t015: 1.108, t010: 1.397, t005: 1.860, t0025: 2.306, t001: 2.896, t0005: 3.355, t0001: 4.501, t00005: 5.041 },
  { df: 9,  t025: 0.703, t020: 0.883, t015: 1.100, t010: 1.383, t005: 1.833, t0025: 2.262, t001: 2.821, t0005: 3.250, t0001: 4.297, t00005: 4.781 },
  { df: 10, t025: 0.700, t020: 0.879, t015: 1.093, t010: 1.372, t005: 1.812, t0025: 2.228, t001: 2.764, t0005: 3.169, t0001: 4.144, t00005: 4.587 },

  { df: 11, t025: 0.697, t020: 0.876, t015: 1.088, t010: 1.363, t005: 1.796, t0025: 2.201, t001: 2.718, t0005: 3.106, t0001: 4.025, t00005: 4.437 },
  { df: 12, t025: 0.695, t020: 0.873, t015: 1.083, t010: 1.356, t005: 1.782, t0025: 2.179, t001: 2.681, t0005: 3.055, t0001: 3.930, t00005: 4.318 },
  { df: 13, t025: 0.694, t020: 0.870, t015: 1.079, t010: 1.350, t005: 1.771, t0025: 2.160, t001: 2.650, t0005: 3.012, t0001: 3.852, t00005: 4.221 },
  { df: 14, t025: 0.692, t020: 0.868, t015: 1.076, t010: 1.345, t005: 1.761, t0025: 2.145, t001: 2.624, t0005: 2.977, t0001: 3.787, t00005: 4.140 },
  { df: 15, t025: 0.691, t020: 0.866, t015: 1.074, t010: 1.341, t005: 1.753, t0025: 2.131, t001: 2.602, t0005: 2.947, t0001: 3.733, t00005: 4.073 },

  { df: 16, t025: 0.690, t020: 0.865, t015: 1.071, t010: 1.337, t005: 1.746, t0025: 2.120, t001: 2.583, t0005: 2.921, t0001: 3.686, t00005: 4.015 },
  { df: 17, t025: 0.689, t020: 0.863, t015: 1.069, t010: 1.333, t005: 1.740, t0025: 2.110, t001: 2.567, t0005: 2.898, t0001: 3.646, t00005: 3.965 },
  { df: 18, t025: 0.688, t020: 0.862, t015: 1.067, t010: 1.330, t005: 1.734, t0025: 2.101, t001: 2.552, t0005: 2.878, t0001: 3.610, t00005: 3.922 },
  { df: 19, t025: 0.688, t020: 0.861, t015: 1.066, t010: 1.328, t005: 1.729, t0025: 2.093, t001: 2.539, t0005: 2.861, t0001: 3.579, t00005: 3.883 },
  { df: 20, t025: 0.687, t020: 0.860, t015: 1.064, t010: 1.325, t005: 1.725, t0025: 2.086, t001: 2.528, t0005: 2.845, t0001: 3.552, t00005: 3.850 },

  { df: 21, t025: 0.686, t020: 0.859, t015: 1.063, t010: 1.323, t005: 1.721, t0025: 2.080, t001: 2.518, t0005: 2.831, t0001: 3.527, t00005: 3.819 },
  { df: 22, t025: 0.686, t020: 0.858, t015: 1.061, t010: 1.321, t005: 1.717, t0025: 2.074, t001: 2.508, t0005: 2.819, t0001: 3.505, t00005: 3.792 },
  { df: 23, t025: 0.685, t020: 0.858, t015: 1.060, t010: 1.319, t005: 1.714, t0025: 2.069, t001: 2.500, t0005: 2.807, t0001: 3.485, t00005: 3.768 },
  { df: 24, t025: 0.685, t020: 0.857, t015: 1.059, t010: 1.318, t005: 1.711, t0025: 2.064, t001: 2.492, t0005: 2.797, t0001: 3.467, t00005: 3.745 },
  { df: 25, t025: 0.684, t020: 0.856, t015: 1.058, t010: 1.316, t005: 1.708, t0025: 2.060, t001: 2.485, t0005: 2.787, t0001: 3.450, t00005: 3.725 },

  { df: 26, t025: 0.684, t020: 0.856, t015: 1.058, t010: 1.315, t005: 1.706, t0025: 2.056, t001: 2.479, t0005: 2.779, t0001: 3.435, t00005: 3.707 },
  { df: 27, t025: 0.684, t020: 0.855, t015: 1.057, t010: 1.314, t005: 1.703, t0025: 2.052, t001: 2.473, t0005: 2.771, t0001: 3.421, t00005: 3.690 },
  { df: 28, t025: 0.683, t020: 0.855, t015: 1.056, t010: 1.313, t005: 1.701, t0025: 2.048, t001: 2.467, t0005: 2.763, t0001: 3.408, t00005: 3.674 },
  { df: 29, t025: 0.683, t020: 0.854, t015: 1.055, t010: 1.311, t005: 1.699, t0025: 2.045, t001: 2.462, t0005: 2.756, t0001: 3.396, t00005: 3.659 },
  { df: 30, t025: 0.683, t020: 0.854, t015: 1.055, t010: 1.310, t005: 1.697, t0025: 2.042, t001: 2.457, t0005: 2.750, t0001: 3.385, t00005: 3.646 },

  { df: "∞", t025: 0.674, t020: 0.842, t015: 1.036, t010: 1.282, t005: 1.645, t0025: 1.960, t001: 2.326, t0005: 2.576, t0001: 3.090, t00005: 3.291 }
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

    { key: "t025", decimals: 3 },
    { key: "t020", decimals: 3 },
    { key: "t015", decimals: 3 },

    { key: "t010", decimals: 3, bold: true }, // common alpha 0.10 highlight
    { key: "t005", decimals: 3, bold: true }, // 0.05 (most used in practice)

    { key: "t0025", decimals: 3 },
    { key: "t001", decimals: 3 },

    { key: "t0005", decimals: 3 },
    { key: "t0001", decimals: 3 },
    { key: "t00005", decimals: 3 },
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
  ].find((btn) => btn.dataset.table === tableType);

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

  modal?.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-reference-close]");
    if (closeButton) {
      closeReferenceTables();
      return;
    }

    const tableButton = event.target.closest("[data-table]");
    if (tableButton) {
      showTable(tableButton.dataset.table);
    }
  });

  document
    .getElementById("z-table-type")
    ?.addEventListener("change", generateZTable);
});
