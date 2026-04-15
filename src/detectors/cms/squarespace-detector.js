export function detectSquarespace(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasSquarespaceCDN = html.includes("squarespace.com");
  const hasSquarespaceAttrs = html.includes("data-sqsp");
  const hasSquarespaceGlobal = !!window.Squarespace;

  if (hasSquarespaceCDN) {
    evidence.push({
      type: "strong",
      message: "Found Squarespace CDN",
    });
  }

  if (hasSquarespaceAttrs) {
    evidence.push({
      type: "medium",
      message: "Found Squarespace attributes",
    });
  }

  if (hasSquarespaceGlobal) {
    evidence.push({
      type: "medium",
      message: "Found Squarespace global",
    });
  }

  return {
    name: "Squarespace",
    type: "cms",
    evidence,
  };
}
