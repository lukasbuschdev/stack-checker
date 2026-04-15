export function detectPreact(pageData) {
  const evidence = [];

  const hasPreactDevtools = !!window.__PREACT_DEVTOOLS__;

  if (hasPreactDevtools) {
    evidence.push({
      type: "strong",
      message: "Found Preact DevTools hook",
    });
  }

  const hasPreactGlobal = pageData.dom.html.includes("window.preact");

  if (hasPreactGlobal) {
    evidence.push({
      type: "medium",
      message: "Found Preact global",
    });
  }

  const hasPreactScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("preact"));

  if (hasPreactScripts) {
    evidence.push({
      type: "medium",
      message: "Found Preact script reference",
    });
  }

  const hasPreactInternals = pageData.dom.html.includes("__k") || pageData.dom.html.includes("__e") || pageData.dom.html.includes("__d");

  if (hasPreactInternals) {
    evidence.push({
      type: "weak",
      message: "Found possible Preact VDOM internals",
    });
  }

  const hasPreactRuntime = pageData.scripts.content?.some((content) => content.includes("preact") || content.includes("h("));

  if (hasPreactRuntime) {
    evidence.push({
      type: "weak",
      message: "Found possible Preact runtime usage",
    });
  }

  return {
    name: "Preact",
    type: "framework",
    evidence,
  };
}
