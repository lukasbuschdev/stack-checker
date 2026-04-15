export function detectBootstrap(pageData) {
  const evidence = [];

  const hasBootstrapInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("bootstrap"));

  if (hasBootstrapInScripts) {
    evidence.push({
      type: "medium",
      message: "Found Bootstrap-related script URL",
    });
  }

  const bootstrapMatches = pageData.dom.classList.filter((className) =>
    /^(btn-(primary|secondary|success|danger|warning|info|light|dark|link)|navbar-(expand|dark|light)|col-(sm|md|lg|xl|xxl)-\d+|row-cols-\d+|dropdown-menu|dropdown-item|form-control|form-select|input-group|input-group-text|modal-dialog|modal-content|offcanvas|accordion-item|accordion-button|alert-(primary|secondary|success|danger|warning|info|light|dark)|badge-(primary|secondary|success|danger|warning|info|light|dark)|text-bg-(primary|secondary|success|danger|warning|info|light|dark)|spinner-(border|grow)|placeholder-glow|placeholder-wave)$/.test(
      className,
    ),
  );

  if (bootstrapMatches.length >= 3) {
    evidence.push({
      type: "medium",
      message: "Found multiple Bootstrap-specific class patterns",
    });
  } else if (bootstrapMatches.length === 2) {
    evidence.push({
      type: "weak",
      message: "Found a couple of Bootstrap-like class patterns",
    });
  }

  return {
    name: "Bootstrap",
    detected: evidence.length > 0,
    evidence,
  };
}
