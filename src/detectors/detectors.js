import { detectAngular } from "./frameworks/angular-detector.js";
import { detectReact } from "./frameworks/react-detector.js";
import { detectVue } from "./frameworks/vue-detector.js";
import { detectNext } from "./frameworks/next-detector.js";
import { detectNuxt } from "./frameworks/nuxt-detector.js";
import { detectAstro } from "./frameworks/astro-detector.js";
import { detectSvelte } from "./frameworks/svelte-detector.js";
import { detectSolid } from "./frameworks/solid-detector.js";
import { detectRemix } from "./frameworks/remix-detector.js";
import { detectGatsby } from "./frameworks/gatsby-detector.js";
import { detectAlpine } from "./frameworks/alpine-detector.js";
import { detectQwik } from "./frameworks/qwik-detector.js";
import { detectPreact } from "./frameworks/preact-detector.js";
import { detectLit } from "./frameworks/lit-detector.js";
import { detectStencil } from "./frameworks/stencil-detector.js";
import { detectEmber } from "./frameworks/ember-detector.js";
import { detectKnockout } from "./frameworks/knockout-detector.js";

import { detectTailwind } from "./libraries/tailwind-detector.js";
import { detectBootstrap } from "./libraries/bootstrap-detector.js";
import { detectAngularMaterial } from "./libraries/angular-material-detector.js";
import { detectJQuery } from "./libraries/jquery-detector.js";
import { detectGSAP } from "./libraries/gsap-detector.js";
import { detectThree } from "./libraries/three-detector.js";
import { detectSwiper } from "./libraries/swiper-detector.js";
import { detectAOS } from "./libraries/aos-detector.js";
import { detectChartJS } from "./libraries/chart-detector.js";

import { detectWordPress } from "./cms/wordpress-detector.js";
import { detectShopify } from "./cms/shopify-detector.js";
import { detectWix } from "./cms/wix-detector.js";
import { detectSquarespace } from "./cms/squarespace-detector.js";
import { detectWebflow } from "./cms/webflow-detector.js";
import { detectJoomla } from "./cms/joomla-detector.js";

import { detectRenderStrategy } from "./rendering/render-strategy-detector.js";
import { detectCDN } from "./cdn/cdn-detector.js";
import { detectInteractionPerformance } from "./performance/interaction-performance-detector.js";
import { detectSEO } from "./seo/seo-detector.js";
import { detectLoadingPerformance } from "./performance/loading-performance-detector.js";
import { detectAccessibility } from "./accessibility/accessibility-detector.js";

export const DETECTORS = [
  detectAngular,
  detectReact,
  detectVue,
  detectNext,
  detectNuxt,
  detectAstro,
  detectSvelte,
  detectSolid,
  detectRemix,
  detectGatsby,
  detectAlpine,
  detectQwik,
  detectPreact,
  detectLit,
  detectStencil,
  detectEmber,
  detectKnockout,

  detectTailwind,
  detectBootstrap,
  detectAngularMaterial,
  detectJQuery,
  detectGSAP,
  detectThree,
  detectSwiper,
  detectAOS,
  detectChartJS,

  detectWordPress,
  detectShopify,
  detectWix,
  detectSquarespace,
  detectWebflow,
  detectJoomla,

  detectRenderStrategy,

  detectCDN,

  detectLoadingPerformance,
  detectInteractionPerformance,

  detectSEO,

  detectAccessibility,
];
