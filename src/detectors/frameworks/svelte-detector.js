export function detectSvelte(pageData) {
  const evidence = [];

  const hasSvelteInternals = pageData.dom.html.includes("__svelte") || pageData.dom.html.includes("svelte-");
  const hasSvelteAttributes = pageData.dom.html.includes("data-svelte") || pageData.dom.html.includes("data-sveltekit");
  const hasSvelteKit = pageData.dom.html.includes("__SVELTEKIT_DATA__") || pageData.dom.html.includes("sveltekit:");
  const hasSvelteRuntime = pageData.scripts.content?.some((content) => content.includes("create_component") || content.includes("mount_component"));
  const hasSvelteInScripts = pageData.scripts.srcList.some((src) => src.toLowerCase().includes("svelte"));

  if (hasSvelteInternals) {
    evidence.push({
      type: "strong",
      message: "Found Svelte internals",
    });
  }

  if (hasSvelteAttributes) {
    evidence.push({
      type: "strong",
      message: "Found Svelte attributes",
    });
  }

  if (hasSvelteKit) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found SvelteKit",
    });
  }

  if (hasSvelteRuntime) {
    evidence.push({
      type: "medium",
      message: "Found Svelte runtime patterns",
    });
  }

  if (hasSvelteInScripts) {
    evidence.push({
      type: "weak",
      message: "Found Svelte-related script",
    });
  }

  return {
    name: "Svelte",
    type: "framework",
    evidence,
  };
}
