import { readFileSync } from "node:fs";

import { analyze } from "./analyze.js";
import { toMarkdown, toSummary } from "./format.js";
import type { PlatformMarginLeakExport } from "./types.js";

function help() {
  console.log(`platform-margin-leak-report

Usage:
  npx platform-margin-leak-report <input.json> [--format summary|markdown|json]

Examples:
  npx platform-margin-leak-report fixtures/platform-margin-leak.json --format summary
  npx platform-margin-leak-report fixtures/platform-margin-leak-clean.json --format markdown
`);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  help();
  process.exit(0);
}

const inputPath = args[0];
const format = args.includes("--format") ? args[args.indexOf("--format") + 1] ?? "summary" : "summary";
const payload = JSON.parse(readFileSync(inputPath, "utf8")) as PlatformMarginLeakExport;
const report = analyze(payload);

switch (format) {
  case "json":
    console.log(JSON.stringify(report, null, 2));
    break;
  case "markdown":
    console.log(toMarkdown(report));
    break;
  default:
    console.log(toSummary(report));
    break;
}
