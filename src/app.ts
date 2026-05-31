import express from "express";

import { investmentBrief, marginLane, payload, savingsBenchmarks, summary, verification } from "./services/platformMarginLeakReportService.js";
import {
  renderDocs,
  renderInvestmentBrief,
  renderMarginLane,
  renderOverview,
  renderSavingsBenchmarks,
  renderVerification
} from "./services/render.js";

export function createApp() {
  const app = express();

  app.get("/", (_req, res) => res.type("html").send(renderOverview()));
  app.get("/margin-lane", (_req, res) => res.type("html").send(renderMarginLane()));
  app.get("/savings-benchmarks", (_req, res) => res.type("html").send(renderSavingsBenchmarks()));
  app.get("/investment-brief", (_req, res) => res.type("html").send(renderInvestmentBrief()));
  app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
  app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

  app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
  app.get("/api/margin-lane", (_req, res) => res.json(marginLane()));
  app.get("/api/savings-benchmarks", (_req, res) => res.json(savingsBenchmarks()));
  app.get("/api/investment-brief", (_req, res) => res.json(investmentBrief()));
  app.get("/api/verification", (_req, res) => res.json(verification()));
  app.get("/api/sample", (_req, res) => res.json(payload()));

  return app;
}

const app = createApp();
export default app;

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT || 5532);
  app.listen(port, () => {
    console.log(`platform-margin-leak-report listening on http://127.0.0.1:${port}`);
  });
}
