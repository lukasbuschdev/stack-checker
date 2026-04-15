export function detectSquarespace(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasSquarespaceCDN = html.includes("squarespace.com");

  if (hasSquarespaceCDN) {
    evidence.push({
      type: "strong",
      message: "Found Squarespace CDN",
    });
  }

  const hasSquarespaceAttrs = html.includes("data-sqsp");

  if (hasSquarespaceAttrs) {
    evidence.push({
      type: "medium",
      message: "Found Squarespace attributes",
    });
  }

  const hasSquarespaceGlobal = !!window.Squarespace;

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
