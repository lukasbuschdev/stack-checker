import { getScoreClass } from "../utils/helpers";

export function renderSummary(summary) {
  const { loadingPerformanceScore, interactionPerformanceScore, seoScore, accessibilityScore, overallScore, totalIssueCounts, primaryDetected } = summary;

  const counts = {
    critical: totalIssueCounts?.critical ?? 0,
    warning: totalIssueCounts?.warning ?? 0,
  };

  return /*html*/ `
    <div class="result-section"><strong>Quick Overview</strong></div>
    <div class="result-card column gap-20 summary">
      <div class="summary-score">
        <div class="row gap-10 align-center">
          <span class="block-title"><strong>Overall Score</strong></span>
          <span class="info-tooltip">
            ⓘ
            <span class="tooltip-content">
              Overall score based on weighted metrics.
              <br><br>
              <ul>
                <li>Loading (50%)</li>
                <li>Interaction (25%)</li>
                <li>SEO (15%)</li>
                <li>Accessibility (10%)</li>
              </ul>
              <br><br>
              Prioritizes real user experience over technical completeness.
            </span>
          </span>
        </div>
        <span class="score ${getScoreClass(overallScore)}">
          ${overallScore ?? "N/A"}
        </span>
      </div>

      <div class="summary-mini row gap-10">
        ${miniMetric("Loading", loadingPerformanceScore)}
        ${miniMetric("UX", interactionPerformanceScore)}
        ${miniMetric("SEO", seoScore)}
        ${miniMetric("Accessibility", accessibilityScore)}
      </div>

      <div class="insights column gap-10">
        <span class="block-title mt-15"><strong>Analysis</strong></span>
        <div class="summary-status column gap-5">
          ${counts.critical > 0 ? `<span class="critical">${counts.critical} critical issue${counts.critical > 1 ? "s" : ""}</span>` : `<span class="good">✓ No critical issues</span>`}
          ${counts.warning > 0 ? `<span class="warning">${counts.warning} warning${counts.warning > 1 ? "s" : ""}</span>` : `<span class="good">No warnings</span>`}
          ${primaryDetected ? `<span class="good">Primary technology detected</span>` : `<span class="warning">No primary technology detected</span>`}
        </div>
      </div>

      <div class="summary-cta" id="open-dashboard-btn">
        <span class="muted">View full analysis →</span>
      </div>
    </div>
  `;
}

function miniMetric(label, value) {
  return /*html*/ `
    <div class="mini-metric column gap-10">
      <span class="muted">${label}</span>
      <span class="score ${getScoreClass(value)}">
        ${value ?? "N/A"}
      </span>
    </div>
  `;
}
