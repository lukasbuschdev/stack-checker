export function detectWix(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasWixCDN = html.includes("wixstatic.com");

  if (hasWixCDN) {
    evidence.push({
      type: "strong",
      message: "Found Wix CDN",
    });
  }

  const hasWixGlobal = !!window.wix || html.includes("wix-code");

  if (hasWixGlobal) {
    evidence.push({
      type: "medium",
      message: "Found Wix runtime",
    });
  }

  const hasWixScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("wix"));

  if (hasWixScripts) {
    evidence.push({
      type: "medium",
      message: "Found Wix script",
    });
  }

  return {
    name: "Wix",
    type: "cms",
    evidence,
  };
}
