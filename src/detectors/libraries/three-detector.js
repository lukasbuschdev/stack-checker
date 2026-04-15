export function detectThree(pageData) {
  const evidence = [];

  const hasThreeGlobal = typeof window.THREE !== "undefined" && typeof window.THREE === "object";

  const hasThreeRuntime = pageData.scripts.content?.some((content) => content.includes("new THREE.Scene(") || content.includes("new THREE.Mesh(") || content.includes("new THREE.PerspectiveCamera("));

  const hasThreeScript = pageData.scripts.srcList.some((src) => /three(\.module)?(\.min)?\.js/i.test(src));

  const hasWebGLContext = pageData.scripts.content?.some((content) => content.includes("WebGLRenderer") || content.includes("THREE.WebGLRenderer"));

  if (hasThreeGlobal && hasThreeRuntime) {
    evidence.push({
      type: "strong",
      message: "Found Three.js global with runtime usage",
    });
  }

  if (hasThreeGlobal && hasThreeScript) {
    evidence.push({
      type: "strong",
      message: "Found Three.js global with script",
    });
  }

  if (hasThreeRuntime && hasWebGLContext) {
    evidence.push({
      type: "medium",
      message: "Found Three.js rendering patterns",
    });
  }

  return {
    name: "Three.js",
    type: "library",
    evidence,
  };
}
