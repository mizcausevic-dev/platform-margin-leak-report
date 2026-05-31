import type { PostureReport } from "./types.js";

export function toSummary(report: PostureReport): string {
  return `${report.systems} systems, ${report.leaks} leaks, annual leak estimate $${report.annualLeakUsd.toLocaleString()}, margin score ${report.marginScore}`;
}

export function toMarkdown(report: PostureReport): string {
  const lines = [
    "# Platform Margin Leak Report",
    "",
    report.ok
      ? "Platform margin posture is board-safe."
      : "Platform margin posture needs work before the savings and investment story is board-ready.",
    "",
    `- Systems: ${report.systems}`,
    `- Current snapshots: ${report.currentSnapshots}`,
    `- Leaks: ${report.leaks}`,
    `- Blocking leaks: ${report.blockingLeaks}`,
    `- Critical leaks: ${report.criticalLeaks}`,
    `- Vendor leaks: ${report.vendorLeaks}`,
    `- Reporting leaks: ${report.reportLeaks}`,
    `- Annual leak estimate: $${report.annualLeakUsd.toLocaleString()}`,
    `- Margin score: ${report.marginScore}`,
    "",
    "## Findings",
    ""
  ];

  if (report.findingsList.length === 0) {
    lines.push("No findings.");
  } else {
    for (const finding of report.findingsList) {
      lines.push(`- [${finding.severity}] ${finding.code}: ${finding.message}`);
    }
  }

  return lines.join("\n");
}
