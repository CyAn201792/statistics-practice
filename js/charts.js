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

  if (statsChartInstance) {
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
    if (key === "type" || key === "categories" || key === "labels" || key === "id") return false;
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
  const fillColor = isDarkMode() ? "rgba(147, 197, 253, 0.06)" : "rgba(10, 25, 47, 0.02)";
  const shadedColor = isDarkMode() ? "rgba(251, 113, 133, 0.25)" : "rgba(225, 29, 72, 0.2)";
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
