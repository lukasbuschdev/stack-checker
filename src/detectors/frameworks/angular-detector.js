export function detectAngular(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasNgVersion = pageData.dom.hasNgVersion;
  const hasScopedAttributes = pageData.dom.angularScopedAttributes.length > 0;
  const hasNgServerContext = pageData.dom.hasNgServerContext;
  const hasNgReflect = pageData.dom.ngReflectAttributes.length > 0;
  const hasAngularGlobal = typeof window.ng !== "undefined";
  const hasAngularScript = pageData.scripts.srcList.some((src) => /@angular|angular(\.min)?\.js/i.test(src));

  if (hasNgVersion) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found ng-version attribute",
    });
  }

  if (hasScopedAttributes) {
    evidence.push({
      type: "strong",
      message: "Found Angular scoped attributes (_ngcontent/_nghost)",
    });
  }

  if (hasNgServerContext) {
    evidence.push({
      type: "strong",
      message: "Found Angular SSR marker",
    });
  }

  if (hasNgReflect && hasScopedAttributes) {
    evidence.push({
      type: "medium",
      message: "Found Angular dev-mode bindings",
    });
  }

  if (hasAngularGlobal && hasAngularScript) {
    evidence.push({
      type: "medium",
      message: "Found Angular global with script",
    });
  }

  return {
    name: "Angular",
    type: "framework",
    evidence,
  };
}
