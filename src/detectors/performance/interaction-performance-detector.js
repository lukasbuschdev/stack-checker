import { calculateInteractionPerformanceScore } from "../../scoring/calculations";

export function detectInteractionPerformance(pageData) {
  const allElements = pageData.dom.elements || [];

  let animatedCount = 0;
  let expensiveAnimationCount = 0;
  let fixedCount = 0;
  let boxShadowCount = 0;
  let filterCount = 0;
  let backdropFilterCount = 0;
  let gpuFriendlyAnimationCount = 0;
  let layoutAnimationCount = 0;
  let gradientCount = 0;

  for (const el of allElements) {
    const style = el.computedStyle;
    if (!style) continue;

    const hasAnimation = style.animationName !== "none" || style.transitionDuration !== "0s";

    if (hasAnimation) {
      animatedCount++;

      const usesExpensiveProps = style.boxShadow !== "none" || style.filter !== "none" || style.backdropFilter !== "none";
      const transitionProps = style.transitionProperty || "";

      if (usesExpensiveProps) {
        expensiveAnimationCount++;
      }

      if (transitionProps.includes("all")) {
        layoutAnimationCount++;
      } else {
        if (transitionProps.includes("width") || transitionProps.includes("height") || transitionProps.includes("top") || transitionProps.includes("left") || transitionProps.includes("margin") || transitionProps.includes("padding")) {
          layoutAnimationCount++;
        }
      }

      if (transitionProps.includes("transform") || transitionProps.includes("opacity")) {
        gpuFriendlyAnimationCount++;
      }
    }

    if (style.backgroundImage && style.backgroundImage.includes("gradient")) {
      gradientCount++;
    }

    if (style.boxShadow !== "none") {
      boxShadowCount++;
    }

    if (style.filter !== "none") {
      filterCount++;
    }

    if (style.backdropFilter !== "none") {
      backdropFilterCount++;
    }

    if (style.position === "fixed") {
      fixedCount++;
    }
  }

  let hasReducedMotionSupport = false;
  let hoverRules = 0;
  let hasHoverMediaQuery = false;

  const stylesheets = pageData.dom.styleSheets || [];

  for (const sheet of stylesheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.media && rule.media.mediaText.includes("prefers-reduced-motion")) {
          hasReducedMotionSupport = true;
        }

        if (rule.selectorText && rule.selectorText.includes(":hover")) {
          hoverRules++;
        }

        if (rule.media && (rule.media.mediaText.includes("(hover: none)") || rule.media.mediaText.includes("(pointer: coarse)"))) {
          hasHoverMediaQuery = true;
        }
      }
    } catch (e) {}
  }

  const data = {
    animatedCount,
    expensiveAnimationCount,
    fixedCount,
    hasReducedMotionSupport,
    hoverRules,
    hasHoverMediaQuery,
    boxShadowCount,
    filterCount,
    backdropFilterCount,
    gpuFriendlyAnimationCount,
    layoutAnimationCount,
    gradientCount,
  };

  const { insights } = getInsights(data);
  const score = calculateInteractionPerformanceScore(data);

  return {
    name: "Interaction Performance",
    type: "interaction-performance",
    detected: true,
    score,
    insights,
    data,
  };
}

export function getInsights(data) {
  const evidence = [];
  let score = 100;

  const { animatedCount, expensiveAnimationCount, fixedCount, hasReducedMotionSupport, hoverRules, hasHoverMediaQuery, boxShadowCount, filterCount, backdropFilterCount, gpuFriendlyAnimationCount, layoutAnimationCount, gradientCount } = data;
  const totalExpensiveEffects = boxShadowCount + filterCount + backdropFilterCount;

  if (animatedCount > 40) {
    score -= 20;
    evidence.push({
      type: "medium",
      message: `High number of animated elements (${animatedCount}). This increases main thread workload and can cause frame drops. Reduce non-essential animations, especially those running continuously or on large elements.`,
    });
  } else if (animatedCount > 15) {
    score -= 10;
    evidence.push({
      type: "weak",
      message: `Multiple animations detected (${animatedCount}). Verify they are short, purposeful, and not running simultaneously across large sections of the page.`,
    });
  }

  if (expensiveAnimationCount > 10) {
    score -= 25;
    evidence.push({
      type: "strong",
      message: `Animations use paint-heavy properties (e.g. box-shadow, filter, backdrop-filter). These trigger expensive repaints. Replace with transform/opacity or limit usage to small elements.`,
    });
  } else if (expensiveAnimationCount > 3) {
    score -= 15;
    evidence.push({
      type: "medium",
      message: `Some animations rely on costly CSS properties. Check if they can be replaced with transform or opacity to improve rendering performance.`,
    });
  }

  if (hasReducedMotionSupport) {
    score += 5;
    evidence.push({
      type: "positive",
      message: `Supports prefers-reduced-motion. This improves accessibility and reduces unnecessary animations for users who opt out.`,
    });
  }

  if (hoverRules > 10 && !hasHoverMediaQuery) {
    score -= 15;
    evidence.push({
      type: "medium",
      message: `Hover interactions detected without mobile fallback. Touch devices cannot trigger :hover. Add alternatives using click, focus, or media queries like (hover: none).`,
    });
  }

  if (fixedCount > 8) {
    score -= 10;
    evidence.push({
      type: "weak",
      message: `Many fixed-position elements (${fixedCount}). This can increase repaint cost during scrolling. Limit fixed elements or simplify their styles (avoid shadows, filters).`,
    });
  }

  if (totalExpensiveEffects > 50) {
    score -= 10;
    evidence.push({
      type: "medium",
      message: `High number of heavy visual effects (${totalExpensiveEffects}) such as shadows, filters, or backdrop filters. These increase paint cost. Reduce usage or apply them only to small, isolated elements.`,
    });
  }

  if (layoutAnimationCount > 5) {
    score -= 15;
    evidence.push({
      type: "strong",
      message: `Animations are modifying layout properties (e.g. width, height, margin). This triggers layout recalculation and causes jank. Replace with transform (scale, translate) for smooth animations.`,
    });
  }

  if (gpuFriendlyAnimationCount > 0 && layoutAnimationCount === 0) {
    evidence.push({
      type: "good",
      message: `Animations use GPU-friendly properties (transform, opacity). This avoids layout recalculations and results in smoother performance.`,
    });
  }

  if (gradientCount > 30) {
    score -= 5;
    evidence.push({
      type: "weak",
      message: `Many gradient backgrounds detected (${gradientCount}). Large gradients increase paint cost, especially during scroll. Avoid applying them to large or frequently repainted areas.`,
    });
  }

  return {
    insights: evidence.map((item) => ({
      level: item.type === "strong" ? "critical" : item.type === "medium" ? "warning" : "good",
      message: item.message,
      source: "Interaction",
    })),
  };
}
