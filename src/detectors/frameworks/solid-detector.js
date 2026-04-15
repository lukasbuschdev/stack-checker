export function detectSolid(pageData) {
  const evidence = [];

  const hasSolidRoot = pageData.dom.html.includes("data-hk") || pageData.dom.html.includes("data-solid");
  const hasSolidRuntime = pageData.scripts.content?.some((content) => content.includes("createSignal") || content.includes("createEffect") || content.includes("insert("));
  const hasSolidDevtools = !!window.__SOLID_DEVTOOLS_GLOBAL_HOOK__;
  const hasSolidInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("solid"));

  if (hasSolidRoot) {
    evidence.push({
      type: "medium",
      message: "Found SolidJS DOM markers",
    });
  }

  if (hasSolidRuntime) {
    evidence.push({
      type: "medium",
      message: "Found SolidJS reactive primitives",
    });
  }

  if (hasSolidDevtools) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Solid DevTools hook",
    });
  }

  if (hasSolidInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Solid-related script",
    });
  }

  return {
    name: "Solid",
    type: "framework",
    evidence,
  };
}
