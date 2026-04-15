export function detectAngularMaterial(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasAngularMarkers = html.includes("_ngcontent-") || html.includes("_nghost-") || html.includes("ng-version");
  const hasMaterialComponents = pageData.dom.tags.some((tag) => tag.startsWith("mat-"));
  const hasMaterialClasses = pageData.dom.classList.some((className) => className.startsWith("mat-"));
  const hasMdcClasses = pageData.dom.classList.some((className) => className.startsWith("mdc-"));
  const hasMaterialScripts = pageData.scripts.srcList.some((src) => src.includes("@angular/material") || src.includes("angular-material"));

  if (hasMaterialComponents && hasAngularMarkers) {
    evidence.push({
      type: "strong",
      message: "Found Angular Material components with Angular markers",
    });
  }

  if (hasMaterialClasses && hasAngularMarkers) {
    evidence.push({
      type: "medium",
      message: "Found Angular Material classes with Angular context",
    });
  }

  if (hasMdcClasses && hasMaterialComponents) {
    evidence.push({
      type: "medium",
      message: "Found MDC classes with Material components",
    });
  }

  if (hasMaterialScripts) {
    evidence.push({
      type: "medium",
      message: "Found Angular Material script reference",
    });
  }

  return {
    name: "Angular Material",
    type: "library",
    evidence,
  };
}
