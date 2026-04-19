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

  let penalty = 0;

  if (lcp != null) {
    if (lcp > 4500) penalty += 30;
    else if (lcp > 3000) penalty += 20;
    else if (lcp > 1800) penalty += 8;
  }

  if (cls != null) {
    if (cls > 0.25) penalty += 20;
    else if (cls > 0.1) penalty += 10;
  }

  if (syncScripts > 3) penalty += 20;
  else if (syncScripts > 1) penalty += 10;
  else if (syncScripts === 1) penalty += 4;

  if (blockingCSS > 5) penalty += 10;
  else if (blockingCSS > 2) penalty += 6;
  else if (blockingCSS > 0) penalty += 3;

  if (jsSize > 200 * 1024) {
    const ratio = Math.min(1, jsSize / (1000 * 1024));
    penalty += 15 * ratio;
  }

  if (totalImageSize > 800 * 1024) {
    const ratio = Math.min(1, totalImageSize / (3 * 1024 * 1024));
    penalty += 15 * ratio;
  }

  if (largestImageSize > 300 * 1024) {
    const ratio = Math.min(1, largestImageSize / (800 * 1024));
    penalty += 10 * ratio;
  }

  if (imageCount > 100) penalty += 6;
  else if (imageCount > 50) penalty += 3;

  if (lcp != null && lcp > 3000) {
    let combined = 0;

    if (jsSize > 500 * 1024) combined += 6;
    if (totalImageSize > 1.5 * 1024 * 1024) combined += 6;
    if (syncScripts > 1) combined += 6;
    if (blockingCSS > 2) combined += 4;

    penalty += combined * 0.6;
  }

  if (lcp != null && lcp < 1800 && cls != null && cls < 0.1 && syncScripts === 0 && blockingCSS === 0) {
    score += 10;
  }

  score -= penalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateInteractionPerformanceScore(data) {
  let score = 100;
  let penalty = 0;

  const { boxShadowCount = 0, filterCount = 0, backdropFilterCount = 0, gradientCount = 0, animatedCount = 0, layoutAnimationCount = 0, gpuFriendlyAnimationCount = 0, domNodes = 1 } = data;
  const totalEffects = boxShadowCount + filterCount * 2 + backdropFilterCount * 3 + gradientCount * 0.2;
  const density = totalEffects / Math.max(domNodes, 50);
  const totalAnimations = Math.max(animatedCount, 1);
  const gpuRatio = gpuFriendlyAnimationCount / totalAnimations;

  if (density > 1.2) penalty += 15;
  else if (density > 0.8) penalty += 10;
  else if (density > 0.4) penalty += 5;

  if (animatedCount > 80) penalty += 10;
  else if (animatedCount > 40) penalty += 6;

  if (layoutAnimationCount > 20) penalty += 20;
  else if (layoutAnimationCount > 10) penalty += 12;
  else if (layoutAnimationCount > 0) penalty += 6;

  if (gpuRatio > 0.8) score += 10;
  else if (gpuRatio > 0.5) score += 5;

  if (layoutAnimationCount > 10 && density > 0.8 && animatedCount > 40) {
    penalty += 6;
  }

  if (animatedCount > 10 && layoutAnimationCount < animatedCount * 0.2 && gpuRatio > 0.6) {
    score += 6;
  }

  score -= penalty;
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

export function calculateAccessibilityScore(metrics) {
  let score = 100;

  const { totalElements = 1, totalButtons = 1, totalInputs = 1, hasMain, hasNav, unlabeledButtons, clickableDivs, inputsWithoutLabel, fakeButtons, inaccessibleInteractive, anchorWithoutHref, buttonsMissingType, elementsWithoutFocusStyle } = metrics;

  const WEIGHTS = {
    critical: 30,
    warning: 15,
    info: 5,
  };

  if (!hasMain && totalElements > 50) {
    score -= WEIGHTS.warning * 0.5;
  }

  if (!hasNav && totalElements > 100) {
    score -= WEIGHTS.info;
  }

  if (unlabeledButtons > 0) {
    const ratio = unlabeledButtons / totalButtons;
    const penalty = WEIGHTS.critical * Math.min(1, ratio);
    score -= penalty;
  }

  if (clickableDivs > 0) {
    const ratio = clickableDivs / totalElements;
    const penalty = WEIGHTS.warning * Math.min(1, ratio * 5);
    score -= penalty;
  }

  if (inputsWithoutLabel > 0) {
    const ratio = inputsWithoutLabel / totalInputs;
    const penalty = WEIGHTS.critical * Math.min(1, ratio);
    score -= penalty;
  }

  if (fakeButtons > 0) {
    const ratio = fakeButtons / totalElements;
    const penalty = WEIGHTS.warning * Math.min(1, ratio * 5);
    score -= penalty;
  }

  if (inaccessibleInteractive > 0) {
    const ratio = inaccessibleInteractive / totalElements;
    const penalty = WEIGHTS.critical * Math.min(1, ratio * 5);
    score -= penalty;
  }

  if (anchorWithoutHref > 0) {
    const ratio = anchorWithoutHref / totalElements;
    const penalty = WEIGHTS.warning * Math.min(1, ratio * 5);
    score -= penalty;
  }

  if (buttonsMissingType > 0) {
    const ratio = buttonsMissingType / totalButtons;
    const penalty = WEIGHTS.warning * Math.min(1, ratio);
    score -= penalty;
  }

  if (elementsWithoutFocusStyle > 0) {
    const ratio = elementsWithoutFocusStyle / totalElements;
    const penalty = WEIGHTS.warning * Math.min(1, ratio * 5);
    score -= penalty;
  }

  return Math.max(0, Math.round(score));
}

export function calculateOverallScore(scores) {
  if (!scores) return 0;

  const { loading = null, interaction = null, seo = null, accessibility = null } = scores;

  let totalWeight = 0;
  let weightedSum = 0;

  if (loading != null) {
    weightedSum += loading * 0.5;
    totalWeight += 0.5;
  }

  if (interaction != null) {
    weightedSum += interaction * 0.25;
    totalWeight += 0.25;
  }

  if (seo != null) {
    weightedSum += seo * 0.15;
    totalWeight += 0.15;
  }

  if (accessibility != null) {
    weightedSum += accessibility * 0.1;
    totalWeight += 0.1;
  }

  if (totalWeight === 0) return 0;

  return Math.round(weightedSum / totalWeight);
}
