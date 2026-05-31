import type { PlatformMarginLeakExport } from "../types.js";

export const samplePlatformMarginLeak: PlatformMarginLeakExport = {
  snapshots: [
    {
      id: "web-estate",
      name: "Web Estate",
      scope: "WEB_PLATFORM",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      costPath: "hosting/cdn/analytics",
      owner: "WebOps director",
      annualRunRateUsd: 420000,
      marginExposureScore: 62,
      collectedAt: "2026-05-31T07:00:00Z"
    },
    {
      id: "identity-admin",
      name: "Identity Admin",
      scope: "IDENTITY_LAYER",
      riskStatus: "CRITICAL",
      snapshotStatus: "CURRENT",
      costPath: "access/tickets/approvals",
      owner: "Identity operations lead",
      annualRunRateUsd: 365000,
      marginExposureScore: 74,
      collectedAt: "2026-05-31T07:00:00Z"
    },
    {
      id: "rev-reporting",
      name: "Revenue Reporting",
      scope: "REVENUE_SYSTEM",
      riskStatus: "WATCH",
      snapshotStatus: "STALE",
      costPath: "attribution/board-reporting",
      owner: "RevOps analytics",
      annualRunRateUsd: 280000,
      marginExposureScore: 58,
      collectedAt: "2026-05-26T07:00:00Z"
    }
  ],
  leaks: [
    {
      id: "LEAK-11",
      snapshotId: "web-estate",
      resourcePath: "cdn-edge-cache",
      scope: "WEB_PLATFORM",
      leakFamily: "CloudSpend",
      status: "DEGRADED",
      expectedState: "right-sized edge and image optimization",
      observedState: "overprovisioned edge footprint with waste across low-value traffic",
      leakWindowHours: 72,
      estimatedLeakUsd: 98000,
      blocksExecutiveReadiness: true,
      note: "Traffic mix no longer matches the reserved edge profile."
    },
    {
      id: "LEAK-18",
      snapshotId: "web-estate",
      resourcePath: "analytics-stack",
      scope: "WEB_PLATFORM",
      leakFamily: "VendorOverlap",
      status: "CHANGED",
      expectedState: "one analytics vendor per function",
      observedState: "duplicate vendor overlap across analytics, SEO telemetry, and experiment replay",
      leakWindowHours: 44,
      estimatedLeakUsd: 64000,
      blocksExecutiveReadiness: true,
      note: "The stack can likely collapse into fewer paid tools."
    },
    {
      id: "LEAK-24",
      snapshotId: "identity-admin",
      resourcePath: "access-review-ticket-queue",
      scope: "IDENTITY_LAYER",
      leakFamily: "IdentityOps",
      status: "DEGRADED",
      expectedState: "automated access review routing",
      observedState: "manual access review and ownerless entitlement queue causing credential drift",
      leakWindowHours: 61,
      estimatedLeakUsd: 72000,
      blocksExecutiveReadiness: true,
      note: "Manual queue load is consuming high-trust operator time."
    },
    {
      id: "LEAK-31",
      snapshotId: "rev-reporting",
      resourcePath: "quarterly-board-pack",
      scope: "REVENUE_SYSTEM",
      leakFamily: "Reporting",
      status: "DEGRADED",
      expectedState: "board pack generated from trusted system metrics",
      observedState: "stale report stitched from manual spreadsheet and unclear benchmark sources",
      leakWindowHours: 96,
      estimatedLeakUsd: 41000,
      blocksExecutiveReadiness: true,
      note: "Leadership story weakens when the metrics chain is not trusted."
    },
    {
      id: "LEAK-37",
      snapshotId: "rev-reporting",
      resourcePath: "weekly-release-cutover",
      scope: "REVENUE_SYSTEM",
      leakFamily: "ReleaseFriction",
      status: "CHANGED",
      expectedState: "repeatable launch rail with preflight and rollback proof",
      observedState: "manual release handoff delay and rollback pain during reporting updates",
      leakWindowHours: 30,
      estimatedLeakUsd: 28000,
      blocksExecutiveReadiness: false,
      note: "The friction is not catastrophic, but it is costing margin."
    },
    {
      id: "LEAK-42",
      snapshotId: "identity-admin",
      resourcePath: "support-escalation-desk",
      scope: "IDENTITY_LAYER",
      leakFamily: "SupportLoad",
      status: "CHANGED",
      expectedState: "predictable queue with reusable playbooks",
      observedState: "manual triage and repeat issue load hiding the real cost of support overhead",
      leakWindowHours: 18,
      estimatedLeakUsd: 19000,
      blocksExecutiveReadiness: false,
      note: "This is a drag multiplier across the admin lane."
    }
  ]
};
