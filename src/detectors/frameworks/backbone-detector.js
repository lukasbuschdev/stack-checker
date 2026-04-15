export function detectBackbone(pageData) {
  const evidence = [];

  const hasBackboneGlobal = !!window.Backbone;

  if (hasBackboneGlobal) {
    evidence.push({
      type: "strong",
      message: "Found Backbone global",
    });
  }

  const hasBackboneRuntime = pageData.scripts.content?.some((content) => content.includes("Backbone.Model") || content.includes("Backbone.View"));

  if (hasBackboneRuntime) {
    evidence.push({
      type: "medium",
      message: "Found Backbone runtime usage",
    });
  }

  const hasBackboneScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("backbone"));

  if (hasBackboneScripts) {
    evidence.push({
      type: "medium",
      message: "Found Backbone script",
    });
  }

  return {
    name: "Backbone.js",
    type: "framework",
    evidence,
  };
}
