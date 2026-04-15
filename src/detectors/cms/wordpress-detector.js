export function detectWordPress(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasWpContent = html.includes("/wp-content/") || html.includes("/wp-includes/");

  if (hasWpContent) {
    evidence.push({
      type: "strong",
      message: "Found WordPress core directories",
    });
  }

  const hasWpMeta = (pageData.meta.generator || "").toLowerCase().includes("wordpress");

  if (hasWpMeta) {
    evidence.push({
      type: "strong",
      message: "Found WordPress generator meta tag",
    });
  }

  const hasWpJson = html.includes("/wp-json/");

  if (hasWpJson) {
    evidence.push({
      type: "medium",
      message: "Found WordPress REST API endpoint",
    });
  }

  const hasWpScripts = pageData.scripts.srcList.some((src) => src.includes("wp-content") || src.includes("wp-includes"));

  if (hasWpScripts) {
    evidence.push({
      type: "strong",
      message: "Found WordPress script paths",
    });
  }

  const hasWpGlobals = !!window.wp;

  if (hasWpGlobals) {
    evidence.push({
      type: "medium",
      message: "Found WordPress global object",
    });
  }

  return {
    name: "WordPress",
    type: "cms",
    evidence,
  };
}
