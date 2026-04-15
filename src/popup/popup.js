const resultsContainer = document.getElementById("results");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    renderResults({});
    return;
  }

  chrome.storage.local.get(`stackResults_${activeTab.id}`, (data) => {
    renderResults(data[`stackResults_${activeTab.id}`] || {});
  });
});

function renderResults(data) {
  const { primary, secondary } = data || {};
  let html = "";
  const detectedTypes = [];

  if (primary) detectedTypes.push(primary.type);
  if (secondary && secondary.length > 0) {
    secondary.forEach((r) => detectedTypes.push(r.type));
  }

  const hasFramework = detectedTypes.includes("framework");
  const hasCMS = detectedTypes.includes("cms");
  const hasLibrary = detectedTypes.includes("library");

  const categoryInsights = buildCategoryInsights({
    hasFramework,
    hasCMS,
    hasLibrary,
  });

  if (primary) {
    const evidenceItems = (primary.evidence || []).map((item) => `<li>${item.message}</li>`).join("");
    const baseInsights = primary.insights || [];
    const allInsights = [...baseInsights, ...categoryInsights];
    const insightsItems = allInsights.map((item) => `<li>${item}</li>`).join("");

    html += `<div class="result-section"><strong>Primary Technologies</strong></div>`;
    html += `
      <div class="result-card primary">
        <div class="result-header">
          <strong>[${formatType(primary.type)}] ${primary.name}</strong>
          <span>${primary.confidence}%</span>
        </div>

        <div class="result-main">
          ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<p class="muted">No direct evidence found</p>`}

          ${
            insightsItems
              ? `
              <div class="insights">
                <strong>Analysis</strong>
                <ul>${insightsItems}</ul>
              </div>
            `
              : ""
          }
        </div>
      </div>
    `;
  }

  if (secondary && secondary.length > 0) {
    html += `<div class="result-section"><strong>Secondary Technologies</strong></div>`;
    html += secondary
      .map((result) => {
        const evidenceItems = (result.evidence || []).map((item) => `<li>${item.message}</li>`).join("");
        const insightsItems = (result.insights || []).map((item) => `<li>${item}</li>`).join("");

        return `
          <div class="result-card">
            <div class="result-header">
              <strong>[${formatType(result.type)}] ${result.name}</strong>
              <span>${result.confidence}%</span>
            </div>

            ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<p class="muted">No direct evidence found</p>`}

            ${
              insightsItems
                ? `
                <div class="insights">
                  <strong>Analysis</strong>
                  <ul>${insightsItems}</ul>
                </div>
              `
                : ""
            }
          </div>
        `;
      })
      .join("");
  }

  if (!html) {
    html = `
      <div class="result-card">
        <div class="result-header">
          <strong>Analysis</strong>
        </div>
        <p class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </p>
      </div>
    `;
  }

  resultsContainer.innerHTML = html;
}

function formatType(type) {
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

function buildCategoryInsights({ hasFramework, hasCMS, hasLibrary }) {
  const insights = [];

  if (!hasFramework && !hasCMS) {
    insights.push("No framework or CMS detected");
  } else {
    if (!hasFramework) {
      insights.push("No frontend framework detected");
    }

    if (!hasCMS) {
      insights.push("No CMS detected");
    }
  }

  if (!hasLibrary && !hasFramework && !hasCMS) {
    insights.push("No major frontend libraries detected");
  }

  return insights;
}
