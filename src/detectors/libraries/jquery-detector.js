export function detectJQuery(pageData) {
  const evidence = [];

  if (pageData.globals.hasJQuery) {
    evidence.push({
      type: "strong",
      message: "Found jQuery global",
    });
  }

  const hasJQueryInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("jquery"));

  if (hasJQueryInScripts) {
    evidence.push({
      type: "medium",
      message: "Found jQuery-related script URL",
    });
  }

  return {
    name: "jQuery",
    detected: evidence.length > 0,
    evidence,
  };
}
