import { truncateUrl } from "../utils/helpers";

export function renderSEO(seo) {
  const { title, description, canonical, lang, headings, images, meta } = seo.data;

  const groupedInsights = {
    critical: [],
    warning: [],
    good: [],
  };

  (seo.insights || []).forEach((item) => {
    if (groupedInsights[item.level]) {
      groupedInsights[item.level].push(item.message);
    }
  });

  const insightsItems = `
    ${buildSeoInsightGroup("Critical Issues", groupedInsights.critical, "critical")}
    ${buildSeoInsightGroup("Warnings", groupedInsights.warning, "warning")}
    ${buildSeoInsightGroup("Good Signals", groupedInsights.good, "good")}
  `;

  const h1Count = headings?.h1 ?? 0;

  return /*html*/ `
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Structure</span>
        ${metricRow("Title", title ? truncateUrl(title, 50) : "missing", title ? "good" : "critical")}
        ${metricRow("Description", description ? truncateUrl(description, 70) : "missing", description ? "good" : "critical")}
        ${metricRow("Lang", lang ?? "missing", lang ? "good" : "warning")}
        ${metricRow("Canonical", canonical ? "set" : "missing", canonical ? "good" : "warning")}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>
        ${metricRow("H1", h1Count, h1Count === 1 ? "good" : h1Count === 0 ? "critical" : "warning")}
        ${metricRow("H2", headings?.h2 ?? 0, "good")}
        ${metricRow("Images", `${images?.total ?? 0} (${images?.missingAlt ?? 0} missing alt)`, (images?.missingAlt ?? 0) > 0 ? "warning" : "good")}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>
        ${metricRow("Viewport", meta?.viewport ? "set" : "missing", meta?.viewport ? "good" : "critical")}
        ${metricRow("Open Graph", meta?.openGraph ?? 0, (meta?.openGraph ?? 0) > 0 ? "good" : "warning")}
        ${metricRow("Twitter", meta?.twitter ?? 0, (meta?.twitter ?? 0) > 0 ? "good" : "warning")}
        ${metricRow("Robots", meta?.robots || "index", meta?.robots?.includes("noindex") ? "critical" : "good")}
        ${metricRow("Structured Data", meta?.structuredData ?? 0, (meta?.structuredData ?? 0) === 0 ? "warning" : "good")}
      </div>

      <div class="metric-block">
        <span class="block-title">Linking</span>
        ${metricRow("Internal Links", seo.data.links?.internal ?? 0, (seo.data.links?.internal ?? 0) < 3 ? "warning" : "good")}
        ${metricRow("External Links", seo.data.links?.external ?? 0, (seo.data.links?.external ?? 0) === 0 ? "warning" : "good")}
      </div>

      ${
        insightsItems.trim()
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title"><strong>SEO Analysis</strong></span>
            ${insightsItems}
          </div>
        `
          : ""
      }
    </div>
  `;
}

function metricRow(label, value, level = "good") {
  return /*html*/ `
    <div class="metric-row">
      <span>${label}</span>
      <span class="metric ${level}">
        ${value}
      </span>
    </div>
  `;
}

function buildSeoInsightGroup(title, items, className) {
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
