export function detectAngular(pageData) {
  const evidence = [];
  const angularComponentTags = pageData.dom.tags.filter((tag) => tag.includes("-") && !tag.startsWith("ION-") && !tag.startsWith("SL-") && !tag.startsWith("MUI-"));

  if (angularComponentTags.length >= 3) {
    evidence.push({
      type: "medium",
      message: "Found multiple custom component tags typical of Angular apps",
    });
  }

  if (pageData.dom.hasNgVersion) {
    evidence.push({
      type: "strong",
      message: "Found ng-version attribute in DOM",
    });
  }

  if (pageData.dom.hasNgServerContext) {
    evidence.push({
      type: "strong",
      message: "Found Angular SSR marker (ng-server-context)",
    });
  }

  if (pageData.dom.ngReflectAttributes.length > 0) {
    evidence.push({
      type: "medium",
      message: "Found ng-reflect attributes in DOM",
    });
  }

  if (pageData.dom.angularScopedAttributes.length > 0) {
    evidence.push({
      type: "strong",
      message: "Found Angular scoped attributes (_ngcontent or _nghost)",
    });
  }

  if (pageData.globals.hasNg) {
    evidence.push({
      type: "medium",
      message: "Found Angular global (window.ng)",
    });
  }

  const angularRootTags = pageData.dom.tags.filter((tag) => tag === "APP-ROOT" || tag.startsWith("APP-"));

  if (angularRootTags.length > 0) {
    evidence.push({
      type: "weak",
      message: "Found Angular-style root component tag",
    });
  }

  return {
    name: "Angular",
    detected: evidence.some((item) => item.type === "strong" || item.type === "medium"),
    evidence,
  };
}
