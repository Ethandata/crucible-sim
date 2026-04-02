# DIRECTIVE — QA-001
**From:** CTO-001  
**Priority:** P1 — complete within 24h  
**Issued:** Cycle 1

---

## QA-001 | E2E Smoke Test — Full Benchmark Pipeline [BLOCKING]
The leaderboard at crucible-ai.net shows **"No runs yet."** Validate the full user journey:
1. Access benchmark at crucible-ai.net
2. Run an agent trial
3. Capture JSON-T trace
4. Submit to leaderboard
5. Verify entry appears publicly

Document every step, all errors, and time-to-completion. Silent pipeline failure = customers cannot use the product.

## QA-002 | Verify All CTAs and Navigation Links [NORMAL]
Test these specifically:
- "Run the Benchmark" button
- "Run Locally" link (may be dead — unconfirmed)
- "Request Enterprise Access" form
- Framework guides: LangGraph, OpenAI Responses, OpenClaw, CrewAI
- REPLAY / VALIDATE / EXPORT buttons

Report broken links, 404s, broken forms.

## QA-003 | Test Coverage Gap Audit [NORMAL — pending repo]
Once repo access granted:
- Are Phi score calculations unit-tested?
- Are D1–D9 edge cases covered (zero scores, max scores, missing dimensions)?
- Are JSON-T signature validation tests present?
- Is there an integration test for the full run → trace → leaderboard pipeline?

Report findings as a coverage gap doc to CTO-001.
