import { describe, expect, it } from "vitest";

import { investmentBrief, marginLane, payload, savingsBenchmarks, summary, verification } from "./platformMarginLeakReportService.js";

describe("platformMarginLeakReportService", () => {
  it("returns summary metrics", () => {
    expect(summary().systems).toBe(3);
    expect(summary().annualLeakUsd).toBeGreaterThan(0);
  });

  it("returns one margin-lane item per packet", () => {
    expect(marginLane()).toHaveLength(4);
  });

  it("sorts high findings first", () => {
    const findings = savingsBenchmarks();
    expect(findings[0]?.severity).toBe("high");
  });

  it("returns investment brief packets", () => {
    expect(investmentBrief()).toHaveLength(4);
  });

  it("returns verification claims and payload", () => {
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
