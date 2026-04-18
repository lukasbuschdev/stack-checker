import { getScoreClass } from "../utils/helpers";

export function renderFullSummary(summary) {
  const { loadingPerformanceScore, interactionPerformanceScore, seoScore, overallScore, topIssues } = summary;

  const levelPriority = {
    critical: 2,
    warning: 1,
  };

  const sortedIssues = (topIssues || []).sort((a, b) => levelPriority[b.level] - levelPriority[a.level]).slice(0, 3);

  const issuesList = sortedIssues
    .map(
      (issue) => /*html*/ `
        <li>
          <span class="${issue.level}">[${issue.source}]</span>
          ${issue.message}
        </li>
      `,
    )
    .join("");

  return /*html*/ `
    <div class="result-section"><strong>Summary</strong></div>

    <div class="result-card summary column gap-20">
      <div class="summary-score">
        <strong>Overall Score</strong>
        <div class="row gap-5">
          <span class="score ${getScoreClass(overallScore)}">${overallScore ?? "N/A"}</span>
          <span class="white">/ 100</span>
        </div>
      </div>

      <div class="summary-breakdown">
        <div class="row">
          <span class="muted">Loading Performance</span>
          <div class="row gap-5">
            <span class="score ${getScoreClass(loadingPerformanceScore)}">
              ${loadingPerformanceScore ?? "N/A"}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">Interaction Performance</span>
          <div class="row gap-5">
            <span class="score ${getScoreClass(interactionPerformanceScore)}">
              ${interactionPerformanceScore ?? "N/A"}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">SEO</span>
          <div class="row gap-5">
            <span class="score ${getScoreClass(seoScore)}">
              ${seoScore ?? "N/A"}
            </span>
            <span>/ 100</span>
          </div>
        </div>
      </div>

      ${
        issuesList
          ? /*html*/ `
        <div class="insights column gap-10">
          <span class="block-title mt-15"><strong>Top Issues</strong></span>
          <ul>${issuesList}</ul>
        </div>
      `
          : ""
      }
    </div>
  `;
}
