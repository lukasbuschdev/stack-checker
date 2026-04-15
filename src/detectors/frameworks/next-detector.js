export function detectNext(pageData) {
  const evidence = [];

  if (pageData.globals.hasNext) {
    evidence.push({
      type: "strong",
      message: "Found Next.js global (__NEXT_DATA__)",
    });
  }

  if (pageData.scripts.hasNextData) {
    evidence.push({
      type: "strong",
      message: "Found __NEXT_DATA__ in inline scripts",
    });
  }

  if (pageData.dom.html.includes("__NEXT_DATA__")) {
    evidence.push({
      type: "strong",
      message: "Found __NEXT_DATA__ in DOM",
    });
  }

  if (pageData.dom.html.includes("_next/static/") || pageData.dom.html.includes("/_next/")) {
    evidence.push({
      type: "strong",
      message: "Found Next.js static asset path",
    });
  }

  if (pageData.dom.html.includes("next-route-announcer") || pageData.dom.html.includes('id="__next"')) {
    evidence.push({
      type: "medium",
      message: "Found Next.js root container",
    });
  }

  if (pageData.scripts.srcList.some((src) => src.includes("/_next/static/"))) {
    evidence.push({
      type: "strong",
      message: "Found Next.js script bundle",
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

  const score = evidence.reduce((acc, e) => {
    if (e.type === "strong") return acc + 3;
    if (e.type === "medium") return acc + 2;
    return acc + 1;
  }, 0);

  return {
    name: "Next.js",
    detected: score >= 4,
    confidence: Math.min(score / 10, 1),
    evidence,
  };
}
