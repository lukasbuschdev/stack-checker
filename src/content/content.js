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

  // ✅ Separate rendering result early
  const renderingResult = results.find((r) => r.type === "rendering") || null;

  const scoredResults = results.map((result) => {
    // ✅ Skip scoring override for rendering
    if (result.type === "rendering") {
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

  // ✅ Exclude rendering from stack detection
  const stackResults = finalResults.filter((r) => r.type !== "rendering");

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

  chrome.runtime.sendMessage({
    type: "STORE_STACK_RESULTS",
    data: {
      primary: primary || fallback,
      secondary: primary ? secondary : [],
      rendering: renderingResult, // ✅ NEW
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
setTimeout(runDetection, 1500);
setTimeout(runDetection, 3000);
