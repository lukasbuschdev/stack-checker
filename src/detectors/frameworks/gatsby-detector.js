export function detectGatsby(pageData) {
  const evidence = [];

  const hasGatsbyRoot = pageData.dom.html.includes('id="___gatsby"');
  const hasGatsbyGlobal = pageData.dom.html.includes("___gatsby") || pageData.dom.html.includes("___loader");
  const hasPageData = pageData.dom.html.includes("/page-data/");
  const hasGatsbyScripts = pageData.scripts.srcList.some((src) => src.includes("gatsby"));

  if (hasGatsbyRoot) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Gatsby root element",
    });
  }

  if (hasGatsbyGlobal) {
    evidence.push({
      type: "strong",
      message: "Found Gatsby runtime globals",
    });
  }

  if (hasPageData) {
    evidence.push({
      type: "medium",
      message: "Found Gatsby page-data requests",
    });
  }

  if (hasGatsbyScripts) {
    evidence.push({
      type: "weak",
      message: "Found Gatsby-related script",
    });
  }

  return {
    name: "Gatsby",
    type: "framework",
    evidence,
  };
}
