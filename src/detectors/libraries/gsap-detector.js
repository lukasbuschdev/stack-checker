export function detectGSAP(pageData) {
  const evidence = [];

  const hasGSAPGlobal = typeof window.gsap !== "undefined" && typeof window.gsap === "object";

  const hasGSAPRuntime = pageData.scripts.content?.some((content) => content.includes("gsap.to(") || content.includes("gsap.from(") || content.includes("gsap.timeline("));

  const hasGSAPScript = pageData.scripts.srcList.some((src) => /gsap(\.min)?\.js/i.test(src));

  const hasLegacyGSAP = pageData.scripts.content?.some((content) => content.includes("TweenMax") || content.includes("TimelineMax"));

  if (hasGSAPGlobal && hasGSAPRuntime) {
    evidence.push({
      type: "strong",
      message: "Found GSAP global with animation usage",
    });
  }

  if (hasGSAPGlobal && hasGSAPScript) {
    evidence.push({
      type: "strong",
      message: "Found GSAP global with script",
    });
  }

  if (hasLegacyGSAP && hasGSAPScript) {
    evidence.push({
      type: "medium",
      message: "Found legacy GSAP usage with script",
    });
  }

  return {
    name: "GSAP",
    type: "library",
    evidence,
  };
}
