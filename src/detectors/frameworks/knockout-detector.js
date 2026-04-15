export function detectKnockout(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasKnockoutGlobal = !!window.ko;
  const hasKnockoutBindings = html.includes("data-bind");
  const hasKnockoutScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("knockout"));

  if (hasKnockoutGlobal && hasKnockoutBindings) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Knockout global with data-bind attributes",
    });
  } else {
    if (hasKnockoutGlobal) {
      evidence.push({
        type: "strong",
        message: "Found Knockout global",
      });
    }

    if (hasKnockoutBindings) {
      evidence.push({
        type: "strong",
        message: "Found Knockout data-bind attributes",
      });
    }

    if (!hasKnockoutGlobal && !hasKnockoutBindings && hasKnockoutScripts) {
      evidence.push({
        type: "weak",
        message: "Found Knockout script",
      });
    }
  }

  return {
    name: "Knockout.js",
    type: "framework",
    evidence,
  };
}
