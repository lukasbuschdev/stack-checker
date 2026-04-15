export function detectAstro(pageData) {
  const evidence = [];

  if (pageData.meta.hasAstroGenerator) {
    evidence.push({
      type: "strong",
      message: "Found Astro generator meta tag",
    });
  }

  if (pageData.dom.html.includes("astro-island") || pageData.dom.html.includes("astro-slot")) {
    evidence.push({
      type: "strong",
      message: "Found Astro component markers",
    });
  }

  if (pageData.dom.html.includes("data-astro-cid") || pageData.dom.html.includes("data-astro-source-file")) {
    evidence.push({
      type: "strong",
      message: "Found Astro scoped attributes",
    });
  }

  if (pageData.scripts.content?.some((content) => content.includes("Astro") && content.includes("hydrate"))) {
    evidence.push({
      type: "medium",
      message: "Found Astro hydration runtime",
    });
  }

  if (pageData.scripts.srcList.some((src) => src.includes("/_astro/"))) {
    evidence.push({
      type: "strong",
      message: "Found Astro build asset path",
    });
  }

  if (pageData.dom.html.includes("client:load") || pageData.dom.html.includes("client:idle") || pageData.dom.html.includes("client:visible")) {
    evidence.push({
      type: "medium",
      message: "Found Astro client directives",
    });
  }

  const hasAstroInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("astro"));

  if (hasAstroInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Astro-related script URL",
    });
  }

  const score = evidence.reduce((acc, e) => {
    if (e.type === "strong") return acc + 3;
    if (e.type === "medium") return acc + 2;
    return acc + 1;
  }, 0);

  return {
    name: "Astro",
    detected: score >= 3,
    confidence: Math.min(score / 8, 1),
    evidence,
  };
}
