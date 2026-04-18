import { scanDOM } from "./dom-scan.js";
import { scanScripts } from "./script-scan.js";
import { scanGlobals } from "./global-scan.js";
import { scanMeta } from "./meta-scan.js";
import { DETECTORS } from "../detectors/detectors.js";
import { buildFallbackInsights } from "../detectors/fallback/fallback.js";
import { evaluateDetection } from "../scoring/confidence-engine.js";
import { calculateOverallScore } from "../scoring/calculations.js";

const priority = {
  cms: 3,
  framework: 2,
  library: 1,
  other: 0,
};

function runDetection() {
  const pageData = {
    dom: scanDOM(),
    scripts: scanScripts(),
    globals: scanGlobals(),
    meta: scanMeta(),
  };

  const results = DETECTORS.map((detector) => {
    try {
      return detector(pageData);
    } catch (e) {
      return {
        name: detector.name || "Unknown",
        detected: false,
        type: "other",
        error: true,
        evidence: [],
      };
    }
  });

  const renderingResult = results.find((r) => r.type === "rendering") || null;
  let cdnResult = results.find((r) => r.type === "infrastructure") || null;
  const byType = Object.fromEntries(results.map((r) => [r.type, r]));

  const loadingPerformanceResult = byType["loading-performance"] || null;
  const interactionPerformanceResult = byType["interaction-performance"] || null;
  const seoResult = byType["seo"] || null;

  const loadingPerformanceScore = loadingPerformanceResult?.score ?? null;
  const interactionPerformanceScore = interactionPerformanceResult?.score ?? null;
  const seoScore = seoResult?.score ?? null;

  let overallScore = null;

  const scores = {
    loading: loadingPerformanceScore,
    interaction: interactionPerformanceScore,
    seo: seoScore,
  };

  if (scores.loading != null || scores.interaction != null || scores.seo != null) {
    overallScore = calculateOverallScore(scores);
  }

  const levelPriority = {
    critical: 2,
    warning: 1,
  };

  const allIssues = [...(loadingPerformanceResult?.insights || []), ...(interactionPerformanceResult?.insights || []), ...(seoResult?.insights || [])];

  const topIssues = allIssues
    .filter((i) => i.level === "critical" || i.level === "warning")
    .sort((a, b) => levelPriority[b.level] - levelPriority[a.level])
    .slice(0, 3);

  const summary = {
    loadingPerformanceScore,
    interactionPerformanceScore,
    seoScore,
    overallScore,
    topIssues,
  };

  const scoredResults = results.map((result) => {
    if (result.type === "rendering" || result.type === "infrastructure" || result.type === "loading-performance" || result.type === "interaction-performance" || result.type === "seo") {
      return result;
    }

    const evaluation = evaluateDetection(result.evidence);

    return {
      ...result,
      detected: evaluation.detected,
      confidence: evaluation.confidence,
    };
  });

  const finalResults = scoredResults;
  applyFrameworkOverrides(finalResults);

  finalResults.forEach((r) => {
    if (!r.type) r.type = "other";
  });

  const stackResults = finalResults.filter((r) => r.type !== "rendering" && r.type !== "infrastructure" && r.type !== "loading-performance" && r.type !== "interaction-performance" && r.type !== "seo");
  const detected = stackResults.filter((r) => r.detected === true);

  const primary =
    detected.sort((a, b) => {
      const p = priority[b.type] - priority[a.type];
      if (p !== 0) return p;
      return b.confidence - a.confidence;
    })[0] || null;

  const secondary = detected.filter((r) => r !== primary).sort((a, b) => b.confidence - a.confidence);
  const hasMeaningfulDetection = detected.some((r) => r.confidence >= 30);

  let fallback = null;

  if (!hasMeaningfulDetection) {
    fallback = {
      name: "Unknown Stack",
      type: "other",
      detected: true,
      confidence: 0,
      evidence: [
        {
          type: "info",
          message: "No reliable frontend technologies detected",
        },
      ],
      insights: buildFallbackInsights(pageData),
    };
  }

  chrome.runtime.sendMessage({ type: "GET_TAB_ID" }, (response) => {
    const tabId = response?.tabId;

    if (!tabId) {
      sendResults(primary, secondary, renderingResult, cdnResult, loadingPerformanceResult, interactionPerformanceResult, seoResult, summary, fallback);
      return;
    }

    chrome.storage.local.get(`cdnHeaders_${tabId}`, (data) => {
      const headerCDN = data[`cdnHeaders_${tabId}`];

      if (headerCDN && cdnResult) {
        cdnResult.edge = headerCDN.edge;
        cdnResult.confidence = headerCDN.confidence;
        cdnResult.source = "headers";

        cdnResult.evidence.push({
          type: "strong",
          message: `${headerCDN.edge} detected via response headers`,
        });
      }

      sendResults(primary, secondary, renderingResult, cdnResult, loadingPerformanceResult, interactionPerformanceResult, seoResult, summary, fallback);
    });
  });
}

function sendResults(primary, secondary, renderingResult, cdnResult, loadingPerformanceResult, interactionPerformanceResult, seoResult, summary, fallback) {
  chrome.runtime.sendMessage({
    type: "STORE_STACK_RESULTS",
    data: {
      primary: primary,
      secondary: primary ? secondary : [],
      rendering: renderingResult,
      cdn: cdnResult,
      performance: {
        loading: loadingPerformanceResult,
        interaction: interactionPerformanceResult,
      },
      seo: seoResult,
      summary: summary,
      fallback: fallback,
    },
  });
}

function applyFrameworkOverrides(results) {
  const get = (name) => results.find((r) => r.name === name);

  const next = get("Next.js")?.detected;
  const nuxt = get("Nuxt")?.detected;
  const astro = get("Astro")?.detected;
  const remix = get("Remix")?.detected;
  const gatsby = get("Gatsby")?.detected;
  const angular = get("Angular")?.detected;

  if (!angular) {
    const mat = get("Angular Material");
    if (mat) mat.detected = false;
  }

  if (next) {
    const react = get("React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Next.js";
    }
  }

  if (nuxt) {
    const vue = get("Vue");
    if (vue) {
      vue.detected = false;
      vue.note = "Handled by Nuxt";
    }
  }

  if (astro) {
    const react = get("React");
    const vue = get("Vue");

    if (react) {
      react.detected = false;
      react.note = "Handled by Astro";
    }

    if (vue) {
      vue.detected = false;
      vue.note = "Handled by Astro";
    }
  }

  if (remix) {
    const react = get("React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Remix";
    }
  }

  if (gatsby) {
    const react = get("React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Gatsby";
    }
  }
}

runDetection();
setTimeout(runDetection, 3000);
