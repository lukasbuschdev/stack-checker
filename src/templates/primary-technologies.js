import { getConfidenceClass } from "../utils/helpers";

export function renderPrimary(primary, categoryInsights) {
  const evidenceItems = (primary.evidence || []).map((item) => `<li>${item.message}</li>`).join("");

  const baseInsights = primary.insights || [];
  const allInsights = [...baseInsights, ...categoryInsights];

  const insightsItems = allInsights.map((item) => `<li>${item}</li>`).join("");

  return /*html*/ `
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${formatType(primary.type)}]</strong>
          ${primary.name}
        </span>
        <span class="metric ${getConfidenceClass(primary.confidence)}">
          ${primary.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>

        ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<span class="muted">No direct evidence found</span>`}
      </div>

      ${
        insightsItems
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            <ul>${insightsItems}</ul>
          </div>
        `
          : ""
      }
    </div>
  `;
}

function formatType(type) {
  switch (type) {
    case "framework":
      return "Framework";
    case "library":
      return "Library";
    case "cms":
      return "CMS";
    default:
      return "Other";
  }
}
