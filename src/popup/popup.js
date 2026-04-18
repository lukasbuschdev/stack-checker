import { renderSummary } from "../templates/summary-popup";
import { renderFallback } from "../templates/technology-fallback";
import { initAutoRefresh } from "../utils/helpers";

const resultsContainer = document.getElementById("results");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    renderResults({});
    return;
  }

  chrome.storage.local.get(`stackResults_${activeTab.id}`, (data) => {
    renderResults(data[`stackResults_${activeTab.id}`] || {});
    initAutoRefresh(activeTab.id, renderResults);
  });
});

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
