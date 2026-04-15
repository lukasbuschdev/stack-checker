export function detectNuxt(pageData) {
  const evidence = [];

  if (pageData.globals.hasNuxt || pageData.scripts.hasNuxtPayload) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Nuxt runtime (__NUXT__ payload)",
    });
  } else {
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
  }

  return {
    name: "Nuxt",
    type: "framework",
    evidence,
  };
}
