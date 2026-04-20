import { renderCDN } from "../templates/cdn";
import { renderInteraction } from "../templates/interaction-performance";
import { renderLoading } from "../templates/loading-performance";
import { renderPrimary, renderPrimaryFallback } from "../templates/primary-technologies";
import { renderRenderingStrategy, renderRenderingStrategyFallback } from "../templates/rendering";
import { renderSecondary, renderSecondaryFallback } from "../templates/secondary-technologies";
import { renderSEO } from "../templates/seo";
import { renderFullSummary } from "../templates/summary-full";
import { renderFallback } from "../templates/technology-fallback";
import { processTechnologyData } from "../utils/technology-processing";
import { renderAccessibility } from "../templates/accessibility";

const container = document.getElementById("dashboard-results");
const urlParams = new URLSearchParams(window.location.search);
const tabId = urlParams.get("tabId");

const MAX_WAIT_MS = 7000;
const POLL_INTERVAL_MS = 250;

if (!tabId) {
  container.innerHTML = "<span>No data available</span>";
} else {
  initDashboard();
}

async function initDashboard() {
  renderLoadingState();
  const finalData = await waitForFinalResults(tabId);
  renderDashboard(finalData || {});
}

function waitForFinalResults(tabId) {
  return new Promise((resolve) => {
    const storageKey = `stackResults_${tabId}`;
    const startedAt = Date.now();
    let latestData = null;

    const intervalId = setInterval(() => {
      chrome.storage.local.get(storageKey, (data) => {
        const result = data[storageKey];

        if (result) {
          latestData = result;
        }

        const isFinal = result?.meta?.isFinal === true;
        const timedOut = Date.now() - startedAt >= MAX_WAIT_MS;

        if (isFinal || timedOut) {
          clearInterval(intervalId);
          resolve(latestData);
        }
      });
    }, POLL_INTERVAL_MS);
  });
}

function renderLoadingState() {
  container.innerHTML = /*html*/ `
    <div class="result-section loading-state">
      <div class="loading-title">Analyzing page...</div>
      <div class="loading-text">Waiting for stable results</div>
    </div>
  `;
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

  if (rendering) {
    html += renderRenderingStrategy(rendering);
  } else {
    html += renderRenderingStrategyFallback();
  }

  if (cdn) html += renderCDN(cdn);
  if (!html) html = renderFallback();

  container.innerHTML = html;
}
