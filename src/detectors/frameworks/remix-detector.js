export function detectRemix(pageData) {
  const evidence = [];

  const hasRemixContext = pageData.dom.html.includes("__remixContext");
  const hasRemixScripts = pageData.scripts.content?.some((content) => content.includes("remixRouteModules") || content.includes("createBrowserRouter") || content.includes("entry.client"));
  const hasRemixDataAttrs = pageData.dom.html.includes("data-remix");
  const hasRemixInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("remix"));

  if (hasRemixContext) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Remix runtime context",
    });
  }

  if (hasRemixScripts) {
    evidence.push({
      type: "medium",
      message: "Found Remix route/runtime patterns",
    });
  }

  if (hasRemixDataAttrs) {
    evidence.push({
      type: "medium",
      message: "Found Remix data attributes",
    });
  }

  if (hasRemixInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Remix-related script",
    });
  }

  return {
    name: "Remix",
    type: "framework",
    evidence,
  };
}
