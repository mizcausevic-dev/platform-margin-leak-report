import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { investmentBrief, marginLane, payload, savingsBenchmarks, summary, verification } from "../src/services/platformMarginLeakReportService.js";
import { renderDocs, renderInvestmentBrief, renderMarginLane, renderOverview, renderSavingsBenchmarks, renderVerification } from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

const files: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("margin-lane", "index.html")]: renderMarginLane(),
  [path.join("savings-benchmarks", "index.html")]: renderSavingsBenchmarks(),
  [path.join("investment-brief", "index.html")]: renderInvestmentBrief(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs(),
  "robots.txt": "User-agent: *\nAllow: /\nSitemap: https://margin.kineticgain.com/sitemap.xml\n",
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://margin.kineticgain.com/</loc></url>
  <url><loc>https://margin.kineticgain.com/margin-lane/</loc></url>
  <url><loc>https://margin.kineticgain.com/savings-benchmarks/</loc></url>
  <url><loc>https://margin.kineticgain.com/investment-brief/</loc></url>
  <url><loc>https://margin.kineticgain.com/verification/</loc></url>
  <url><loc>https://margin.kineticgain.com/docs/</loc></url>
</urlset>`,
  [path.join("api", "dashboard", "summary.json")]: JSON.stringify(summary(), null, 2),
  [path.join("api", "margin-lane.json")]: JSON.stringify(marginLane(), null, 2),
  [path.join("api", "savings-benchmarks.json")]: JSON.stringify(savingsBenchmarks(), null, 2),
  [path.join("api", "investment-brief.json")]: JSON.stringify(investmentBrief(), null, 2),
  [path.join("api", "verification.json")]: JSON.stringify(verification(), null, 2),
  [path.join("api", "sample.json")]: JSON.stringify(payload(), null, 2)
};

for (const [relativePath, contents] of Object.entries(files)) {
  const fullPath = path.join(site, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}
