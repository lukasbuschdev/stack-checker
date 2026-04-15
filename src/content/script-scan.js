export function scanScripts() {
  const scripts = Array.from(document.querySelectorAll("script"));

  const srcList = scripts.map((script) => script.src).filter(Boolean);

  const inlineScripts = scripts.filter((script) => !script.src).map((script) => script.textContent || "");

  return {
    srcList,
    inlineScripts,
    hasReactRoot: inlineScripts.some((code) => code.includes("createRoot") || code.includes("ReactDOM.render")),
    hasNextData: inlineScripts.some((code) => /<script[^>]*id=["']__NEXT_DATA__["']/i.test(code)),
    hasNuxtPayload: inlineScripts.some((code) => /window\.__NUXT__\s*=/.test(code) || /__NUXT_DATA__/.test(code)),
    hasAstroInScripts: inlineScripts.some((code) => /astro/i.test(code)),
  };
}
