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

  return /*html*/ `
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Structure</span>
        ${metricRow("Title", title ? truncateUrl(title, 50) : "missing", !title)}
        ${metricRow("Description", description ? truncateUrl(description, 70) : "missing", !description)}
        ${metricRow("Lang", lang ?? "missing", !lang)}
        ${metricRow("Canonical", canonical ? "set" : "missing", !canonical)}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>
        ${metricRow("H1", headings?.h1 ?? 0)}
        ${metricRow("H2", headings?.h2 ?? 0)}
        ${metricRow("Images", `${images?.total ?? 0} (${images?.missingAlt ?? 0} missing alt)`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>
        ${metricRow("Viewport", meta?.viewport ? "set" : "missing", !meta?.viewport)}
        ${metricRow("Open Graph", meta?.openGraph ?? 0)}
        ${metricRow("Twitter", meta?.twitter ?? 0)}
        ${metricRow("Robots", meta?.robots || "index", meta?.robots?.includes("noindex"))}
        ${metricRow("Structured Data", meta?.structuredData ?? 0, (meta?.structuredData ?? 0) === 0)}
      </div>

      <div class="metric-block">
        <span class="block-title">Linking</span>
        ${metricRow("Internal Links", seo.data.links?.internal ?? 0)}
        ${metricRow("External Links", seo.data.links?.external ?? 0, (seo.data.links?.external ?? 0) === 0)}
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

function metricRow(label, value, isBad = false) {
  return /*html*/ `
    <div class="metric-row">
      <span>${label}</span>
      <span class="metric ${isBad ? "warning" : "good"}">
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
