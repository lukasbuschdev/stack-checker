export function buildPerformanceInsightGroup(title, items, className) {
  if (!items || !items.length) return "";

  return /*html*/ `
    <div class="insight-group ${className}">
      <strong>${title}</strong>
      <ul>
        ${items.map((msg) => `<li>${msg}</li>`).join("")}
      </ul>
    </div>
  `;
}

export function truncateUrl(str, max = 40) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export function getScoreClass(score) {
  if (score == null) return "";
  if (score >= 85) return "good";
  if (score >= 60) return "warning";
  return "critical";
}

export function getConfidenceClass(confidence) {
  if (confidence >= 85) return "good";
  if (confidence >= 60) return "warning";
  return "critical";
}

export function initAutoRefresh(tabId, renderFn) {
  let count = 0;

  const intervalId = setInterval(() => {
    chrome.storage.local.get(`stackResults_${tabId}`, (data) => {
      renderFn(data[`stackResults_${tabId}`] || {});
    });

    count++;
    if (count >= 5) clearInterval(intervalId);
  }, 1000);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    const key = `stackResults_${tabId}`;
    if (changes[key]) {
      renderFn(changes[key].newValue || {});
    }
  });
}

export function formatType(type) {
  switch (type) {
    case "framework":
      return "Framework";
    case "library":
      return "Library";
    case "cms":
      return "CMS";
    default:
      return "Other";
  }
}
