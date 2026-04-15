export function detectNuxt(pageData) {
  const evidence = [];

  if (pageData.globals.hasNuxt) {
    evidence.push({
      type: "strong",
      message: "Found Nuxt global (__NUXT__)",
    });
  }

  if (pageData.scripts.hasNuxtPayload) {
    evidence.push({
      type: "strong",
      message: "Found Nuxt payload pattern in inline scripts",
    });
  }

  const nuxtScriptMatches = pageData.scripts.srcList.filter((src) => /(?:^|\/)(nuxt(?:\.min)?\.js)(?:$|\?)/i.test(src) || /\/_nuxt\//i.test(src));

  if (nuxtScriptMatches.length > 0) {
    evidence.push({
      type: "medium",
      message: "Found Nuxt-specific script URL",
    });
  }

  if ((pageData.meta.generator || "").toLowerCase().includes("nuxt")) {
    evidence.push({
      type: "medium",
      message: "Found Nuxt-related generator meta tag",
    });
  }

  return {
    name: "Nuxt",
    detected: evidence.some((item) => item.type === "strong" || item.type === "medium"),
    type: "framework",
    evidence,
  };
}
