export function detectWordPress(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasWpContent = html.includes("/wp-content/") || html.includes("/wp-includes/");
  const hasWpMeta = (pageData.meta.generator || "").toLowerCase().includes("wordpress");
  const hasWpJson = html.includes("/wp-json/");
  const hasWpScripts = pageData.scripts.srcList.some((src) => src.includes("wp-content") || src.includes("wp-includes"));
  const hasWpGlobals = !!window.wp;

  if (hasWpContent) {
    evidence.push({
      type: "strong",
      message: "Found WordPress core directories",
    });
  }

  if (hasWpMeta) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found WordPress generator meta tag",
    });
  }

  if (hasWpJson) {
    evidence.push({
      type: "medium",
      message: "Found WordPress REST API endpoint",
    });
  }

  if (hasWpScripts) {
    evidence.push({
      type: "strong",
      message: "Found WordPress script paths",
    });
  }

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
