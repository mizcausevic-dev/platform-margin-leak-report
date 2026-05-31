import type { Finding, MarginSnapshot, PlatformMarginLeakExport, PostureOptions, PostureReport } from "./types.js";

function isCurrent(snapshot: MarginSnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: PlatformMarginLeakExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleLeakAfterHours = options.staleLeakAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const leaks = payload.leaks ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-margin-snapshot",
      severity: "high",
      message: "No current platform-margin snapshot is available for executive review.",
      subject: "margin-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-margin-snapshot",
        severity: snapshot.riskStatus === "CRITICAL" ? "high" : "medium",
        message: `Margin snapshot for "${snapshot.name}" is stale and should not anchor a board savings narrative without refresh.`,
        subject: snapshot.id,
        subjectName: snapshot.costPath,
        scope: snapshot.scope
      });
    }
  }

  for (const leak of leaks) {
    const observed = leak.observedState.toLowerCase();

    if (leak.leakFamily === "CloudSpend" && includesAny(observed, ["overprovisioned", "idle", "unbounded autoscale", "waste"])) {
      findingsList.push({
        code: "overprovisioned-cloud-spend",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Cloud spend on "${leak.resourcePath}" is overprovisioned and weakening the savings case.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if (leak.leakFamily === "VendorOverlap" && includesAny(observed, ["duplicate vendor", "overlap", "same capability", "redundant contract"])) {
      findingsList.push({
        code: "duplicate-vendor-stack",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Vendor overlap on "${leak.resourcePath}" suggests replaceable cost without clear differentiated value.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if (leak.leakFamily === "ReleaseFriction" && includesAny(observed, ["manual release", "handoff delay", "rollback pain", "freeze drag"])) {
      findingsList.push({
        code: "release-friction-unpriced",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Release friction on "${leak.resourcePath}" is consuming margin but is not priced into the operating story.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if (leak.leakFamily === "IdentityOps" && includesAny(observed, ["manual access", "ticket queue", "ownerless entitlement", "credential drift"])) {
      findingsList.push({
        code: "identity-ops-overhead",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Identity operations on "${leak.resourcePath}" are creating manual overhead and avoidable drag.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if (leak.leakFamily === "SupportLoad" && includesAny(observed, ["manual triage", "support queue", "incident churn", "repeat issue"])) {
      findingsList.push({
        code: "support-load-hidden",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Support load on "${leak.resourcePath}" is hiding real margin leakage behind operational busywork.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if ((leak.leakFamily === "AnalyticsTrust" || leak.leakFamily === "Reporting") && includesAny(observed, ["stale report", "untrusted numbers", "manual spreadsheet", "unclear benchmark"])) {
      findingsList.push({
        code: "reporting-trust-gap",
        severity: leak.blocksExecutiveReadiness ? "high" : "medium",
        message: `Reporting trust is too weak on "${leak.resourcePath}" to support confident savings or investment decisions.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }

    if (leak.leakWindowHours > staleLeakAfterHours) {
      findingsList.push({
        code: "high-cost-leak-window",
        severity: leak.leakWindowHours > staleLeakAfterHours * 2 ? "medium" : "low",
        message: `Leak on "${leak.resourcePath}" has remained open for ${leak.leakWindowHours} hours.`,
        subject: leak.id,
        subjectName: leak.resourcePath,
        scope: leak.scope,
        leakFamily: leak.leakFamily
      });
    }
  }

  const blockingLeaks = leaks.filter((leak) => leak.blocksExecutiveReadiness).length;
  const criticalLeaks = leaks.filter((leak) => leak.status === "DEGRADED").length;
  const vendorLeaks = leaks.filter((leak) => leak.leakFamily === "VendorOverlap").length;
  const reportLeaks = leaks.filter((leak) => leak.leakFamily === "AnalyticsTrust" || leak.leakFamily === "Reporting").length;
  const annualLeakUsd = leaks.reduce((sum, leak) => sum + leak.estimatedLeakUsd, 0);
  const avgExposure = snapshots.length > 0 ? snapshots.reduce((sum, snapshot) => sum + snapshot.marginExposureScore, 0) / snapshots.length : 100;
  const marginPenalty = blockingLeaks * 6 + findingsList.filter((item) => item.severity === "high").length * 4;
  const marginScore = Math.max(0, Math.round(100 - avgExposure / 2 - marginPenalty));
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    systems: snapshots.length,
    currentSnapshots,
    leaks: leaks.length,
    blockingLeaks,
    criticalLeaks,
    vendorLeaks,
    reportLeaks,
    annualLeakUsd,
    marginScore,
    findingsList,
    ok
  };
}
