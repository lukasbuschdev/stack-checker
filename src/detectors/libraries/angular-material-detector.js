export function detectAngularMaterial(pageData) {
  const evidence = [];

  const html = pageData.dom.html;

  const hasAngularMarkers = html.includes("_ngcontent-") || html.includes("_nghost-") || html.includes("ng-version");

  const hasMaterialComponents = pageData.dom.tags.some((tag) => tag.startsWith("mat-"));

  if (hasMaterialComponents && hasAngularMarkers) {
    evidence.push({
      type: "strong",
      message: "Found Angular Material components with Angular markers",
    });
  }

  const hasMaterialClasses = pageData.dom.classList.some((className) => className.startsWith("mat-"));

  if (hasMaterialClasses && hasAngularMarkers) {
    evidence.push({
      type: "medium",
      message: "Found Angular Material classes with Angular context",
    });
  }

  const hasMdcClasses = pageData.dom.classList.some((className) => className.startsWith("mdc-"));

  if (hasMdcClasses && hasMaterialComponents) {
    evidence.push({
      type: "medium",
      message: "Found MDC classes with Material components",
    });
  }

  const hasMaterialScripts = pageData.scripts.srcList.some((src) => src.includes("@angular/material") || src.includes("angular-material"));

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
