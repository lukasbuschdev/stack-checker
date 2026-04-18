import { getConfidenceClass } from "../utils/helpers";

export function renderSecondary(result) {
  const evidenceItems = (result.evidence || []).map((item) => `<li>${item.message}</li>`).join("");
  const insightsItems = (result.insights || []).map((item) => `<li>${item}</li>`).join("");

  return /*html*/ `
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${formatType(result.type)}]</strong>
          ${result.name}
        </span>
        <span class="metric ${getConfidenceClass(result.confidence)}">
          ${result.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${evidenceItems ? /*html*/ `<ul>${evidenceItems}</ul>` : /*html*/ `<span class="muted">No direct evidence found</span>`}
      </div>

      ${
        insightsItems
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title"><strong>Analysis</strong></span>
            <ul>${insightsItems}</ul>
          </div>
        `
          : ""
      }
    </div>
  `;
}

export function renderSecondaryFallback() {
  return /*html*/ `
    <div class="result-card column gap-20">
      <span class="muted">
        No additional technologies detected. This may indicate a minimal or highly optimized setup.
      </span>
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
