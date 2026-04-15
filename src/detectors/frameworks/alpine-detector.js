export function detectAlpine(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasAlpineDirectives = html.includes("x-data") || html.includes("x-bind") || html.includes("x-show") || html.includes("x-if") || html.includes("x-for") || html.includes("x-on:") || html.includes("@click");
  const hasAlpineScript = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("alpine"));
  const hasAlpineRuntime = pageData.scripts.content?.some((content) => content.includes("Alpine.start") || content.includes("window.Alpine"));

  if (hasAlpineDirectives) {
    evidence.push({
      type: "strong",
      message: "Found Alpine.js directives (x-*)",
    });
  }

  if (hasAlpineScript) {
    evidence.push({
      type: "medium",
      message: "Found Alpine.js script",
    });
  }

  if (hasAlpineRuntime) {
    evidence.push({
      type: "medium",
      message: "Found Alpine.js runtime",
    });
  }

  return {
    name: "Alpine.js",
    type: "framework",
    evidence,
  };
}
