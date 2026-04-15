export function detectStencil(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasStencilInternals = html.includes("__stencil") || html.includes("stencil-component");
  const hasHydratedClass = html.includes('class="hydrated"') || html.includes(" hydrated");
  const hasComponentReady = pageData.scripts.content?.some((content) => content.includes("componentOnReady"));
  const hasStencilScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("stencil"));

  if (hasStencilInternals) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Stencil internals",
    });
  }

  if (hasHydratedClass) {
    evidence.push({
      type: "medium",
      message: "Found Stencil hydrated components",
    });
  }

  if (hasComponentReady) {
    evidence.push({
      type: "medium",
      message: "Found Stencil component lifecycle",
    });
  }

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
