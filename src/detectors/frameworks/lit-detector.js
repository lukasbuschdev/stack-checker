export function detectLit(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasLitMarkers = html.includes("lit-html") || html.includes("lit-element") || html.includes("@lit/reactive-element");

  if (hasLitMarkers) {
    evidence.push({
      type: "strong",
      message: "Found Lit core libraries",
    });
  }

  const hasLitTemplateMarkers = html.includes("lit$") || html.includes("<!--?lit");

  if (hasLitTemplateMarkers) {
    evidence.push({
      type: "strong",
      message: "Found Lit template markers",
    });
  }

  const hasLitAttributes = html.includes("data-lit");

  if (hasLitAttributes) {
    evidence.push({
      type: "medium",
      message: "Found Lit attributes",
    });
  }

  const hasLitScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("lit"));

  if (hasLitScripts) {
    evidence.push({
      type: "medium",
      message: "Found Lit-related script",
    });
  }

  const hasLitRuntime = pageData.scripts.content?.some((content) => content.includes("lit-html") || content.includes("render("));

  if (hasLitRuntime) {
    evidence.push({
      type: "weak",
      message: "Found possible Lit runtime usage",
    });
  }

  return {
    name: "Lit",
    type: "framework",
    evidence,
  };
}
