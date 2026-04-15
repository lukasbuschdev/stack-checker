export function detectReact(pageData) {
  const evidence = [];

  if (pageData.globals.hasReactDevtoolsHook) {
    evidence.push({
      type: "strong",
      message: "Found React DevTools hook",
    });
  }

  const hasFiberMarkers = pageData.dom.html.includes("__reactFiber") || pageData.dom.html.includes("__reactProps") || pageData.dom.html.includes("__reactContainer");

  if (hasFiberMarkers) {
    evidence.push({
      type: "strong",
      message: "Found React Fiber internals",
    });
  }

  if (pageData.scripts.hasReactRoot) {
    evidence.push({
      type: "medium",
      message: "Found React root rendering pattern",
    });
  }

  if (pageData.scripts.content?.some((content) => content.includes("createRoot(") || content.includes("hydrateRoot("))) {
    evidence.push({
      type: "medium",
      message: "Found React 18 root API usage",
    });
  }

  const hasReactAttributes = pageData.dom.html.includes("data-reactroot") || pageData.dom.html.includes("data-reactid");

  if (hasReactAttributes) {
    evidence.push({
      type: "medium",
      message: "Found React DOM attributes",
    });
  }

  const reactScriptMatches = pageData.scripts.srcList.filter((src) => /react(?:\.production|\.development)?(?:\.min)?\.js/i.test(src) || /react-dom(?:\.production|\.development)?(?:\.min)?\.js/i.test(src) || /\/react@[\d.]+/i.test(src));

  if (reactScriptMatches.length > 0) {
    evidence.push({
      type: "weak",
      message: "Found React script reference",
    });
  }

  const hasReactBundleHints = pageData.scripts.content?.some((content) => content.includes("useState(") || content.includes("useEffect(") || content.includes("useContext("));

  if (hasReactBundleHints) {
    evidence.push({
      type: "medium",
      message: "Found React hook usage in bundle",
    });
  }

  if (pageData.dom.html.includes("__NEXT_DATA__") || pageData.dom.html.includes("next-route-announcer")) {
    evidence.push({
      type: "strong",
      message: "Found Next.js (React framework)",
    });
  }

  const score = evidence.reduce((acc, e) => {
    if (e.type === "strong") return acc + 3;
    if (e.type === "medium") return acc + 2;
    return acc + 1;
  }, 0);

  return {
    name: "React",
    detected: score >= 3,
    confidence: Math.min(score / 8, 1),
    evidence,
  };
}
