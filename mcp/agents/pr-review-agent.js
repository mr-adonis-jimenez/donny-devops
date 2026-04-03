export function buildPullRequestComment(payload) {
  const changedFiles = payload.changedFiles || [];

  const concerns = [];
  const wins = [];

  if (changedFiles.some((file) => file.startsWith(".github/workflows/"))) {
    wins.push("Workflow updates detected. Nice move—automation is where boring work goes to die.");
  }

  if (changedFiles.some((file) => file.includes("Dockerfile") || file.includes("docker"))) {
    concerns.push("Container-related changes found. Confirm pinned versions, non-root execution, and image size discipline.");
  }

  if (changedFiles.some((file) => file.endsWith(".tf"))) {
    concerns.push("Terraform changes found. Review plan output carefully before apply and verify least-privilege IAM scope.");
  }

  if (changedFiles.some((file) => file.includes("package.json") || file.includes("requirements.txt"))) {
    concerns.push("Dependency surface changed. Check lockfiles, vulnerability scan results, and reproducibility.");
  }

  if (wins.length === 0) {
    wins.push("Change set reviewed by the Donny DevOps agent.");
  }

  if (concerns.length === 0) {
    concerns.push("No obvious high-risk indicators from file paths alone. Still validate tests, secrets hygiene, and rollback readiness.");
  }

  return [
    "## Donny DevOps PR Agent",
    "",
    "### Highlights",
    ...wins.map((item) => `- ${item}`),
    "",
    "### Watch Items",
    ...concerns.map((item) => `- ${item}`),
    "",
    "### Operational Call",
    "- Keep the change set small, the blast radius smaller, and the rollback path obvious. Old-school discipline still wins."
  ].join("\n");
}
