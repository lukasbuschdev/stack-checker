export function detectTailwind(pageData) {
  const evidence = [];

  const tailwindMatches = pageData.dom.classList.filter(
    (className) =>
      /^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|disabled:|dark:|group-hover:|peer-focus:|first:|last:|odd:|even:|motion-safe:|motion-reduce:|supports-\[.+\]:|aria-\[.+\]:|data-\[.+\]:|min-\[.+\]:|max-\[.+\]:)/.test(className) ||
      /^(from|via|to)-[a-z]+-\d{2,3}$/.test(className) ||
      /^(ring|ring-offset|divide|space-[xy])-[a-z0-9/-]+$/.test(className) ||
      /^(aspect|line-clamp|backdrop|object|place|justify-self|self|content|items|auto-cols|auto-rows)-/.test(className),
  );

  if (tailwindMatches.length >= 2) {
    evidence.push({
      type: "medium",
      message: "Found multiple Tailwind-specific utility classes",
    });
  } else if (tailwindMatches.length === 1) {
    evidence.push({
      type: "weak",
      message: "Found a Tailwind-specific utility class",
    });
  }

  const hasTailwindInScripts = pageData.scripts.srcList.some((src) => /tailwind/i.test(src));

  if (hasTailwindInScripts) {
    evidence.push({
      type: "medium",
      message: "Found Tailwind-related script URL",
    });
  }

  return {
    name: "Tailwind CSS",
    detected: evidence.some((item) => item.type === "strong" || item.type === "medium"),
    evidence,
  };
}
