const resultsContainer = document.getElementById("results");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    renderResults([]);
    return;
  }

  chrome.storage.local.get(`stackResults_${activeTab.id}`, (data) => {
    renderResults(data[`stackResults_${activeTab.id}`] || []);
  });
});

function renderResults(results) {
  const detectedResults = results.filter((result) => result.detected).sort((a, b) => b.confidence - a.confidence);

  if (detectedResults.length === 0) {
    resultsContainer.innerHTML = "<p>No technologies detected</p>";
    return;
  }

  resultsContainer.innerHTML = detectedResults
    .map((result) => {
      const evidenceItems = result.evidence.map((item) => `<li>${item.message}</li>`).join("");

      return `
        <div class="result-card">
          <div class="result-header">
            <strong>${result.name}</strong>
            <strong>${result.confidence}%</strong>
          </div>
          <ul>
            ${evidenceItems}
          </ul>
        </div>
      `;
    })
    .join("");
}
