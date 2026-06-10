// SPDX-License-Identifier: AGPL-3.0-or-later

import { investmentBrief, marginLane, payload, savingsBenchmarks, summary, verification } from "./platformMarginLeakReportService.js";

function layout(title: string, active: string, body: string) {
  const nav = [
    { href: "/", label: "Overview" },
    { href: "/margin-lane", label: "Margin Lane" },
    { href: "/savings-benchmarks", label: "Savings Benchmarks" },
    { href: "/investment-brief", label: "Investment Brief" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root{
        --bg:#070a0f; --panel:#0b1220; --line:rgba(120,255,170,.18); --line2:rgba(120,255,170,.10);
        --text:#e9f3ff; --muted:rgba(233,243,255,.72); --muted2:rgba(233,243,255,.55);
        --bert:#37ff8b; --bert2:#19c7ff; --warn:#ffcc66; --bad:#ff5c7a; --good:#37ff8b;
        --shadow:0 18px 60px rgba(0,0,0,.55);
        --mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --sans:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      *{box-sizing:border-box} html,body{height:100%}
      body{
        margin:0; font-family:var(--sans); color:var(--text);
        background:
          radial-gradient(1200px 600px at 20% -10%, rgba(55,255,139,.18), transparent 60%),
          radial-gradient(900px 520px at 90% 0%, rgba(25,199,255,.16), transparent 55%),
          radial-gradient(1000px 600px at 50% 110%, rgba(55,255,139,.10), transparent 60%),
          linear-gradient(180deg, #05070c 0%, #070a0f 35%, #05070c 100%);
      }
      .wrap{max-width:1280px; margin:0 auto; padding:24px 22px 80px}
      .topbar{
        display:flex; justify-content:space-between; align-items:flex-start; gap:14px;
        border-bottom:1px solid var(--line2); padding-bottom:14px; margin-bottom:22px;
        font-family:var(--mono); font-size:11px; letter-spacing:.16em; color:var(--muted); text-transform:uppercase;
      }
      .topbar .left{color:var(--bert)}
      .topbar .right{text-align:right}
      .topbar .right div{margin-bottom:4px}
      .herorow{display:grid; grid-template-columns:1.5fr .9fr; gap:18px}
      @media (max-width:1000px){.herorow{grid-template-columns:1fr}}
      .hero,.corr,.bluf{background:linear-gradient(180deg, rgba(11,18,32,.95), rgba(8,14,26,.92)); border:1px solid var(--line); box-shadow:var(--shadow)}
      .hero{border-radius:22px; padding:28px 28px 24px; border-top:2px solid var(--bert2)}
      .hero h1{font-size:58px; line-height:.96; margin:0 0 16px; font-weight:800; letter-spacing:-.5px}
      @media (max-width:700px){.hero h1{font-size:40px}}
      .hero p{color:var(--muted); font-size:15px; line-height:1.55; max-width:680px; margin:0 0 18px}
      .chiprow,.navrow,.footer-links{display:flex; flex-wrap:wrap; gap:8px}
      .meta-chip,.navchip{
        font-family:var(--mono); font-size:11px; color:var(--muted);
        padding:8px 12px; border-radius:999px; border:1px solid var(--line);
        background:rgba(6,10,18,.4); text-decoration:none;
      }
      .navchip.active{color:#071017;background:linear-gradient(135deg,var(--bert),var(--bert2));font-weight:700}
      .side{display:flex; flex-direction:column; gap:14px}
      .corr,.bluf{border-radius:14px; padding:16px 18px}
      .corr{border-left:4px solid var(--bert)}
      .bluf{border-left:4px solid var(--warn)}
      .corr .lbl,.bluf .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase}
      .corr .lbl{color:var(--bert)} .bluf .lbl{color:var(--warn)}
      .corr p,.bluf p,.ttbl td,.ttbl th{color:var(--muted); line-height:1.55}
      .section{margin-top:34px}
      .sh{display:flex; justify-content:space-between; align-items:baseline; gap:14px; padding-bottom:10px; border-bottom:1px solid var(--line2); margin-bottom:14px}
      .sh h2{margin:0; font-size:24px}
      .sh .note{font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.16em; text-transform:uppercase}
      .kpis{display:grid; grid-template-columns:repeat(6,1fr); gap:12px}
      @media (max-width:1100px){.kpis{grid-template-columns:repeat(3,1fr)}} @media (max-width:640px){.kpis{grid-template-columns:repeat(2,1fr)}}
      .kpi{border:1px solid var(--line); border-radius:14px; padding:14px; background:linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65))}
      .kpi .v{font-family:var(--mono); font-size:26px; font-weight:600; color:var(--bert2)}
      .kpi .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:6px}
      .kpi .h{font-size:12px; color:var(--muted); margin-top:8px}
      .stack,.board{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
      @media (max-width:1000px){.stack,.board{grid-template-columns:1fr}}
      .src,.pcard{border-radius:16px; padding:18px 20px; border:1px solid var(--line); background:linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65))}
      .src .src-name{font-family:var(--mono); font-size:11px; color:var(--bert); letter-spacing:.18em; text-transform:uppercase}
      .src .src-tit{margin:8px 0 6px; font-size:18px; font-weight:600}
      .depth-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:14px}
      @media (max-width:1100px){.depth-grid{grid-template-columns:repeat(2,1fr)}} @media (max-width:640px){.depth-grid{grid-template-columns:1fr}}
      .depth-card{border-radius:16px; padding:18px 20px; border:1px solid rgba(120,255,170,.16); background:linear-gradient(180deg, rgba(11,18,32,.88), rgba(8,14,26,.68)); min-height:188px}
      .depth-card .kicker{font-family:var(--mono); font-size:10px; color:var(--bert); letter-spacing:.16em; text-transform:uppercase; margin-bottom:12px}
      .depth-card h3{margin:0 0 10px; font-size:18px; line-height:1.25}
      .depth-card p{margin:0; color:var(--muted); font-size:13.5px; line-height:1.6}
      .ttbl{width:100%; border-collapse:separate; border-spacing:0; border:1px solid var(--line); border-radius:14px; overflow:hidden}
      .ttbl th,.ttbl td{padding:13px 14px; text-align:left; font-size:13.5px; vertical-align:top}
      .ttbl thead th{font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted2); border-bottom:1px solid var(--line); background:rgba(11,18,32,.5)}
      .st{font-family:var(--mono); font-size:10px; padding:4px 9px; border-radius:6px; letter-spacing:.1em; text-transform:uppercase; border:1px solid currentColor; display:inline-block}
      .red{color:var(--bad)} .yellow{color:var(--warn)} .green{color:var(--good)} .info{color:var(--bert2)}
      .pcard .ptop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px}
      .pcard .pnum{font-family:var(--mono); font-size:22px; font-weight:600; color:var(--bert)}
      .pcard .ppri{font-family:var(--mono); font-size:10px; padding:5px 10px; border-radius:999px; border:1px solid var(--line); color:var(--bert)}
      .pcard h3{margin:6px 0 8px; font-size:19px}
      .pcard .pdesc{font-size:13.5px; color:var(--muted); margin:0 0 14px}
      .pcard ul.check{list-style:none; padding:0; margin:0 0 14px}
      .pcard ul.check li{padding:6px 0; font-size:13.5px; color:var(--muted)}
      .footer{margin-top:30px; padding-top:14px; border-top:1px dashed var(--line2); display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; font-family:var(--mono); font-size:11px; color:var(--muted2)}
      a{color:inherit}
      code{font-family:var(--mono); font-size:12px; color:var(--bert2); background:rgba(25,199,255,.08); padding:1px 6px; border-radius:5px; border:1px solid rgba(25,199,255,.18)}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="topbar">
        <div class="left">Kinetic Gain · Platform Margin Leak Report</div>
        <div class="right">
          <div>board-ready executive intelligence · synthetic sample data only</div>
          <div>margin leakage · cost savings · vendor overlap · investment brief</div>
        </div>
      </div>
      <div class="herorow">
        <section class="hero">
          <div class="chiprow">
            <span class="meta-chip">Executive intelligence core</span>
            <span class="meta-chip">Platform margin scorecard</span>
            <span class="meta-chip">Synthetic sample data only</span>
          </div>
          <h1>Platform margin intelligence that shows where cost leaks, where to save, and what story belongs in the board deck.</h1>
          <p>This report turns cloud, vendor, identity, release, support, and reporting drag into one executive surface: annual leak estimates, benchmarked findings, and investment-ready packets.</p>
          <div class="navrow">
            ${nav.map((link) => `<a class="navchip${active === link.href ? " active" : ""}" href="${link.href}">${link.label}</a>`).join("")}
          </div>
        </section>
        <aside class="side">
          <div class="bluf">
            <div class="lbl">Commercial Front Door</div>
            <p><strong>Board-ready margin intelligence for executives, investors, and operating partners.</strong><br />One surface for hidden waste, savings opportunities, investment priority, and the CFO-safe narrative.</p>
          </div>
          <div class="corr">
            <div class="lbl">Proof Layer</div>
            <p><strong>Offline analyzer plus dashboard surface.</strong><br />This repo reads synthetic margin packets and turns them into score, savings benchmarks, investment briefs, and diligence-ready findings.</p>
          </div>
          <div class="corr">
            <div class="lbl">Why it matters</div>
            <p>Leaders looking for <strong>cost savings, margin leakage, platform benchmarking, vendor overlap, release drag, and board-ready infrastructure proof</strong> should see a real executive product, not generic FinOps copy.</p>
          </div>
        </aside>
      </div>
      ${body}
      ${renderProductDepth()}
      ${renderCommonPattern()}
      <div class="footer">
        <div>platform-margin-leak-report · synthetic sample data only</div>
        <div class="footer-links">
          <a class="meta-chip" href="https://github.com/mizcausevic-dev/platform-margin-leak-report">GitHub</a>
          <a class="meta-chip" href="https://portfolio.kineticgain.com/">Portfolio</a>
          <a class="meta-chip" href="https://suite.kineticgain.com/">Suite</a>
          <a class="meta-chip" href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
          <a class="meta-chip" href="https://kineticgain.com/">Kinetic Gain</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function renderProductDepth() {
  return `<section class="section">
        <div class="sh"><h2>Product depth</h2><div class="note">buyer value · technical proof · GTM story</div></div>
        <div class="depth-grid">
          <div class="depth-card">
            <div class="kicker">SaaS GTM analyst</div>
            <h3>Sell the cost story without flattening it into a generic FinOps page.</h3>
            <p>The report frames platform margin as an executive decision: remove waste, reduce vendor drag, fund the right remediation, and protect the board narrative.</p>
          </div>
          <div class="depth-card">
            <div class="kicker">Value architect</div>
            <h3>Translate operational drag into recoverable margin.</h3>
            <p>Cloud leakage, duplicate-vendor overlap, identity overhead, release friction, support drag, and reporting distrust are tied to owners, severity, annualized leak, and next action.</p>
          </div>
          <div class="depth-card">
            <div class="kicker">Product marketing</div>
            <h3>Make the buyer-readable promise explicit.</h3>
            <p>Executives and operating partners can quickly see where the company is exposed, where money can be saved, where investment belongs, and what story is defensible.</p>
          </div>
          <div class="depth-card">
            <div class="kicker">Technical proof</div>
            <h3>Back the narrative with inspectable implementation assets.</h3>
            <p>The repo ships TypeScript scoring, CLI output, Express routes, JSON APIs, static Pages, fixtures, screenshots, tests, smoke checks, and synthetic-data boundaries.</p>
          </div>
        </div>
      </section>`;
}

