import { scanDOM } from "./dom-scan.js";
import { scanScripts } from "./script-scan.js";
import { scanGlobals } from "./global-scan.js";
import { scanMeta } from "./meta-scan.js";
import { detectAngular } from "../detectors/frameworks/angular-detector.js";
import { detectReact } from "../detectors/frameworks/react-detector.js";
import { detectNext } from "../detectors/frameworks/next-detector.js";
import { detectNuxt } from "../detectors/frameworks/nuxt-detector.js";
import { detectAstro } from "../detectors/frameworks/astro-detector.js";
import { detectVue } from "../detectors/frameworks/vue-detector.js";
import { evaluateDetection } from "../scoring/confidence-engine.js";
import { detectTailwind } from "../detectors/libraries/tailwind-detector.js";
import { detectBootstrap } from "../detectors/libraries/bootstrap-detector.js";
import { detectAngularMaterial } from "../detectors/libraries/angular-material-detector.js";
import { detectJQuery } from "../detectors/libraries/jquery-detector.js";

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
    detectTailwind(pageData),
    detectBootstrap(pageData),
    detectAngularMaterial(pageData),
    detectJQuery(pageData),
  ];

  const scoredResults = results.map((result) => {
    const evaluation = evaluateDetection(result.evidence);

    return {
      ...result,
      detected: evaluation.detected,
      confidence: evaluation.confidence,
    };
  });

  chrome.runtime.sendMessage({
    type: "STORE_STACK_RESULTS",
    data: scoredResults,
  });
}

runDetection();
setTimeout(runDetection, 1500);
setTimeout(runDetection, 3000);
