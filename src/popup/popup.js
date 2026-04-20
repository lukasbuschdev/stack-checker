import { renderSummary } from "../templates/summary-popup";
import { renderFallback } from "../templates/technology-fallback";

const resultsContainer = document.getElementById("results");

const MAX_WAIT_MS = 7000;
const POLL_INTERVAL_MS = 250;

initPopup();

function initPopup() {
  renderLoading();

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];

    if (!activeTab?.id) {
      renderResults({});
      return;
    }

    const finalData = await waitForFinalResults(activeTab.id);
    renderResults(finalData || {});
  });
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

function renderLoading() {
  resultsContainer.innerHTML = /*html*/ `
    <div class="result-section loading-state">
      <div class="loading-title">Analyzing page...</div>
      <div class="loading-text">Waiting for stable results</div>
    </div>
  `;
}

function renderResults(data) {
  const { summary } = data || {};
  const enhancedSummary = {
    ...summary,
    primaryDetected: !!data.primary,
  };

  let html = "";

  if (summary) html += renderSummary(enhancedSummary);
  if (!html) html = renderFallback();

  resultsContainer.innerHTML = html;
  attachDashboardHandler();
}

function attachDashboardHandler() {
  const btn = document.getElementById("open-dashboard-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (!activeTab?.id) return;

      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/dashboard/dashboard.html?tabId=${activeTab.id}`),
      });
    });
  });
}
