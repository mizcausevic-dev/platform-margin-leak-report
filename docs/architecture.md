`platform-margin-leak-report` has two layers:

1. Analyzer / CLI
   - reads synthetic platform-margin snapshot packets
   - identifies cloud waste, duplicate-vendor overlap, identity overhead, release friction, support drag, and reporting trust gaps
   - emits one executive posture report

2. Dashboard / prerender surface
   - turns the same findings into margin-lane, savings-benchmark, and investment-brief views
   - serves HTML plus JSON payloads
   - can be exported as a static GitHub Pages site
