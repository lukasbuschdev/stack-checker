import { getConfidenceClass } from "../utils/helpers";

export function renderCDN(cdn) {
  const evidenceItems = (cdn.evidence || []).map((item) => `<li>${item.message}</li>`).join("");
  const title = cdn.edge || cdn.platform || (cdn.assets && cdn.assets.length > 0 ? "Asset CDN detected" : "No CDN detected");
  const source = cdn.source === "headers" ? "server headers" : "resource analysis";

  return /*html*/ `
    <div class="result-section"><strong>Delivery & Hosting</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span><strong>${title}</strong></span>
        <span class="metric ${getConfidenceClass(cdn.confidence)}">
          ${cdn.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Details</span>

        ${metricRow("Detected via", source)}
        ${cdn.edge ? metricRow("Edge", cdn.edge) : ""}
        ${cdn.platform ? metricRow("Platform", cdn.platform) : ""}
        ${cdn.assets && cdn.assets.length > 0 ? metricRow("Assets", cdn.assets.join(", ")) : ""}

      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<span class="muted">No clear CDN evidence found</span>`}
      </div>
    </div>
  `;
}

function metricRow(label, value) {
  return /*html*/ `
    <div class="metric-row">
      <span>${label}</span>
      <span class="white">${value}</span>
    </div>
  `;
}
