export function detectVue(pageData) {
  const evidence = [];

  const vueScriptMatches = pageData.scripts.srcList.filter((src) => /(?:^|\/)(vue(?:\.global|\.runtime|\.esm-browser|\.esm-bundler)?(?:\.prod|\.global)?(?:\.min)?\.js)(?:$|\?)/i.test(src) || /\/vue@[\d.]+/i.test(src));
  const vueDomHints = pageData.dom.dataAttributes.filter((attr) => /^(data-v-|v-cloak$)/i.test(attr));

  if (pageData.globals.hasVue) {
    evidence.push({
      type: "strong",
      message: "Found Vue global",
    });
  }

  if (vueScriptMatches.length > 0) {
    evidence.push({
      type: "medium",
      message: "Found Vue-specific script URL",
    });
  }

  if ((pageData.meta.generator || "").toLowerCase().includes("vue")) {
    evidence.push({
      type: "medium",
      message: "Found Vue-related generator meta tag",
    });
  }

  if (vueDomHints.length > 0) {
    evidence.push({
      type: "medium",
      message: "Found Vue-specific DOM attributes",
    });
  }

  return {
    name: "Vue",
    type: "framework",
    detected: evidence.some((item) => item.type === "strong" || item.type === "medium"),
    evidence,
  };
}
