import { investmentBrief, marginLane, savingsBenchmarks, summary } from "../src/services/platformMarginLeakReportService.js";

console.log("platform-margin-leak-report demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`${marginLane().length} margin lanes`);
console.log(`${savingsBenchmarks().length} benchmark findings`);
console.log(`${investmentBrief().length} investment brief packets`);
