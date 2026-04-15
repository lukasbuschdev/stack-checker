export function detectWebflow(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasWebflowClass = html.includes("w-webflow");

  if (hasWebflowClass) {
    evidence.push({
      type: "strong",
      message: "Found Webflow classes",
    });
  }

  const hasWebflowAttrs = html.includes("data-wf-page");

  if (hasWebflowAttrs) {
    evidence.push({
      type: "medium",
      message: "Found Webflow attributes",
    });
  }

  const hasWebflowScripts = pageData.scripts.srcList.some((src) => src.includes("webflow.js"));

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