function renderCommonPattern() {
  return `<section class="section">
        <div class="sh"><h2>What these repos have in common</h2><div class="note">risk · owner · proof · next action</div></div>
        <div class="board">
          <article class="pcard">
            <div class="ptop"><div class="pnum">01</div><div class="ppri">Risk</div></div>
            <h3>Each product names the ambiguity.</h3>
            <p class="pdesc">The Kinetic Gain pattern turns cost, governance, reliability, revenue, or compliance drag into a named decision surface instead of a screenshot dump.</p>
          </article>
          <article class="pcard">
            <div class="ptop"><div class="pnum">02</div><div class="ppri">Proof</div></div>
            <h3>The public artifact is backed by implementation evidence.</h3>
            <p class="pdesc">Routes, APIs, CLI output, fixtures, docs, screenshots, and validation commands make the claim reviewable for technical and non-technical readers.</p>
          </article>
          <article class="pcard">
            <div class="ptop"><div class="pnum">03</div><div class="ppri">Action</div></div>
            <h3>The next move is visible.</h3>
            <p class="pdesc">Every lane resolves into owner, severity, blocker, recommendation, and executive narrative so the surface supports a decision, not just discovery.</p>
          </article>
        </div>
      </section>`;
}

function severityClass(value: string) {
  if (value === "high" || value === "red") return "red";
  if (value === "medium" || value === "yellow") return "yellow";
  if (value === "green" || value === "low") return "green";
  return "info";
}

