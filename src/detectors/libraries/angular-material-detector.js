export function detectAngularMaterial(pageData) {
  const evidence = [];

  const hasMatTags = pageData.dom.tags.some((tag) => tag.startsWith("MAT-"));

  if (hasMatTags) {
    evidence.push({
      type: "strong",
      message: "Found Angular Material component tags",
    });
  }

  const hasMaterialClasses = pageData.dom.classList.some((className) => className.startsWith("mat-") || className.startsWith("mdc-"));

  if (hasMaterialClasses) {
    evidence.push({
      type: "medium",
      message: "Found Angular Material related classes",
    });
  }

  const hasMaterialInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("material"));

  if (hasMaterialInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Angular Material related script URL",
    });
  }

  return {
    name: "Angular Material",
    detected: evidence.length > 0,
    evidence,
  };
}
