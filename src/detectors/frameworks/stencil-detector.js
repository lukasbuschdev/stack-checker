export function detectStencil(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasStencilInternals = html.includes("__stencil") || html.includes("stencil-component");

  if (hasStencilInternals) {
    evidence.push({
      type: "strong",
      message: "Found Stencil internals",
    });
  }

  const hasHydratedClass = html.includes('class="hydrated"') || html.includes(" hydrated");

  if (hasHydratedClass) {
    evidence.push({
      type: "medium",
      message: "Found Stencil hydrated components",
    });
  }

  const hasComponentReady = pageData.scripts.content?.some((content) => content.includes("componentOnReady"));

  if (hasComponentReady) {
    evidence.push({
      type: "medium",
      message: "Found Stencil component lifecycle",
    });
  }

  const hasStencilScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("stencil"));

  if (hasStencilScripts) {
    evidence.push({
      type: "medium",
      message: "Found Stencil script reference",
    });
  }

  return {
    name: "Stencil",
    type: "framework",
    evidence,
  };
}
