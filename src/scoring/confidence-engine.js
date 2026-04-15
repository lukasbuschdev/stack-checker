export function evaluateDetection(evidence = []) {
  let score = 0;
  let hasDecisive = false;

  const weights = {
    strong: 40,
    medium: 20,
    weak: 10,
  };

  for (const item of evidence) {
    score += weights[item.type] || 0;

    if (item.decisive) {
      hasDecisive = true;
    }
  }

  if (hasDecisive) {
    return {
      detected: true,
      confidence: 100,
    };
  }

  return {
    detected: score >= 30,
    confidence: Math.min(score, 100),
  };
}
