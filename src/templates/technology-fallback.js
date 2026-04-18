export function renderFallback() {
  return /*html*/ `
    <div class="result-section"><strong>Analysis</strong></div>
    <div class="result-card column gap-20">
      <div class="metric-block">
        <span class="block-title">Result</span>
        <span class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </span>
      </div>
    </div>
  `;
}
