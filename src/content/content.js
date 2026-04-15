import { scanDOM } from "./dom-scan.js";
import { scanScripts } from "./script-scan.js";
import { scanGlobals } from "./global-scan.js";
import { scanMeta } from "./meta-scan.js";

import { detectAngular } from "../detectors/frameworks/angular-detector.js";
import { detectReact } from "../detectors/frameworks/react-detector.js";
import { detectVue } from "../detectors/frameworks/vue-detector.js";
import { detectNext } from "../detectors/frameworks/next-detector.js";
import { detectNuxt } from "../detectors/frameworks/nuxt-detector.js";
import { detectAstro } from "../detectors/frameworks/astro-detector.js";
import { detectSvelte } from "../detectors/frameworks/svelte-detector.js";
import { detectSolid } from "../detectors/frameworks/solid-detector.js";
import { detectRemix } from "../detectors/frameworks/remix-detector.js";
import { detectGatsby } from "../detectors/frameworks/gatsby-detector.js";
import { detectAlpine } from "../detectors/frameworks/alpine-detector.js";
import { detectQwik } from "../detectors/frameworks/qwik-detector.js";
import { detectPreact } from "../detectors/frameworks/preact-detector.js";
import { detectLit } from "../detectors/frameworks/lit-detector.js";
import { detectStencil } from "../detectors/frameworks/stencil-detector.js";
import { detectEmber } from "../detectors/frameworks/ember-detector.js";
import { detectKnockout } from "../detectors/frameworks/knockout-detector.js";

import { detectTailwind } from "../detectors/libraries/tailwind-detector.js";
import { detectBootstrap } from "../detectors/libraries/bootstrap-detector.js";
import { detectAngularMaterial } from "../detectors/libraries/angular-material-detector.js";
import { detectJQuery } from "../detectors/libraries/jquery-detector.js";
import { detectGSAP } from "../detectors/libraries/gsap-detector.js";
import { detectThree } from "../detectors/libraries/three-detector.js";
import { detectSwiper } from "../detectors/libraries/swiper-detector.js";
import { detectAOS } from "../detectors/libraries/aos-detector.js";
import { detectChartJS } from "../detectors/libraries/chart-detector.js";

import { detectWordPress } from "../detectors/cms/wordpress-detector.js";
import { detectShopify } from "../detectors/cms/shopify-detector.js";
import { detectWix } from "../detectors/cms/wix-detector.js";
import { detectSquarespace } from "../detectors/cms/squarespace-detector.js";
import { detectWebflow } from "../detectors/cms/webflow-detector.js";
import { detectJoomla } from "../detectors/cms/joomla-detector.js";

import { buildFallbackInsights } from "../detectors/fallback/fallback.js";
import { evaluateDetection } from "../scoring/confidence-engine.js";

const TECHNOLOGY_TYPES = {
  Angular: "framework",
  React: "framework",
  Vue: "framework",
  "Next.js": "framework",
  Nuxt: "framework",
  Astro: "framework",
  Svelte: "framework",
  Solid: "framework",
  Remix: "framework",
  Gatsby: "framework",
  Alpine: "framework",
  Qwik: "framework",
  Preact: "framework",
  Lit: "framework",
  Stencil: "framework",
  "Ember.js": "framework",
  Knockout: "framework",

  WordPress: "cms",
  Shopify: "cms",
  Wix: "cms",
  Squarespace: "cms",
  Webflow: "cms",
  Joomla: "cms",

  "Tailwind CSS": "library",
  Bootstrap: "library",
  "Angular Material": "library",
  jQuery: "library",
  GSAP: "library",
  "Three.js": "library",
  Swiper: "library",
  AOS: "library",
  "Chart.js": "library",
};

