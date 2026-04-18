export function calculateLoadingPerformanceScore({ lcp, cls, jsSize, blockingCSS, syncScripts, totalImageSize, largestImageSize, imageCount }) {
  let score = 100;

  lcp = lcp ?? null;
  cls = cls ?? null;
  jsSize = jsSize ?? 0;
  blockingCSS = blockingCSS ?? 0;
  syncScripts = syncScripts ?? 0;
  totalImageSize = totalImageSize ?? 0;
  largestImageSize = largestImageSize ?? 0;
  imageCount = imageCount ?? 0;

  if (lcp != null) {
    if (lcp > 4500) score -= 30;
    else if (lcp > 3000) score -= 20;
    else if (lcp > 1800) score -= 8;
  }

  if (cls != null) {
    if (cls > 0.25) score -= 20;
    else if (cls > 0.1) score -= 10;
  }

  if (syncScripts > 2) score -= 25;
  else if (syncScripts > 0) score -= 15;

  if (blockingCSS > 3) score -= 10;
  else if (blockingCSS > 0) score -= 5;

  if (jsSize > 1000 * 1024) score -= 20;
  else if (jsSize > 500 * 1024) score -= 12;
  else if (jsSize > 200 * 1024) score -= 6;

  if (totalImageSize > 3 * 1024 * 1024) score -= 20;
  else if (totalImageSize > 1.5 * 1024 * 1024) score -= 10;
  else if (totalImageSize > 800 * 1024) score -= 5;

  if (largestImageSize > 600 * 1024) score -= 10;
  else if (largestImageSize > 300 * 1024) score -= 5;

  if (imageCount > 80) score -= 6;
  else if (imageCount > 40) score -= 3;

  if (lcp != null && lcp > 3000 && (syncScripts > 0 || blockingCSS > 0)) score -= 10;
  if (jsSize > 500 * 1024 && lcp != null && lcp > 2500) score -= 8;
  if (totalImageSize > 1.5 * 1024 * 1024 && lcp != null && lcp > 2500) score -= 8;
  if (largestImageSize > 400 * 1024 && lcp != null && lcp > 2500) score -= 6;
  if (lcp != null && lcp < 1800 && cls != null && cls < 0.1 && syncScripts === 0 && blockingCSS === 0) score += 6;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateInteractionPerformanceScore(data) {
  let score = 100;

  const { boxShadowCount, filterCount, backdropFilterCount, gradientCount, animatedCount, layoutAnimationCount, gpuFriendlyAnimationCount } = data;
  const totalExpensiveEffects = boxShadowCount + filterCount * 2 + backdropFilterCount * 3 + gradientCount * 0.2;
  const totalAnimations = animatedCount || 1;
  const gpuRatio = gpuFriendlyAnimationCount / totalAnimations;

  if (totalExpensiveEffects > 100) score -= 15;
  else if (totalExpensiveEffects > 60) score -= 10;
  else if (totalExpensiveEffects > 30) score -= 5;

  if (animatedCount > 60) score -= 10;
  else if (animatedCount > 30) score -= 5;

  if (layoutAnimationCount > 20) score -= 20;
  else if (layoutAnimationCount > 10) score -= 12;
  else if (layoutAnimationCount > 0) score -= 6;

  if (gpuRatio > 0.7) score += 8;
  else if (gpuRatio > 0.4) score += 4;

  if (layoutAnimationCount > 10 && totalExpensiveEffects > 60 && animatedCount > 30) score -= 8;
  if (animatedCount > 10 && layoutAnimationCount < animatedCount * 0.3) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateSeoScore({ title, description, h1Count, missingAlt, hasViewport, robots, structuredDataCount, internalLinksCount, externalLinksCount, hasCanonical, hasOG, hasTwitter, hasLang, isTitleAligned }) {
  let score = 100;

  if (robots?.includes("noindex")) score -= 40;
  if (!title) score -= 25;
  if (!description) score -= 20;

  if (h1Count === 0) score -= 20;
  else if (h1Count > 1) score -= 10;

  if (!hasViewport) score -= 15;
  if (!isTitleAligned) score -= 5;
  if (!hasCanonical) score -= 5;
  if (!hasLang) score -= 5;
  if (missingAlt > 0) score -= Math.min(15, missingAlt * 2);
  if (structuredDataCount === 0) score -= 5;
  if (!hasOG) score -= 3;
  if (!hasTwitter) score -= 2;
  if (internalLinksCount < 3) score -= 5;
  if (externalLinksCount === 0) score -= 3;
  if (!title && !description) score -= 10;
  if (!title || !description || h1Count === 0) score -= 10;

  if (title && description && h1Count === 1 && missingAlt === 0 && hasViewport && !robots?.includes("noindex")) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
