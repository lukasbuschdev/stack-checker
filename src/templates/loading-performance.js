import { buildPerformanceInsightGroup, truncateUrl } from "../utils/helpers";

export function renderLoading(loading) {
  const { coreWebVitals, bundleAnalysis, renderBlocking } = loading.data;
  const imageMetrics = bundleAnalysis?.imageMetrics;

  const lcp = coreWebVitals?.lcp ? metricRow("LCP", coreWebVitals.lcp.value, getLcpClass(coreWebVitals.lcp.raw), `(${coreWebVitals.lcp.rating})`) : metricRow("LCP", "analyzing...", "", "", true);
  const cls = coreWebVitals?.cls ? metricRow("CLS", coreWebVitals.cls.value, getClsClass(coreWebVitals.cls.raw), `(${coreWebVitals.cls.rating})`) : metricRow("CLS", "analyzing...", "", "", true);
  const totalJS = bundleAnalysis?.totalJSSize ? metricRow("Total JS size", bundleAnalysis.totalJSSize.value, getJsSizeClass(bundleAnalysis.totalJSSize.raw)) : metricRow("Total JS size", "not available", "", "", true);
  const jsCount = bundleAnalysis?.jsFileCount !== undefined ? metricRow("JS files", bundleAnalysis.jsFileCount, getJsCountClass(bundleAnalysis.jsFileCount)) : metricRow("JS files", "not available", "", "", true);
  const largestScript = bundleAnalysis?.largestScript ? metricRow("Largest script", `${truncateUrl(basename(bundleAnalysis?.largestScript?.name))} (${bundleAnalysis.largestScript.size})`) : metricRow("Largest script", "not available", "", "", true);
  const blockingCSS = renderBlocking ? metricRow("Blocking CSS", renderBlocking.blockingCSS, getBlockingCssClass(renderBlocking.blockingCSS)) : metricRow("Blocking CSS", "not available", "", "", true);
  const syncScripts = renderBlocking ? metricRow("Sync scripts in head", renderBlocking.syncScriptsInHead, getSyncScriptClass(renderBlocking.syncScriptsInHead)) : metricRow("Sync scripts", "not available", "", "", true);
  const totalImages = imageMetrics?.imageCount !== undefined ? metricRow("Images", imageMetrics.imageCount, getImageCountClass(imageMetrics.imageCount)) : metricRow("Images", "not available", "", "", true);
  const totalImageSize = imageMetrics?.totalImageSize ? metricRow("Total image size", formatBytes(imageMetrics.totalImageSize), getImageSizeClass(imageMetrics.totalImageSize)) : metricRow("Total image size", "not available", "", "", true);
  const largestImage = imageMetrics?.largestImage
    ? metricRow("Largest image", `${truncateUrl(basename(imageMetrics.largestImage.name))} (${formatBytes(imageMetrics.largestImage.size)})`, getLargestImageClass(imageMetrics.largestImage.size))
    : metricRow("Largest image", "not available", "", "", true);

  const groupedInsights = { critical: [], warning: [], good: [] };

  (loading.insights || []).forEach((item) => {
    if (groupedInsights[item.level]) {
      groupedInsights[item.level].push(item.message);
    }
  });

  const insightsItems = `
    ${buildPerformanceInsightGroup("Critical Issues", groupedInsights.critical, "critical")}
    ${buildPerformanceInsightGroup("Warnings", groupedInsights.warning, "warning")}
    ${buildPerformanceInsightGroup("Good Signals", groupedInsights.good, "good")}
  `;

  return /*html*/ `
    <div class="result-section"><strong>Loading Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Core Web Vitals</span>
        ${lcp}
        ${cls}
      </div>

      <div class="metric-block">
        <span class="block-title">JavaScript Analysis</span>
        ${totalJS}
        ${jsCount}
        ${largestScript}
      </div>

      <div class="metric-block">
        <span class="block-title">Render Blocking</span>
        ${blockingCSS}
        ${syncScripts}
      </div>

      <div class="metric-block">
        <span class="block-title">Image Analysis</span>
        ${totalImages}
        ${totalImageSize}
        ${largestImage}
      </div>

      ${
        insightsItems.trim()
          ? /*html*/ `
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${insightsItems}
          </div>
        `
          : ""
      }
    </div>
  `;
}

function metricRow(label, value, valueClass = "", suffix = "", muted = false) {
  return /*html*/ `
    <div class="metric-row">
      <span class="${muted ? "muted" : ""}">${label}</span>
      <span class="${muted ? "muted" : `metric ${valueClass}`}">
        ${value} ${suffix || ""}
      </span>
    </div>
  `;
}

function getLcpClass(ms) {
  if (ms == null) return "";

  const seconds = ms / 1000;

  if (seconds <= 1.8) return "good";
  if (seconds <= 3) return "warning";
  return "critical";
}

function getClsClass(value) {
  if (value == null) return "";

  if (value <= 0.1) return "good";
  if (value <= 0.25) return "warning";
  return "critical";
}

function getJsSizeClass(bytes) {
  if (bytes == null) return "";

  const kb = bytes / 1024;

  if (kb < 150) return "good";
  if (kb < 400) return "warning";
  return "critical";
}

function getJsCountClass(count) {
  if (count < 10) return "good";
  if (count < 25) return "warning";
  return "critical";
}

function getBlockingCssClass(count) {
  if (count === 0) return "good";
  if (count <= 2) return "warning";
  return "critical";
}

function getSyncScriptClass(count) {
  if (count === 0) return "good";
  if (count <= 2) return "warning";
  return "critical";
}

function getImageSizeClass(bytes) {
  if (bytes == null) return "";

  const kb = bytes / 1024;

  if (kb < 800) return "good";
  if (kb < 1500) return "warning";
  return "critical";
}

function getLargestImageClass(bytes) {
  if (bytes == null) return "";

  const kb = bytes / 1024;

  if (kb < 200) return "good";
  if (kb < 400) return "warning";
  return "critical";
}

function getImageCountClass(count) {
  if (count < 20) return "good";
  if (count < 50) return "warning";
  return "critical";
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function basename(url) {
  try {
    return url.split("/").pop().split("?")[0];
  } catch {
    return url;
  }
}
