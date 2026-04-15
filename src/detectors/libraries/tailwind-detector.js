export function detectTailwind(pageData) {
  const evidence = [];

  const classes = pageData.dom.classList;

  const variantMatches = classes.filter((c) => /^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:|group-hover:|peer-focus:)/.test(c));
  const utilityMatches = classes.filter((c) => /^(bg|text|border|p|px|py|m|mx|my|w|h|min-w|min-h|max-w|max-h|rounded|shadow|z)-/.test(c));
  const arbitraryMatches = classes.filter((c) => /^(w|h|bg|text|p|m)-\[[^\]]+\]/.test(c));

  const hasTailwindCDN = pageData.scripts.srcList.some((src) => src.includes("cdn.tailwindcss.com"));
  const hasVariants = variantMatches.length >= 1;
  const hasUtilities = utilityMatches.length >= 3;
  const hasStrongUtilities = utilityMatches.length >= 6;
  const hasArbitrary = arbitraryMatches.length >= 1;

  if (hasVariants && hasUtilities) {
    evidence.push({
      type: "strong",
      message: "Found Tailwind variants with utility classes",
    });
  }

  if (hasStrongUtilities) {
    evidence.push({
      type: "strong",
      message: "Found large number of Tailwind utility classes",
    });
  }

  if (hasArbitrary) {
    evidence.push({
      type: "medium",
      message: "Found Tailwind arbitrary values",
    });
  }

  if (hasTailwindCDN) {
    evidence.push({
      type: "strong",
      message: "Found Tailwind CDN",
    });
  }

  return {
    name: "Tailwind CSS",
    type: "library",
    evidence,
  };
}
