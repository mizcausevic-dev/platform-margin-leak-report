import { analyze } from "../analyze.js";
import { samplePlatformMarginLeak } from "../data/samplePlatformMarginLeak.js";

const report = analyze(samplePlatformMarginLeak, { now: "2026-05-31T08:00:00Z" });

export function summary() {
  const highFindings = report.findingsList.filter((item) => item.severity === "high").length;
  return {
    systems: report.systems,
    currentSnapshots: report.currentSnapshots,
    leaks: report.leaks,
    blockingLeaks: report.blockingLeaks,
    annualLeakUsd: report.annualLeakUsd,
    marginScore: report.marginScore,
    highFindings,
    recommendation:
      "Tighten cloud sizing, duplicate-vendor overlap, identity operations, reporting trust, and release drag before carrying the savings story into the board deck."
  };
}

export function marginLane() {
  return [
    {
      lane: "Cloud cost lane",
      owner: "Infrastructure finance",
      status: "red",
      relatedFindings: 2,
      focus: "Right-size edge and hosting spend against real traffic mix.",
      nextAction: "Re-cut reserved capacity and publish a savings memo.",
      note: "Overprovisioned edge and hosting choices are leaking margin quietly."
    },
    {
      lane: "Vendor overlap lane",
      owner: "Platform strategy",
      status: "red",
      relatedFindings: 1,
      focus: "Collapse redundant analytics and experiment vendors.",
      nextAction: "Present replace / retire recommendation with cost delta.",
      note: "Duplicate tooling is easier to cut than net-new engineering headcount."
    },
    {
      lane: "Identity ops lane",
      owner: "Identity operations lead",
      status: "red",
      relatedFindings: 2,
      focus: "Reduce manual queue load and ownerless access reviews.",
      nextAction: "Automate routing and retire ownerless entitlements.",
      note: "Manual identity work is a hidden platform tax."
    },
    {
      lane: "Board reporting lane",
      owner: "RevOps analytics",
      status: "yellow",
      relatedFindings: 2,
      focus: "Replace stitched spreadsheets with trusted board metrics.",
      nextAction: "Move the board pack onto one governed reporting path.",
      note: "Weak metrics trust undermines the investment story."
    }
  ];
}

export function savingsBenchmarks() {
  const order = { high: 0, medium: 1, low: 2, info: 3 } as const;
  return report.findingsList
    .map((finding) => ({
      ...finding,
      owner:
        finding.scope === "IDENTITY_LAYER"
          ? "Identity operations lead"
          : finding.scope === "REVENUE_SYSTEM"
            ? "RevOps analytics"
            : "Platform strategy"
    }))
    .sort((a, b) => order[a.severity] - order[b.severity] || a.code.localeCompare(b.code));
}

export function investmentBrief() {
  return [
    {
      packetId: "MLR-11",
      lane: "Cloud sizing",
      completenessScore: 62,
      status: "red",
      blocker: "Reserved spend still exceeds the current traffic and workload mix.",
      owner: "Infrastructure finance",
      decisionNote: "Savings are visible now if the cloud profile is recut before the next renewal window.",
      launchWindowHours: 96
    },
    {
      packetId: "MLR-18",
      lane: "Vendor overlap",
      completenessScore: 68,
      status: "red",
      blocker: "The replacement path is clear, but the migration plan is not priced yet.",
      owner: "Platform strategy",
      decisionNote: "The board can greenlight vendor consolidation if migration sequencing is attached.",
      launchWindowHours: 120
    },
    {
      packetId: "MLR-24",
      lane: "Identity overhead",
      completenessScore: 59,
      status: "red",
      blocker: "Manual queue load remains high and ownership is still fragmented.",
      owner: "Identity operations lead",
      decisionNote: "Automation investment can be justified as margin protection, not just security hygiene.",
      launchWindowHours: 72
    },
    {
      packetId: "MLR-31",
      lane: "Reporting trust",
      completenessScore: 71,
      status: "yellow",
      blocker: "The board pack still depends on stitched metrics and weak benchmark lineage.",
      owner: "RevOps analytics",
      decisionNote: "Numbers need to become more trustworthy before leadership leans on them for capital-allocation claims.",
      launchWindowHours: 48
    }
  ];
}

export function verification() {
  return [
    "Synthetic sample data only — no live vendor billing or tenant credentials are shipped.",
    "Savings claims come from modeled leak estimates, not hidden live finance systems.",
    "The report is read-only and built for executive review, not write-path administration.",
    "Every score and finding is reproducible from the exported margin packets.",
    "Board-facing conclusions stay bounded to the synthetic evidence shown in this repo."
  ];
}

export function payload() {
  return {
    generatedAt: report.generatedAt,
    summary: summary(),
    marginLane: marginLane(),
    savingsBenchmarks: savingsBenchmarks(),
    investmentBrief: investmentBrief(),
    verification: verification(),
    sample: samplePlatformMarginLeak
  };
}
