import { getConfidenceClass } from "../utils/helpers";

export function renderRenderingStrategy(rendering) {
  const evidenceItems = (rendering.evidence || []).map((item) => `<li>${item.message}</li>`).join("");

  return /*html*/ `
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>${formatRenderingStrategy(rendering.strategy)}</strong>
        </span>
        <span class="metric ${getConfidenceClass(rendering.confidence)}">
          ${rendering.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<span class="muted">No clear rendering evidence found</span>`}
      </div>
    </div>
  `;
}

function formatRenderingStrategy(strategy) {
  switch (strategy) {
    case "SSR":
      return "Server-side Rendering (SSR)";
    case "SSG":
      return "Static Site Generation (SSG)";
    case "CSR":
      return "Client-side Rendering (CSR)";
    default:
      return "Unknown";
  }
}
