import { calculateRiskScore, classifyRisk } from "./risk-scoring-engine.js";

export function detectIncident(findings) {
  const score = calculateRiskScore(findings);
  const level = classifyRisk(score);

  if (level === "CRITICAL") {
    return {
      incident: true,
      severity: level,
      action: "immediate-remediation"
    };
  }

  if (level === "HIGH") {
    return {
      incident: true,
      severity: level,
      action: "priority-fix"
    };
  }

  return {
    incident: false,
    severity: level,
    action: "monitor"
  };
}
