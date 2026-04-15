export function scanMeta() {
  const metaTags = Array.from(document.querySelectorAll("meta"));
  const meta = {};

  metaTags.forEach((tag) => {
    const name = tag.getAttribute("name") || tag.getAttribute("property");
    const content = tag.getAttribute("content");

    if (name && content) {
      meta[name] = content;
    }
  });

  return {
    meta,
    generator: meta["generator"] || null,
    hasAstroGenerator: (meta["generator"] || "").toLowerCase().includes("astro"),
    hasNextGenerator: (meta["generator"] || "").toLowerCase().includes("next"),
    hasNuxtGenerator: (meta["generator"] || "").toLowerCase().includes("nuxt"),
    hasAstroGenerator: (meta["generator"] || "").toLowerCase().includes("astro"),
  };
}
