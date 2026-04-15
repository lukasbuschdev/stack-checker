export function detectChartJS(pageData) {
  const evidence = [];

  const hasChartGlobal = typeof window.Chart !== "undefined" && typeof window.Chart === "function";
  const hasChartRuntime = pageData.scripts.content?.some((content) => content.includes("new Chart(") && content.includes("type:"));
  const hasChartScript = pageData.scripts.srcList.some((src) => /chart(\.min)?\.js/i.test(src));

  if (hasChartGlobal && hasChartRuntime) {
    evidence.push({
      type: "strong",
      message: "Found Chart.js global with runtime usage",
    });
  }

  if (hasChartGlobal && hasChartScript) {
    evidence.push({
      type: "strong",
      message: "Found Chart.js global with script",
    });
  }

  if (hasChartRuntime && hasChartScript) {
    evidence.push({
      type: "medium",
      message: "Found Chart.js runtime with script",
    });
  }

  return {
    name: "Chart.js",
    type: "library",
    evidence,
  };
}
