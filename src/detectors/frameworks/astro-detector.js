export function detectAstro(pageData) {
  const evidence = [];

  const hasAstroInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("astro"));

  if (pageData.meta.hasAstroGenerator) {
    evidence.push({
      type: "strong",
      decisive: true,
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
      decisive: true,
      message: "Found Astro build asset path",
    });
  }

  if (pageData.dom.html.includes("client:load") || pageData.dom.html.includes("client:idle") || pageData.dom.html.includes("client:visible")) {
    evidence.push({
      type: "medium",
      message: "Found Astro client directives",
    });
  }

  if (hasAstroInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Astro-related script URL",
    });
  }

  return {
    name: "Astro",
    type: "framework",
    evidence,
  };
}
