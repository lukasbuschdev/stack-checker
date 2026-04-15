export function detectKnockout(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasKnockoutGlobal = !!window.ko;

  if (hasKnockoutGlobal) {
    evidence.push({
      type: "strong",
      message: "Found Knockout global",
    });
  }

  const hasKnockoutBindings = html.includes("data-bind");

  if (hasKnockoutBindings) {
    evidence.push({
      type: "strong",
      message: "Found Knockout data-bind attributes",
    });
  }

  const hasKnockoutScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("knockout"));

  if (hasKnockoutScripts) {
    evidence.push({
      type: "medium",
      message: "Found Knockout script",
    });
  }

  return {
    name: "Knockout.js",
    type: "framework",
    evidence,
  };
}
