export type ScopeKind =
  | "CLOUD_STACK"
  | "DATA_PIPELINE"
  | "WEB_PLATFORM"
  | "IDENTITY_LAYER"
  | "VENDOR_LAYER"
  | "REVENUE_SYSTEM";
export type RiskHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type LeakStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type LeakFamily =
  | "CloudSpend"
  | "VendorOverlap"
  | "Hosting"
  | "IdentityOps"
  | "ReleaseFriction"
  | "SupportLoad"
  | "AnalyticsTrust"
  | "Reporting";

export interface MarginSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  riskStatus: RiskHealth;
  snapshotStatus: SnapshotStatus;
  costPath: string;
  owner: string;
  annualRunRateUsd: number;
  marginExposureScore: number;
  collectedAt: string;
}

export interface MarginLeak {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  leakFamily: LeakFamily;
  status: LeakStatus;
  expectedState: string;
  observedState: string;
  leakWindowHours: number;
  estimatedLeakUsd: number;
  blocksExecutiveReadiness?: boolean;
  note?: string;
}

export interface PlatformMarginLeakExport {
  snapshots?: MarginSnapshot[];
  leaks?: MarginLeak[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-margin-snapshot"
  | "stale-margin-snapshot"
  | "overprovisioned-cloud-spend"
  | "duplicate-vendor-stack"
  | "release-friction-unpriced"
  | "identity-ops-overhead"
  | "support-load-hidden"
  | "reporting-trust-gap"
  | "high-cost-leak-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  leakFamily?: LeakFamily;
}

export interface PostureReport {
  generatedAt: string;
  systems: number;
  currentSnapshots: number;
  leaks: number;
  blockingLeaks: number;
  criticalLeaks: number;
  vendorLeaks: number;
  reportLeaks: number;
  annualLeakUsd: number;
  marginScore: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleLeakAfterHours?: number;
}
