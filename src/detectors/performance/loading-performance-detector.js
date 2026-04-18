let metrics = {
  lcp: null,
  cls: 0,
  inp: null,
};

let observersInitialized = false;

export function detectLoadingPerformance() {
  initObservers();

  const evidence = [];

  let totalJSSize = 0;
  let jsFileCount = 0;
  let largestScript = null;

  try {
    const resources = performance.getEntriesByType("resource");
    const jsFiles = resources.filter((r) => r.initiatorType === "script" || (typeof r.name === "string" && r.name.endsWith(".js")));

    jsFileCount = jsFiles.length;

    jsFiles.forEach((r) => {
      const size = r.transferSize || r.encodedBodySize || 0;
      totalJSSize += size;

      if (!largestScript || size > largestScript.size) {
        largestScript = {
          name: r.name,
          size,
        };
      }
    });
  } catch (err) {
    evidence.push({
      type: "weak",
      message: "Resource timing not available",
    });
  }

  let blockingCSSCount = 0;
  let syncScriptCount = 0;

  try {
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    blockingCSSCount = cssLinks.filter((link) => !link.media || link.media === "all").length;

    const syncScripts = Array.from(document.querySelectorAll("head script:not([async]):not([defer])"));
    syncScriptCount = syncScripts.length;
  } catch (err) {
    evidence.push({
      type: "weak",
      message: "DOM analysis for render blocking failed",
    });
  }

  const insights = buildPerformanceInsights({
    coreWebVitals: {
      lcp: metrics.lcp != null ? { raw: metrics.lcp } : null,
      cls: metrics.cls > 0 ? { raw: metrics.cls } : null,
    },
    bundleAnalysis: {
      totalJSSize: { raw: totalJSSize },
      jsFileCount,
    },
    renderBlocking: {
      blockingCSS: blockingCSSCount,
      syncScriptsInHead: syncScriptCount,
    },
  });

  const score = calculatePerformanceScore({
    lcp: metrics.lcp,
    cls: metrics.cls,
    jsSize: totalJSSize,
    blockingCSS: blockingCSSCount,
    syncScripts: syncScriptCount,
  });

  return {
    name: "Loading Performance",
    type: "loading-performance",
    detected: true,
    score: score,

    data: {
      coreWebVitals: {
        lcp:
          metrics.lcp != null
            ? {
                value: formatTime(metrics.lcp),
                raw: metrics.lcp,
                rating: rateLCP(metrics.lcp),
              }
            : null,

        cls:
          metrics.cls > 0
            ? {
                value: metrics.cls.toFixed(3),
                raw: metrics.cls,
                rating: rateCLS(metrics.cls),
              }
            : null,
      },

      bundleAnalysis: {
        totalJSSize: {
          value: formatBytes(totalJSSize),
          raw: totalJSSize,
        },
        jsFileCount,

        largestScript: largestScript
          ? {
              name: largestScript.name,
              size: formatBytes(largestScript.size),
              raw: largestScript.size,
            }
          : null,
      },

      renderBlocking: {
        blockingCSS: blockingCSSCount,
        syncScriptsInHead: syncScriptCount,
      },
    },

    insights,
    evidence,
  };
}

function initObservers() {
  if (observersInitialized) return;
  observersInitialized = true;

  try {
    // LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
      }
    });

    lcpObserver.observe({
      type: "largest-contentful-paint",
      buffered: true,
    });

    // CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          metrics.cls += entry.value;
        }
      }
    });

    clsObserver.observe({
      type: "layout-shift",
      buffered: true,
    });
  } catch (err) {
    console.warn("PerformanceObserver not supported", err);
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatTime(ms) {
  if (ms === null || ms === undefined) return null;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function rateLCP(lcp) {
  if (lcp == null) return "unknown";
  if (lcp < 1800) return "good";
  if (lcp < 3000) return "needs improvement";
  return "poor";
}

function rateCLS(cls) {
  if (cls == null) return "unknown";
  if (cls < 0.1) return "good";
  if (cls < 0.25) return "needs improvement";
  return "poor";
}

function buildPerformanceInsights({ coreWebVitals, bundleAnalysis, renderBlocking }) {
  const insights = [];

  const lcp = coreWebVitals?.lcp?.raw;
  const cls = coreWebVitals?.cls?.raw;
  const jsSize = bundleAnalysis?.totalJSSize?.raw;
  const jsCount = bundleAnalysis?.jsFileCount;
  const blockingCSS = renderBlocking?.blockingCSS;
  const syncScripts = renderBlocking?.syncScriptsInHead;

  const source = "Loading";

  if (lcp != null) {
    if (lcp < 1800) {
      insights.push({ level: "good", message: "Fast largest contentful paint", source });
    } else if (lcp < 3000) {
      insights.push({
        level: "warning",
        message: "LCP could be improved. Optimize images, enable lazy loading, or reduce server response time",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "Slow LCP detected. Optimize images, use a CDN, reduce JavaScript execution, and improve server response time",
        source,
      });
    }
  }

  if (cls != null) {
    if (cls < 0.1) {
      insights.push({ level: "good", message: "Stable layout with minimal shifts", source });
    } else if (cls < 0.25) {
      insights.push({
        level: "warning",
        message: "Layout shifts detected. Reserve space for images and avoid inserting content above existing elements",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "High layout shift detected. Define width and height for media and prevent late DOM changes that move content",
        source,
      });
    }
  }

  if (jsSize != null) {
    if (jsSize < 150 * 1024) {
      insights.push({ level: "good", message: "Small JavaScript bundle size", source });
    } else if (jsSize < 400 * 1024) {
      insights.push({
        level: "warning",
        message: "Moderate JS bundle size. Use code splitting and lazy load non-critical modules",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "Large JavaScript bundle detected. Reduce bundle size with code splitting, tree shaking, and removing unused dependencies",
        source,
      });
    }
  }

  if (jsCount > 20) {
    insights.push({
      level: "warning",
      message: "Many JavaScript files detected. Consider bundling or reducing script fragmentation",
      source,
    });
  }

  if (blockingCSS > 0) {
    insights.push({
      level: "warning",
      message: "Blocking CSS detected. Inline critical CSS and defer non-critical styles",
      source,
    });
  }

  if (syncScripts > 0) {
    insights.push({
      level: "critical",
      message: "Synchronous scripts in head block rendering. Use async or defer attributes",
      source,
    });
  }

  if (lcp != null && cls != null && lcp < 2500 && cls < 0.1 && jsSize < 150 * 1024) {
    insights.push({ level: "good", message: "Overall strong performance profile", source });
  }

  return insights;
}

function calculatePerformanceScore({ lcp, cls, jsSize, blockingCSS, syncScripts }) {
  let score = 100;

  if (lcp != null) {
    if (lcp > 4000) score -= 30;
    else if (lcp > 2500) score -= 15;
  }

  if (cls != null) {
    if (cls > 0.25) score -= 25;
    else if (cls > 0.1) score -= 10;
  }

  if (jsSize != null) {
    if (jsSize > 500 * 1024) score -= 20;
    else if (jsSize > 150 * 1024) score -= 10;
  }

  if (blockingCSS > 0) score -= 5;
  if (syncScripts > 0) score -= 10;

  return Math.max(0, score);
}
