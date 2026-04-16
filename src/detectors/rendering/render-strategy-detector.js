export function detectRenderStrategy(pageData) {
  const evidence = [];

  let ssrScore = 0;
  let ssgScore = 0;
  let csrScore = 0;

  const html = pageData?.dom?.html || "";
  const tags = pageData?.dom?.tags || [];
  const bodyText = pageData?.dom?.bodyText || "";
  const scriptSrcs = pageData?.scripts?.srcList || [];

  const hasNextData = pageData?.scripts?.hasNextData || pageData?.globals?.hasNext || html.includes("__NEXT_DATA__") || scriptSrcs.some((src) => src.includes("_next"));
  const hasNuxtData = pageData?.scripts?.hasNuxtPayload || pageData?.globals?.hasNuxt || html.includes("__NUXT__") || html.includes("data-nuxt-data") || scriptSrcs.some((src) => src.includes("_nuxt"));
  const hasAngularMarkers = pageData?.dom?.hasNgVersion || pageData?.dom?.hasNgServerContext || (pageData?.dom?.angularScopedAttributes || []).length > 0 || html.includes("ng-version");
  const hasAngularServerContext = pageData?.dom?.hasNgServerContext;

  const normalizedBodyText = bodyText.replace(/\s+/g, " ").trim();
  const hasSomeBodyText = normalizedBodyText.length > 80;
  const hasMeaningfulBodyText = normalizedBodyText.length > 200;
  const customElementTags = tags.filter((tag) => tag.includes("-"));
  const hasManyCustomElements = customElementTags.length >= 5;
  const hasRootAppShell = html.includes("<app-root") || html.includes('id="root"') || html.includes('id="__next"') || html.includes('id="app"');

  if (hasNextData) {
    ssrScore += 55;
    evidence.push({
      type: "strong",
      message: "Found Next.js rendering markers",
    });
  }

  if (hasNuxtData) {
    ssrScore += 55;
    evidence.push({
      type: "strong",
      message: "Found Nuxt rendering markers",
    });
  }

  if (hasAngularServerContext) {
    ssrScore += 70;
    evidence.push({
      type: "strong",
      message: "Found Angular server rendering markers",
    });
  }

  if (hasAngularMarkers && hasMeaningfulBodyText && !hasRootAppShell && !hasAngularServerContext) {
    ssrScore += 10;
    evidence.push({
      type: "medium",
      message: "Angular markers with meaningful HTML suggest possible pre-rendering",
    });
  }

  if (hasAngularMarkers && !hasAngularServerContext) {
    csrScore += 20;
    evidence.push({
      type: "medium",
      message: "Angular detected without server rendering markers",
    });
  }

  if (hasMeaningfulBodyText) {
    evidence.push({
      type: "medium",
      message: "Content is already rendered in the DOM (post-load state)",
    });
  }

  if (hasMeaningfulBodyText && hasAngularServerContext) {
    ssrScore += 10;
  }

  if (pageData?.meta?.hasAstroGenerator) {
    ssgScore += 45;
    evidence.push({
      type: "strong",
      message: "Astro generator meta tag found",
    });
  }

  if (hasRootAppShell && !hasMeaningfulBodyText) {
    csrScore += 50;
    evidence.push({
      type: "strong",
      message: "App shell found with little meaningful initial content",
    });
  }

  if (hasManyCustomElements && !hasMeaningfulBodyText) {
    csrScore += 20;
    evidence.push({
      type: "medium",
      message: "Multiple custom elements found without much initial content",
    });
  }

  if (hasSomeBodyText && !hasAngularMarkers && !hasNextData && !hasNuxtData) {
    ssgScore += 20;
    evidence.push({
      type: "medium",
      message: "Static HTML content without framework markers",
    });
  }

  const scores = {
    SSR: ssrScore,
    SSG: ssgScore,
    CSR: csrScore,
  };

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topStrategy, topScore] = sortedScores[0];
  const [, secondScore] = sortedScores[1];

  let strategy = "Unknown";
  let confidence = 0;

  if (topScore > 0) {
    strategy = topStrategy;
    confidence = Math.min(100, Math.max(1, topScore - Math.floor(secondScore * 0.35)));
  }

  if (Math.abs(topScore - secondScore) < 15) {
    confidence *= 0.6;
  }

  confidence = Math.round(confidence);

  return {
    name: "Rendering Strategy",
    type: "rendering",
    detected: strategy !== "Unknown",
    strategy,
    confidence,
    evidence,
    scores,
  };
}
