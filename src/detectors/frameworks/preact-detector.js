export function detectPreact(pageData) {
  const evidence = [];

  const hasPreactDevtools = !!window.__PREACT_DEVTOOLS__;
  const hasPreactGlobal = pageData.dom.html.includes("window.preact");
  const hasPreactScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("preact"));
  const hasPreactInternals = pageData.dom.html.includes("__k") || pageData.dom.html.includes("__e") || pageData.dom.html.includes("__d");
  const hasPreactRuntime = pageData.scripts.content?.some((content) => content.includes("preact") || content.includes("h("));

  if (hasPreactDevtools) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Preact DevTools hook",
    });
  }

  if (hasPreactGlobal) {
    evidence.push({
      type: "medium",
      message: "Found Preact global",
    });
  }

  if (hasPreactScripts) {
    evidence.push({
      type: "medium",
      message: "Found Preact script reference",
    });
  }

  if (hasPreactInternals) {
    evidence.push({
      type: "weak",
      message: "Found possible Preact VDOM internals",
    });
  }

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
