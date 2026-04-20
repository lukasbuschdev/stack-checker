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

const SAMPLE_COUNT = 3;
const INITIAL_SETTLE_MS = 1500;
const BETWEEN_SAMPLE_MS = 700;

runDetectionSequence();

async function runDetectionSequence() {
  const tabId = await getTabId();

  await waitForDocumentComplete();
  await waitForDomStable(1200, 5000);
  await delay(300);

  const snapshots = [];

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const snapshot = await collectSnapshot(tabId);
    snapshots.push(snapshot);

    if (i < SAMPLE_COUNT - 1) {
      await delay(BETWEEN_SAMPLE_MS);
      await waitForDomQuiet(600, 2500);
    }
  }

  const finalSnapshot = chooseFinalSnapshot(snapshots);

  const summary = buildSummary(finalSnapshot.performance?.loading || null, finalSnapshot.performance?.interaction || null, finalSnapshot.seo || null, finalSnapshot.accessibility || null);

  sendResults(
    finalSnapshot.primary,
    finalSnapshot.secondary,
    finalSnapshot.rendering,
    finalSnapshot.cdn,
    finalSnapshot.performance?.loading || null,
    finalSnapshot.performance?.interaction || null,
    finalSnapshot.seo || null,
    finalSnapshot.accessibility || null,
    summary,
    finalSnapshot.fallback,
    {
      isFinal: true,
      sampleCount: SAMPLE_COUNT,
      finalizedAt: Date.now(),
    },
  );
}

