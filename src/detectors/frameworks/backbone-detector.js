export function detectBackbone(pageData) {
  const evidence = [];

  const hasBackboneGlobal = !!window.Backbone;
  const hasBackboneRuntime = pageData.scripts.content?.some((content) => content.includes("Backbone.Model") || content.includes("Backbone.View"));
  const hasBackboneScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("backbone"));

  if (hasBackboneGlobal) {
    evidence.push({
      type: "strong",
      message: "Found Backbone global",
    });
  }

  if (hasBackboneRuntime) {
    evidence.push({
      type: "medium",
      message: "Found Backbone runtime usage",
    });
  }

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
