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
  const { primary, secondary, rendering, cdn } = data || {};
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
      <div class="result-card primary column gap-20">
        <div class="result-header">
          <strong>[${formatType(primary.type)}] ${primary.name}</strong>
          <strong>${primary.confidence}%</strong>
        </div>

        <div class="column gap-20">
          ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<p class="muted">No direct evidence found</p>`}

          ${
            insightsItems
              ? `
              <div class="insights column gap-20">
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
          <div class="result-card column gap-20">
            <div class="result-header">
              <strong>[${formatType(result.type)}] ${result.name}</strong>
              <strong>${result.confidence}%</strong>
            </div>

            ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<p class="muted">No direct evidence found</p>`}

            ${
              insightsItems
                ? `
                <div class="insights column gap-20">
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
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>Analysis</strong>
        </div>
        <span class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </span>
      </div>
    `;
  }

  if (rendering) {
    const evidenceItems = (rendering.evidence || []).map((item) => `<li>${item.message}</li>`).join("");

    html += `<div class="result-section"><strong>Rendering Strategy</strong></div>`;
    html += `
    <div class="result-card column gap-20">
      <div class="result-header">
        <strong>${formatRenderingStrategy(rendering.strategy)}</strong>
        <strong>${rendering.confidence}%</strong>
      </div>

      ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<span class="muted">No clear rendering evidence found</span>`}
    </div>
  `;
  }

  if (cdn) {
    const evidenceItems = (cdn.evidence || []).map((item) => `<li>${item.message}</li>`).join("");
    const edge = cdn.edge ? `<span><strong>Edge:</strong> ${cdn.edge}</span>` : "";
    const assets = cdn.assets && cdn.assets.length > 0 ? `<span><strong>Assets:</strong> ${cdn.assets.join(", ")}</span>` : "";
    const source = cdn.source === "headers" ? `<span><strong>Detected via:</strong> server headers</span>` : `<span><strong>Detected via:</strong> resource analysis</span>`;
    const platform = cdn.platform ? `<span><strong>Platform:</strong> ${cdn.platform}</span>` : "";

    html += `<div class="result-section"><strong>Delivery & Hosting</strong></div>`;

    html += `
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>${cdn.edge || cdn.platform || (cdn.assets.length > 0 ? "Asset CDN detected" : "No CDN detected")}</strong>
          <strong>${cdn.confidence}%</strong>
        </div>

        <div class="column gap-20">
          ${source}
          ${edge}
          ${platform}
          ${assets}
        </div>

        ${evidenceItems ? `<ul>${evidenceItems}</ul>` : `<span class="muted">No clear CDN evidence found</span>`}
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

function formatRenderingStrategy(strategy) {
  switch (strategy) {
    case "SSR":
      return "Server-side Rendering (SSR)";
    case "SSG":
      return "Static Site Generation (SSG)";
    case "CSR":
      return "Client-side Rendering (CSR)";
    default:
      return "Unknown";
  }
}