export function renderOverview() {
  const metrics = summary();
  return layout(
    "Platform Margin Leak Report",
    "/",
    `<section class="section">
        <div class="sh"><h2>Executive Snapshot</h2><div class="note">score · annual leak · blockers</div></div>
        <div class="kpis">
          <div class="kpi"><div class="v">${metrics.marginScore}</div><div class="lbl">margin score</div><div class="h">Rollup score for cost leakage, savings proof, and executive readiness.</div></div>
          <div class="kpi"><div class="v">${metrics.systems}</div><div class="lbl">systems</div><div class="h">Platform systems modeled in the executive margin view.</div></div>
          <div class="kpi"><div class="v">${metrics.currentSnapshots}</div><div class="lbl">current</div><div class="h">Snapshots fresh enough to support the board and operating-partner story.</div></div>
          <div class="kpi"><div class="v">${metrics.leaks}</div><div class="lbl">leaks</div><div class="h">Observed margin leaks across cloud, vendors, identity, release, and reporting.</div></div>
          <div class="kpi"><div class="v">${metrics.blockingLeaks}</div><div class="lbl">blocking</div><div class="h">Leaks that materially weaken the savings and investment narrative.</div></div>
          <div class="kpi"><div class="v">$${Math.round(metrics.annualLeakUsd / 1000)}k</div><div class="lbl">annual leak</div><div class="h">Modeled annual leakage still left on the table.</div></div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>What leaders need</h2><div class="note">save · invest · explain</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">where to save</div><div class="src-tit">Keep the highest-value margin leaks visible</div><p>${metrics.recommendation}</p></div>
          <div class="src"><div class="src-name">where to invest</div><div class="src-tit">Price technical drag against CFO and CEO outcomes</div><p>Cloud waste, duplicate tooling, identity overhead, and reporting trust now sit inside one executive scoring surface.</p></div>
          <div class="src"><div class="src-name">board story</div><div class="src-tit">Move from cost complaints to decision-ready packets</div><p>Every lane resolves into benchmarks, an investment brief, and a clear replacement or remediation move.</p></div>
        </div>
      </section>`
  );
}

