export function calculateRiskScore(findings = []) {
  let score = 0;

  for (const f of findings) {
    if (f.type === "secret-risk") score += 50;
    else if (f.type === "infra-change") score += 30;
    else if (f.type === "dependency-change") score += 20;
    else score += 10;
  }

  return Math.min(score, 100);
}

export function classifyRisk(score) {
  if (score >= 70) return "CRITICAL";
  if (score >= 40) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}
