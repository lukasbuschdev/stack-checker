export function detectJQuery(pageData) {
  const evidence = [];

  const hasJQueryGlobal = typeof window.jQuery !== "undefined" && typeof window.jQuery === "function";
  const hasDollarAlias = typeof window.$ === "function" && window.$ === window.jQuery;
  const hasJQueryScript = pageData.scripts.srcList.some((src) => /jquery(-\d+\.\d+\.\d+)?(\.min)?\.js/i.test(src));
  const hasJQueryReady = pageData.scripts.content?.some((content) => content.includes("$(document).ready(") || content.includes("jQuery(document).ready("));
  const hasAjaxUsage = pageData.scripts.content?.some((content) => content.includes("$.ajax("));

  if (hasJQueryGlobal && hasDollarAlias) {
    evidence.push({
      type: "strong",
      message: "Found jQuery global with $ alias",
    });
  }

  if (hasJQueryGlobal && hasJQueryReady) {
    evidence.push({
      type: "strong",
      message: "Found jQuery global with ready() usage",
    });
  }

  if (hasJQueryScript && hasAjaxUsage) {
    evidence.push({
      type: "medium",
      message: "Found jQuery script with AJAX usage",
    });
  }

  return {
    name: "jQuery",
    type: "library",
    evidence,
  };
}
