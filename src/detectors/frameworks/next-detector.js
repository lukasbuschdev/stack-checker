export function detectNext(pageData) {
  const evidence = [];

  const hasNextData = pageData.globals.hasNext || pageData.scripts.hasNextData || pageData.dom.html.includes("__NEXT_DATA__");

  if (hasNextData) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found __NEXT_DATA__ (Next.js runtime data)",
    });
  } else {
    if (pageData.dom.html.includes("_next/static/") || pageData.dom.html.includes("/_next/")) {
      evidence.push({
        type: "strong",
        message: "Found Next.js static asset path",
      });
    }

    if (pageData.scripts.srcList.some((src) => src.includes("/_next/static/"))) {
      evidence.push({
        type: "strong",
        message: "Found Next.js script bundle",
      });
    }

    if (pageData.dom.html.includes("next-route-announcer") || pageData.dom.html.includes('id="__next"')) {
      evidence.push({
        type: "medium",
        message: "Found Next.js root container",
      });
    }

    if (pageData.scripts.content?.some((content) => content.includes("self.__next_f") || content.includes("__next_router__") || content.includes("next/dist/"))) {
      evidence.push({
        type: "medium",
        message: "Found Next.js runtime markers",
      });
    }

    if (pageData.dom.html.includes("data-nextjs-router") || pageData.dom.html.includes("data-nextjs-scroll-focus-boundary")) {
      evidence.push({
        type: "medium",
        message: "Found Next.js router attributes",
      });
    }

    if ((pageData.meta.generator || "").toLowerCase().includes("next")) {
      evidence.push({
        type: "weak",
        message: "Found Next.js generator meta tag",
      });
    }
  }

  return {
    name: "Next.js",
    type: "framework",
    evidence,
  };
}
