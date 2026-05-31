import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { PlatformMarginLeakExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): PlatformMarginLeakExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as PlatformMarginLeakExport;

const NOW = "2026-05-31T08:00:00Z";

describe("analyze", () => {
  it("counts systems and margin leak families", () => {
    const report = analyze(fixture("platform-margin-leak.json"), { now: NOW });
    expect(report.systems).toBe(3);
    expect(report.currentSnapshots).toBe(2);
    expect(report.leaks).toBe(6);
    expect(report.blockingLeaks).toBe(4);
    expect(report.vendorLeaks).toBe(1);
    expect(report.reportLeaks).toBe(1);
    expect(report.annualLeakUsd).toBe(322000);
  });

  it("flags cloud and vendor issues as high", () => {
    const report = analyze(fixture("platform-margin-leak.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "overprovisioned-cloud-spend")?.severity).toBe("high");
    expect(report.findingsList.find((item) => item.code === "duplicate-vendor-stack")?.severity).toBe("high");
  });

  it("flags reporting and identity overhead gaps", () => {
    const report = analyze(fixture("platform-margin-leak.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "reporting-trust-gap")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "identity-ops-overhead")).toBeDefined();
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("platform-margin-leak-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("renders findings in markdown", () => {
    const markdown = toMarkdown(analyze(fixture("platform-margin-leak.json"), { now: NOW }));
    expect(markdown).toContain("Platform margin posture needs work");
    expect(markdown).toContain("overprovisioned-cloud-spend");
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("platform-margin-leak-clean.json"), { now: NOW });
    expect(toMarkdown(report)).toContain("Platform margin posture is board-safe");
    expect(toMarkdown(report)).toContain("No findings.");
    expect(toSummary(report)).toMatch(/^2 systems/);
  });
});
