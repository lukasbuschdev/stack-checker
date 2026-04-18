import { buildPerformanceInsightGroup } from "../utils/helpers";

const thresholds = {
  animatedCount: { warning: 15, critical: 40 },
  expensiveAnimationCount: { warning: 3, critical: 10 },
  fixedCount: { warning: 5, critical: 10 },
  hoverRules: { warning: 10, critical: 25 },
  boxShadowCount: { warning: 15, critical: 40 },
  filterCount: { warning: 3, critical: 10 },
  backdropFilterCount: { warning: 1, critical: 5 },
  gradientCount: { warning: 20, critical: 50 },
  layoutAnimationCount: { warning: 2, critical: 5 },
};

export function renderInteraction(interaction) {
  const d = interaction.data;

  const metrics = `
    ${metricRow("Animated elements", d.animatedCount, thresholds.animatedCount)}
    ${metricRow("Expensive animations", d.expensiveAnimationCount, thresholds.expensiveAnimationCount)}
    ${metricRow("Fixed elements", d.fixedCount, thresholds.fixedCount)}
    ${metricRow("Hover rules", d.hoverRules, thresholds.hoverRules)}
    ${metricRow("Reduced motion", d.hasReducedMotionSupport ? "supported" : "not supported", null, !d.hasReducedMotionSupport)}
    ${metricRow("Box shadows", d.boxShadowCount, thresholds.boxShadowCount)}
    ${metricRow("Filters", d.filterCount, thresholds.filterCount)}
    ${metricRow("Backdrop filters", d.backdropFilterCount, thresholds.backdropFilterCount)}
    ${metricRow("Gradients", d.gradientCount, thresholds.gradientCount)}
    ${metricRow("GPU-friendly animations", d.gpuFriendlyAnimationCount)}
    ${metricRow("Layout-triggering animations", d.layoutAnimationCount, thresholds.layoutAnimationCount)}
  `;

  const groupedInsights = { critical: [], warning: [], good: [] };

  (interaction.insights || []).forEach((item) => {
    if (groupedInsights[item.level]) {
      groupedInsights[item.level].push(item.message);
    }
  });

  const insightsItems = `
    ${buildPerformanceInsightGroup("Critical Issues", groupedInsights.critical, "critical")}
    ${buildPerformanceInsightGroup("Warnings", groupedInsights.warning, "warning")}
    ${buildPerformanceInsightGroup("Good Signals", groupedInsights.good, "good")}
  `;

  return /*html*/ `
    <div class="result-section"><strong>Interaction Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Motion & Complexity</span>
        ${metrics}
      </div>

      ${
        insightsItems.trim()
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${insightsItems}
          </div>
        `
          : /*html*/ `
          <span class="muted">
            No major interaction or animation issues detected
          </span>
        `
      }
    </div>
  `;
}

function metricRow(label, value, thresholds = null, forceCritical = false) {
  let cls = "";

  if (forceCritical) {
    cls = "critical";
  } else if (thresholds && value != null) {
    if (value >= thresholds.critical) cls = "critical";
    else if (value >= thresholds.warning) cls = "warning";
    else cls = "good";
  } else {
    cls = "white";
  }

  return /*html*/ `
    <div class="metric-row">
      <span>${label}</span>
      <span class="metric ${cls}">${value}</span>
    </div>
  `;
}