function runDetection() {
  const pageData = {
    dom: scanDOM(),
    scripts: scanScripts(),
    globals: scanGlobals(),
    meta: scanMeta(),
  };

  const results = [
    detectAngular(pageData),
    detectReact(pageData),
    detectVue(pageData),
    detectNext(pageData),
    detectNuxt(pageData),
    detectAstro(pageData),
    detectSvelte(pageData),
    detectSolid(pageData),
    detectRemix(pageData),
    detectGatsby(pageData),
    detectAlpine(pageData),
    detectQwik(pageData),
    detectPreact(pageData),
    detectLit(pageData),
    detectStencil(pageData),
    detectEmber(pageData),
    detectKnockout(pageData),

    detectTailwind(pageData),
    detectBootstrap(pageData),
    detectAngularMaterial(pageData),
    detectJQuery(pageData),
    detectGSAP(pageData),
    detectThree(pageData),
    detectSwiper(pageData),
    detectAOS(pageData),
    detectChartJS(pageData),

    detectWordPress(pageData),
    detectShopify(pageData),
    detectWix(pageData),
    detectSquarespace(pageData),
    detectWebflow(pageData),
    detectJoomla(pageData),
  ];

  // ---------- CENTRAL SCORING ----------
  const scoredResults = results.map((result) => {
    const evaluation = evaluateDetection(result.evidence);

    return {
      ...result,
      detected: evaluation.detected,
      confidence: evaluation.confidence,
    };
  });

  const finalResults = [...scoredResults];

  // ---------- SUPPRESSION LOGIC ----------
  const hasNext = finalResults.find((r) => r.name === "Next.js" && r.detected);
  const hasNuxt = finalResults.find((r) => r.name === "Nuxt" && r.detected);
  const hasAstro = finalResults.find((r) => r.name === "Astro" && r.detected);
  const hasRemix = finalResults.find((r) => r.name === "Remix" && r.detected);
  const hasGatsby = finalResults.find((r) => r.name === "Gatsby" && r.detected);
  const hasAngular = finalResults.find((r) => r.name === "Angular" && r.detected);

  if (!hasAngular) {
    const mat = finalResults.find((r) => r.name === "Angular Material");
    if (mat) mat.detected = false;
  }

  if (hasNext) {
    const react = finalResults.find((r) => r.name === "React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Next.js";
    }
  }

  if (hasNuxt) {
    const vue = finalResults.find((r) => r.name === "Vue");
    if (vue) {
      vue.detected = false;
      vue.note = "Handled by Nuxt";
    }
  }

  if (hasAstro) {
    const react = finalResults.find((r) => r.name === "React");
    const vue = finalResults.find((r) => r.name === "Vue");

    if (react) {
      react.detected = false;
      react.note = "Handled by Astro";
    }

    if (vue) {
      vue.detected = false;
      vue.note = "Handled by Astro";
    }
  }

  if (hasRemix) {
    const react = finalResults.find((r) => r.name === "React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Remix";
    }
  }

  if (hasGatsby) {
    const react = finalResults.find((r) => r.name === "React");
    if (react) {
      react.detected = false;
      react.note = "Handled by Gatsby";
    }
  }

  // ---------- TYPE ASSIGNMENT ----------
  const typedResults = finalResults.map((r) => ({
    ...r,
    type: r.type || TECHNOLOGY_TYPES[r.name?.trim()] || "other",
  }));

  const priority = {
    cms: 3,
    framework: 2,
    library: 1,
    other: 0,
  };

  const detected = typedResults.filter((r) => r.detected);

  // ---------- PRIMARY ----------
  const primary =
    [...detected].sort((a, b) => {
      const p = priority[b.type] - priority[a.type];
      if (p !== 0) return p;
      return b.confidence - a.confidence;
    })[0] || null;

  // ---------- SECONDARY ----------
  const secondary = detected.filter((r) => r !== primary).sort((a, b) => b.confidence - a.confidence);

  // ---------- SMART FALLBACK ----------
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
    },
  });
}

runDetection();
setTimeout(runDetection, 1500);
setTimeout(runDetection, 3000);
