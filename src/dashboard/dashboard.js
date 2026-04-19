import { renderCDN } from "../templates/cdn";
import { renderInteraction } from "../templates/interaction-performance";
import { renderLoading } from "../templates/loading-performance";
import { renderPrimary, renderPrimaryFallback } from "../templates/primary-technologies";
import { renderRenderingStrategy } from "../templates/rendering";
import { renderSecondary, renderSecondaryFallback } from "../templates/secondary-technologies";
import { renderSEO } from "../templates/seo";
import { renderFullSummary } from "../templates/summary-full";
import { renderFallback } from "../templates/technology-fallback";
import { initAutoRefresh } from "../utils/helpers";
import { processTechnologyData } from "../utils/technology-processing";
import { renderAccessibility } from "../templates/accessibility";

const container = document.getElementById("dashboard-results");
const urlParams = new URLSearchParams(window.location.search);
const tabId = urlParams.get("tabId");

if (!tabId) {
  container.innerHTML = "<span>No data available</span>";
} else {
  chrome.storage.local.get(`stackResults_${tabId}`, (data) => {
    renderDashboard(data[`stackResults_${tabId}`] || {});
    initAutoRefresh(tabId, renderDashboard);
  });
}

function renderDashboard(data) {
  const { primary, secondary, rendering, cdn, performance, seo, accessibility, summary } = data || {};
  const { categoryInsights } = processTechnologyData(primary || null, secondary || []);
  const loading = performance?.loading || null;
  const interaction = performance?.interaction || null;

  let html = "";

  if (summary) html += renderFullSummary(summary);
  if (loading) html += renderLoading(loading);
  if (interaction) html += renderInteraction(interaction);
  if (seo && seo.data) html += renderSEO(seo);
  if (accessibility) html += renderAccessibility(accessibility);
  if (primary) {
    html += renderPrimary(primary, categoryInsights);
  } else {
    html += renderPrimaryFallback();
  }

  if (secondary && secondary.length) {
    html += /*html*/ `
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${secondary.map(renderSecondary).join("")}
      `;
  } else if (secondary) {
    html += /*html*/ `
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${renderSecondaryFallback()}
      `;
  }

  if (rendering) html += renderRenderingStrategy(rendering);
  if (cdn) html += renderCDN(cdn);
  if (!html) html = renderFallback();

  container.innerHTML = html;
}
