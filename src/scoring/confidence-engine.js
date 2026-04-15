export function evaluateDetection(evidence = []) {
  const weights = {
    strong: 50,
    medium: 25,
    weak: 10,
  };

  let score = 0;
  let strongCount = 0;
  let mediumCount = 0;
  let weakCount = 0;

  for (const item of evidence) {
    score += weights[item.type] || 0;

    if (item.type === "strong") strongCount++;
    if (item.type === "medium") mediumCount++;
    if (item.type === "weak") weakCount++;
  }

  const confidence = Math.min(score, 100);

  const detected = strongCount > 0 || mediumCount > 0 || weakCount >= 2;

  return {
    detected,
    confidence,
  };
}
