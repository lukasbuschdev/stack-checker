export function detectWebflow(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasWebflowClass = html.includes("w-webflow");
  const hasWebflowAttrs = html.includes("data-wf-page");
  const hasWebflowScripts = pageData.scripts.srcList.some((src) => src.includes("webflow.js"));

  if (hasWebflowClass) {
    evidence.push({
      type: "strong",
      message: "Found Webflow classes",
    });
  }

  if (hasWebflowAttrs) {
    evidence.push({
      type: "medium",
      decisive: true,
      message: "Found Webflow attributes",
    });
  }

  if (hasWebflowScripts) {
    evidence.push({
      type: "strong",
      message: "Found Webflow script",
    });
  }

  return {
    name: "Webflow",
    type: "cms",
    evidence,
  };
}