export function renderMarginLane() {
  return layout(
    "Platform Margin Leak Report — Margin Lane",
    "/margin-lane",
    `<section class="section">
        <div class="sh"><h2>Margin Lane</h2><div class="note">owner · leak · next action</div></div>
        <table class="ttbl">
          <thead><tr><th>Lane</th><th>Owner</th><th>Status</th><th>Related findings</th><th>Focus</th><th>Next action</th></tr></thead>
          <tbody>
            ${marginLane().map((lane) => `<tr><td><b>${lane.lane}</b><br />${lane.note}</td><td>${lane.owner}</td><td><span class="st ${severityClass(lane.status)}">${lane.status}</span></td><td>${lane.relatedFindings}</td><td>${lane.focus}</td><td>${lane.nextAction}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderSavingsBenchmarks() {
  return layout(
    "Platform Margin Leak Report — Savings Benchmarks",
    "/savings-benchmarks",
    `<section class="section">
        <div class="sh"><h2>Savings Benchmarks</h2><div class="note">severity · owner · executive subject</div></div>
        <table class="ttbl">
          <thead><tr><th>Leak</th><th>Owner</th><th>Leak family</th><th>Subject</th><th>Message</th></tr></thead>
          <tbody>
            ${savingsBenchmarks().map((finding) => `<tr><td><span class="st ${severityClass(finding.severity)}">${finding.severity}</span><br /><b>${finding.code}</b></td><td>${finding.owner}</td><td>${finding.leakFamily ?? "—"}</td><td>${finding.subjectName ?? finding.subject}</td><td>${finding.message}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderInvestmentBrief() {
  return layout(
    "Platform Margin Leak Report — Investment Brief",
    "/investment-brief",
    `<section class="section">
        <div class="sh"><h2>Investment Brief</h2><div class="note">packet readiness · blocker · window</div></div>
        <div class="board">
          ${investmentBrief().map((packet) => `<article class="pcard">
            <div class="ptop"><div class="pnum">${packet.completenessScore}%</div><div class="ppri">${packet.owner}</div></div>
            <h3>${packet.lane}</h3>
            <p class="pdesc">${packet.decisionNote}</p>
            <ul class="check">
              <li>${packet.blocker}</li>
              <li>${packet.launchWindowHours} hours to the next decision checkpoint</li>
              <li>Status: <span class="st ${severityClass(packet.status)}">${packet.status}</span></li>
            </ul>
            <div><code>${packet.packetId}</code></div>
          </article>`).join("")}
        </div>
      </section>`
  );
}

export function renderVerification() {
  return layout(
    "Platform Margin Leak Report — Verification",
    "/verification",
    `<section class="section">
        <div class="sh"><h2>Verification</h2><div class="note">board-safe claims only</div></div>
        <div class="stack">
          ${verification().map((item, index) => `<div class="src"><div class="src-name">verification ${index + 1}</div><div class="src-tit">${item}</div><p>This surface stays honest about offline exports, synthetic sample data, and board-ready platform margin posture.</p></div>`).join("")}
        </div>
      </section>`
  );
}

export function renderDocs() {
  return layout(
    "Platform Margin Leak Report — Docs",
    "/docs",
    `<section class="section">
        <div class="sh"><h2>Docs</h2><div class="note">routes · cli · api</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">routes</div><div class="src-tit">Public control surface</div><p><code>/</code>, <code>/margin-lane</code>, <code>/savings-benchmarks</code>, <code>/investment-brief</code>, <code>/verification</code>, <code>/docs</code></p></div>
          <div class="src"><div class="src-name">api</div><div class="src-tit">Structured payloads</div><p><code>/api/dashboard/summary</code>, <code>/api/margin-lane</code>, <code>/api/savings-benchmarks</code>, <code>/api/investment-brief</code>, <code>/api/verification</code>, <code>/api/sample</code></p></div>
          <div class="src"><div class="src-name">cli</div><div class="src-tit">Offline margin analysis</div><p><code>npx platform-margin-leak-report fixtures/platform-margin-leak-clean.json --format summary</code> renders the same posture the dashboard exposes.</p></div>
        </div>
      </section>`
  );
}

export function renderSample() {
  return JSON.stringify(payload(), null, 2);
}
