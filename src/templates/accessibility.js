import { metricRow, getScoreClass } from "../utils/helpers";

export function renderAccessibility(accessibility) {
  const insights = accessibility.insights || [];

  const groupedInsights = { critical: [], warning: [], info: [] };

  insights.forEach((item) => {
    if (groupedInsights[item.level]) {
      groupedInsights[item.level].push(item.message);
    }
  });

  const issueCount = groupedInsights.critical.length + groupedInsights.warning.length;

  const insightsItems = `
    ${buildInsightGroup("Critical Issues", groupedInsights.critical, "critical")}
    ${buildInsightGroup("Warnings", groupedInsights.warning, "warning")}
    ${buildInsightGroup("Info", groupedInsights.info, "info")}
  `;

  return /*html*/ `
    <div class="result-section"><strong>Accessibility</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${metricRow("Score", accessibility.score ?? "N/A", getScoreClass(accessibility.score))}
        ${metricRow("Issues", issueCount, issueCount > 0 ? "warning" : "good")}
      </div>

      ${
        insightsItems.trim()
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title"><strong>Accessibility Analysis</strong></span>
            ${insightsItems}
          </div>
        `
          : ""
      }
    </div>
  `;
}

function buildInsightGroup(title, items, className) {
  if (!items.length) return "";

  return /*html*/ `
    <div class="insight-group ${className}">
      <span class="block-title mt-15"><strong>${title}</strong></span>
      <ul>
        ${items.map((msg) => `<li>${msg}</li>`).join("")}
      </ul>
    </div>
  `;
}
