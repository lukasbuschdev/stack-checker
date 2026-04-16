import { scanDOM } from "./dom-scan.js";
import { scanScripts } from "./script-scan.js";
import { scanGlobals } from "./global-scan.js";
import { scanMeta } from "./meta-scan.js";

import { DETECTORS } from "../detectors/detectors.js";

import { buildFallbackInsights } from "../detectors/fallback/fallback.js";
import { evaluateDetection } from "../scoring/confidence-engine.js";

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

  const results = DETECTORS.map((detector) => detector(pageData));
  const renderingResult = results.find((r) => r.type === "rendering") || null;
  let cdnResult = results.find((r) => r.type === "infrastructure") || null;
  const performanceResult = results.find((r) => r.type === "performance") || null;
  const seoResult = results.find((r) => r.type === "seo") || null;

  const scoredResults = results.map((result) => {
    if (result.type === "rendering" || result.type === "infrastructure" || result.type === "performance" || result.type === "seo") {
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

  const stackResults = finalResults.filter((r) => r.type !== "rendering" && r.type !== "infrastructure" && r.type !== "performance" && r.type !== "seo");
  const detected = stackResults.filter((r) => r.detected === true);

  const primary =
    detected.sort((a, b) => {
      const p = priority[b.type] - priority[a.type];
      if (p !== 0) return p;
      return b.confidence - a.confidence;
    })[0] || null;

  const secondary = detected.filter((r) => r !== primary).sort((a, b) => b.confidence - a.confidence);
  const hasMeaningfulDetection = detected.some((r) => r.confidence >= 30);

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
      sendResults(primary, secondary, renderingResult, cdnResult, performanceResult, seoResult);
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

      sendResults(primary, secondary, renderingResult, cdnResult, performanceResult, seoResult);
    });
  });
}

function sendResults(primary, secondary, renderingResult, cdnResult, performanceResult, seoResult) {
  chrome.runtime.sendMessage({
    type: "STORE_STACK_RESULTS",
    data: {
      primary: primary,
      secondary: primary ? secondary : [],
      rendering: renderingResult,
      cdn: cdnResult,
      performance: performanceResult,
      seo: seoResult,
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
