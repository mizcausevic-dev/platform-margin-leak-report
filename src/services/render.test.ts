import { describe, expect, it } from "vitest";

import { renderDocs, renderInvestmentBrief, renderMarginLane, renderOverview, renderSavingsBenchmarks, renderVerification } from "./render.js";

describe("render", () => {
  it("renders overview copy", () => {
    expect(renderOverview()).toContain("Platform Margin Leak Report");
    expect(renderOverview()).toContain("margin score");
  });

  it("renders the margin route", () => {
    expect(renderMarginLane()).toContain("Margin Lane");
    expect(renderMarginLane()).toContain("Cloud cost lane");
  });

  it("renders docs copy", () => {
    expect(renderDocs()).toContain("/api/margin-lane");
    expect(renderDocs()).toContain("platform-margin-leak-report");
  });

  it("renders investment brief and verification", () => {
    expect(renderInvestmentBrief()).toContain("Investment Brief");
    expect(renderSavingsBenchmarks()).toContain("Savings Benchmarks");
    expect(renderVerification()).toContain("board-safe claims only");
  });
});
