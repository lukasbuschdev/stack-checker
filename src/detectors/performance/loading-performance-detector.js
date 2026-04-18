import { calculateLoadingPerformanceScore } from "../../scoring/calculations";

let metrics = {
  lcp: null,
  cls: 0,
};

let pageDataImageMetrics = null;
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
          raw: size,
        };
      }
    });

    const imageFiles = resources.filter((r) => r.initiatorType === "img" || /\.(png|jpg|jpeg|webp|avif|gif|svg)$/i.test(r.name));

    let totalImageSize = 0;
    let largestImage = null;
    let largeImages = [];

    imageFiles.forEach((r) => {
      const size = r.transferSize || r.encodedBodySize || 0;
      totalImageSize += size;

      if (size > 200 * 1024) {
        largeImages.push({ name: r.name, size });
      }

      if (!largestImage || size > largestImage.size) {
        largestImage = {
          name: r.name,
          size,
        };
      }
    });

    pageDataImageMetrics = {
      totalImageSize,
      largestImage,
      largeImages,
      imageCount: imageFiles.length,
    };
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
      cls: metrics.cls != null ? { raw: metrics.cls } : null,
    },
    bundleAnalysis: {
      totalJSSize: { raw: totalJSSize },
      jsFileCount,
      imageMetrics: pageDataImageMetrics,
    },
    renderBlocking: {
      blockingCSS: blockingCSSCount,
      syncScriptsInHead: syncScriptCount,
    },
  });

  const score = calculateLoadingPerformanceScore({
    lcp: metrics.lcp,
    cls: metrics.cls,
    jsSize: totalJSSize,
    blockingCSS: blockingCSSCount,
    syncScripts: syncScriptCount,
    totalImageSize: pageDataImageMetrics?.totalImageSize,
    largestImageSize: pageDataImageMetrics?.largestImage?.size,
    imageCount: pageDataImageMetrics?.imageCount,
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
        imageMetrics: pageDataImageMetrics,
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
  const largestScript = bundleAnalysis?.largestScript;
  const blockingCSS = renderBlocking?.blockingCSS;
  const syncScripts = renderBlocking?.syncScriptsInHead;
  const imageMetrics = bundleAnalysis?.imageMetrics;
  const totalImageSize = imageMetrics?.totalImageSize;
  const largestImage = imageMetrics?.largestImage;
  const largeImages = imageMetrics?.largeImages;
  const imageCount = imageMetrics?.imageCount;

  const source = "Loading";

  if (lcp != null) {
    if (lcp < 1800) {
      insights.push({ level: "good", message: "Fast Largest Contentful Paint. The main content becomes visible quickly, which improves perceived loading speed and user engagement.", source });
    } else if (lcp < 3000) {
      insights.push({
        level: "warning",
        message: "LCP is slightly delayed. The main content takes noticeable time to appear. Optimize largest images, reduce server response time, and avoid blocking JavaScript during initial load.",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "Slow LCP detected. The main content appears too late. Prioritize optimizing large images, reduce JavaScript execution on load, use a CDN, and improve server response time.",
        source,
      });
    }
  }

  if (cls != null) {
    if (cls < 0.1) {
      insights.push({ level: "good", message: "Layout is stable. Elements do not shift during loading, providing a smooth visual experience.", source });
    } else if (cls < 0.25) {
      insights.push({
        level: "warning",
        message: "Layout shifts detected. Elements move during loading. Reserve space for images, ads, and dynamic content using fixed dimensions or aspect ratios.",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "High layout instability. Content shifts significantly during load. Always define width and height for media and avoid injecting content above existing elements.",
        source,
      });
    }
  }

  if (jsSize != null) {
    if (jsSize < 150 * 1024) {
      insights.push({ level: "good", message: "Small JavaScript bundle. Minimal script size reduces parsing and execution time, improving load performance.", source });
    } else if (jsSize < 400 * 1024) {
      insights.push({
        level: "warning",
        message: "Moderate JavaScript size. This may delay interactivity. Split code by route or feature and lazy load non-critical modules.",
        source,
      });
    } else {
      insights.push({
        level: "critical",
        message: "Large JavaScript bundle detected. This increases load and execution time. Use code splitting, remove unused dependencies, and defer non-critical scripts.",
        source,
      });
    }
  }

  if (jsCount > 20) {
    insights.push({
      level: "warning",
      message: "Many JavaScript files detected. Excessive script requests increase network overhead. Consider bundling smaller files or using HTTP/2 efficiently.",
      source,
    });
  }

  if (blockingCSS > 0) {
    insights.push({
      level: "warning",
      message: "Render-blocking CSS detected. Stylesheets delay page rendering. Inline critical CSS for above-the-fold content and defer non-essential styles.",
      source,
    });
  }

  if (syncScripts > 0) {
    insights.push({
      level: "critical",
      message: "Synchronous scripts in <head> block rendering. These scripts pause HTML parsing. Add 'defer' or 'async' to prevent blocking initial page load.",
      source,
    });
  }

  if (lcp != null && cls != null && lcp < 2500 && cls < 0.1 && jsSize < 150 * 1024) {
    insights.push({ level: "good", message: "Strong loading performance. Fast rendering, stable layout, and small bundles indicate an optimized loading strategy.", source });
  }

  if (largestScript && largestScript.raw > 200 * 1024) {
    insights.push({
      level: "warning",
      message: `Large script detected (${largestScript.size}). Consider splitting or deferring this file to reduce initial load time.`,
      source,
    });
  }

  if (totalImageSize > 2 * 1024 * 1024) {
    insights.push({
      level: "critical",
      message: `High total image weight (${formatBytes(totalImageSize)}). Compress images and use modern formats like WebP or AVIF.`,
      source,
    });
  } else if (totalImageSize > 800 * 1024) {
    insights.push({
      level: "warning",
      message: `Moderate image weight (${formatBytes(totalImageSize)}). Optimize large images and avoid oversized assets.`,
      source,
    });
  }

  if (largestImage && largestImage.size > 300 * 1024) {
    insights.push({
      level: "warning",
      message: `Large image detected (${formatBytes(largestImage.size)}). Resize and compress this asset to improve load time.`,
      source,
    });
  }

  if (largeImages && largeImages.length > 5) {
    insights.push({
      level: "warning",
      message: `Multiple large images detected (${largeImages.length}). Consider resizing or lazy loading offscreen images.`,
      source,
    });
  }

  if (imageCount > 50) {
    insights.push({
      level: "warning",
      message: `Large number of images detected (${imageCount}). Many requests can slow down loading. Use lazy loading and reduce unnecessary images.`,
      source,
    });
  } else if (imageCount > 20) {
    insights.push({
      level: "warning",
      message: `Moderate number of images (${imageCount}). Ensure offscreen images are lazy loaded to avoid unnecessary network usage.`,
      source,
    });
  }

  if (imageCount > 30 && totalImageSize > 1.5 * 1024 * 1024) {
    insights.push({
      level: "critical",
      message: `High number of images (${imageCount}) combined with large total size (${formatBytes(totalImageSize)}). This significantly impacts loading performance.`,
      source,
    });
  }

  return insights;
}