async function collectSnapshot(tabId) {
  const pageData = {
    dom: scanDOM(),
    scripts: scanScripts(),
    globals: scanGlobals(),
    meta: scanMeta(),
  };

  const results = await Promise.all(
    DETECTORS.map(async (detector) => {
      try {
        return await detector(pageData);
      } catch (e) {
        return {
          name: detector.name || "Unknown",
          detected: false,
          type: "other",
          error: true,
          evidence: [],
        };
      }
    }),
  );

  const renderingResult = results.find((r) => r.type === "rendering") || null;
  let cdnResult = results.find((r) => r.type === "infrastructure") || null;
  const byType = Object.fromEntries(results.map((r) => [r.type, r]));

  const loadingPerformanceResult = byType["loading-performance"] || null;
  const interactionPerformanceResult = byType["interaction-performance"] || null;
  const seoResult = byType["seo"] || null;
  const accessibilityResult = byType["accessibility"] || null;

  const scoredResults = results.map((result) => {
    if (result.type === "rendering" || result.type === "infrastructure" || result.type === "loading-performance" || result.type === "interaction-performance" || result.type === "seo" || result.type === "accessibility") {
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

  const stackResults = finalResults.filter((r) => r.type !== "rendering" && r.type !== "infrastructure" && r.type !== "loading-performance" && r.type !== "interaction-performance" && r.type !== "seo" && r.type !== "accessibility");

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

  if (tabId && cdnResult) {
    const headerCDN = await getHeaderCDN(tabId);

    if (headerCDN) {
      cdnResult = {
        ...cdnResult,
        edge: headerCDN.edge,
        confidence: headerCDN.confidence,
        source: "headers",
        evidence: [
          ...(cdnResult.evidence || []),
          {
            type: "strong",
            message: `${headerCDN.edge} detected via response headers`,
          },
        ],
      };
    }
  }

  return {
    primary,
    secondary: primary ? secondary : [],
    rendering: renderingResult,
    cdn: cdnResult,
    performance: {
      loading: loadingPerformanceResult,
      interaction: interactionPerformanceResult,
    },
    seo: seoResult,
    accessibility: accessibilityResult,
    fallback,
  };
}

function chooseFinalSnapshot(snapshots) {
  const latest = snapshots[snapshots.length - 1];

  return {
    ...latest,
    performance: {
      loading: latest.performance?.loading || null,
      interaction: chooseStableInteractionResult(snapshots.map((s) => s.performance?.interaction).filter(Boolean)),
    },
    seo: chooseStableSeoResult(snapshots.map((s) => s.seo).filter(Boolean)),
    accessibility: latest.accessibility || null,
  };
}

function chooseStableSeoResult(results) {
  if (!results.length) return null;

  return results.reduce((best, current) => {
    if (!best) return current;
    if (!current) return best;

    const bestInternal = best?.data?.links?.internal ?? 0;
    const currentInternal = current?.data?.links?.internal ?? 0;

    if (currentInternal !== bestInternal) {
      return currentInternal > bestInternal ? current : best;
    }

    const bestImages = best?.data?.images?.total ?? 0;
    const currentImages = current?.data?.images?.total ?? 0;

    if (currentImages !== bestImages) {
      return currentImages > bestImages ? current : best;
    }

    const bestScore = best?.score ?? 0;
    const currentScore = current?.score ?? 0;

    return currentScore > bestScore ? current : best;
  }, null);
}

function chooseStableInteractionResult(results) {
  if (!results.length) return null;

  return results.reduce((best, current) => {
    if (!best) return current;
    if (!current) return best;

    const bestJsRank = getJsActivityRank(best?.data?.jsAnimationActivity?.level);
    const currentJsRank = getJsActivityRank(current?.data?.jsAnimationActivity?.level);

    if (currentJsRank !== bestJsRank) {
      return currentJsRank > bestJsRank ? current : best;
    }

    const bestLayout = best?.data?.layoutAnimationCount ?? 0;
    const currentLayout = current?.data?.layoutAnimationCount ?? 0;

    if (currentLayout !== bestLayout) {
      return currentLayout > bestLayout ? current : best;
    }

    const bestHeavy = best?.data?.heavyInteractionCount ?? 0;
    const currentHeavy = current?.data?.heavyInteractionCount ?? 0;

    if (currentHeavy !== bestHeavy) {
      return currentHeavy > bestHeavy ? current : best;
    }

    const bestAnimated = best?.data?.animatedCount ?? 0;
    const currentAnimated = current?.data?.animatedCount ?? 0;

    if (currentAnimated !== bestAnimated) {
      return currentAnimated > bestAnimated ? current : best;
    }

    const bestScore = best?.score ?? 100;
    const currentScore = current?.score ?? 100;

    if (currentScore !== bestScore) {
      return currentScore < bestScore ? current : best;
    }

    return current;
  }, null);
}

function sendResults(primary, secondary, renderingResult, cdnResult, loadingPerformanceResult, interactionPerformanceResult, seoResult, accessibilityResult, summary, fallback, meta = {}) {
  chrome.runtime.sendMessage({
    type: "STORE_STACK_RESULTS",
    data: {
      primary,
      secondary,
      rendering: renderingResult,
      cdn: cdnResult,
      performance: {
        loading: loadingPerformanceResult,
        interaction: interactionPerformanceResult,
      },
      seo: seoResult,
      accessibility: accessibilityResult,
      summary,
      fallback,
      meta,
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

function buildSummary(loadingPerformanceResult, interactionPerformanceResult, seoResult, accessibilityResult) {
  const loadingPerformanceScore = loadingPerformanceResult?.score ?? null;
  const interactionPerformanceScore = interactionPerformanceResult?.score ?? null;
  const seoScore = seoResult?.score ?? null;
  const accessibilityScore = accessibilityResult?.score ?? null;

  let overallScore = null;

  const scores = {
    loading: loadingPerformanceScore,
    interaction: interactionPerformanceScore,
    seo: seoScore,
    accessibility: accessibilityScore,
  };

  if (scores.loading != null || scores.interaction != null || scores.seo != null || scores.accessibility != null) {
    overallScore = calculateOverallScore(scores);
  }

  const levelPriority = {
    critical: 2,
    warning: 1,
  };

  const allIssues = [...(loadingPerformanceResult?.insights || []), ...(interactionPerformanceResult?.insights || []), ...(seoResult?.insights || []), ...(accessibilityResult?.insights || [])];

  const totalIssueCounts = {
    critical: allIssues.filter((i) => i.level === "critical").length,
    warning: allIssues.filter((i) => i.level === "warning").length,
  };

  const topIssues = allIssues
    .filter((i) => i.level === "critical" || i.level === "warning")
    .sort((a, b) => levelPriority[b.level] - levelPriority[a.level])
    .slice(0, 3);

  return {
    loadingPerformanceScore,
    interactionPerformanceScore,
    seoScore,
    accessibilityScore,
    overallScore,
    topIssues,
    totalIssueCounts,
    allInsights: allIssues,
  };
}

function getJsActivityRank(level) {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  if (level === "low") return 1;
  return 0;
}

function waitForDocumentComplete() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener("load", resolve, { once: true });
  });
}

function waitForDomQuiet(quietMs = 1000, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let quietTimer = null;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      clearTimeout(quietTimer);
      clearTimeout(forceTimer);
      resolve();
    };

    const observer = new MutationObserver(() => {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(finish, quietMs);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    quietTimer = setTimeout(finish, quietMs);
    const forceTimer = setTimeout(finish, timeoutMs);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTabId() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_TAB_ID" }, (response) => {
      resolve(response?.tabId || null);
    });
  });
}

function getHeaderCDN(tabId) {
  return new Promise((resolve) => {
    chrome.storage.local.get([`cdnHeaders_${tabId}`], (data) => {
      resolve(data[`cdnHeaders_${tabId}`] || null);
    });
  });
}

function waitForDomStable(stableMs = 1200, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let timer;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(forceTimer);
      resolve();
    };

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(finish, stableMs);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    timer = setTimeout(finish, stableMs);
    const forceTimer = setTimeout(finish, timeoutMs);
  });
}
