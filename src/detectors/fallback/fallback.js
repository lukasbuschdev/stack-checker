export function buildFallbackInsights(pageData) {
  const insights = [];

  if (pageData.scripts.srcList.length === 0) {
    insights.push("No external scripts detected → likely static or server-rendered");
  }

  if (pageData.dom.tags.length > 100) {
    insights.push("Large static DOM → likely server-side rendered");
  }

  if (!pageData.globals.hasReact && !pageData.globals.hasVue && !pageData.globals.hasNg) {
    insights.push("No framework globals found");
  }

  if (pageData.scripts.srcList.some((src) => src.includes("clientlibs"))) {
    insights.push("Detected enterprise CMS pattern (clientlibs)");
  }

  if (pageData.meta.generator) {
    insights.push(`Meta generator detected: ${pageData.meta.generator}`);
  }

  return insights;
}
