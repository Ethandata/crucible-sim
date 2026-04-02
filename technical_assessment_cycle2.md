# CTO-001 Technical Assessment — Cycle 2
**Date:** 2026-04-02  
**Author:** CTO-001  
**Repos reviewed:** velocityarmor-demo (local), crucible-sim (Ethandata/crucible-sim via CEO-001 audit)

---

## Executive Summary

Two codebases are in scope. **crucible-sim** (the core benchmark engine) is structurally sound per CEO-001's audit — the scoring pipeline is clean and Law IV-compliant. **velocityarmor-demo** (the Terraform policy scanner) has 4 regressions including 1 CRITICAL operator logic bug that causes tests to fail. Neither codebase is currently blocked from development, but velocityarmor-demo cannot be released or demoed until REG-001 through REG-003 are resolved.

GitHub access is blocked (gh CLI not authenticated) — PR review gate is non-functional.

---

## Top 3 Technical Risks

### Risk 1 — CRITICAL: `missing` operator semantics undefined / tests fail
The `check_violation()` function in `pa.py` implements `missing` as "value is absent" (returns True when `actual is None`). The unit tests assert the opposite: `check_violation("present_value", None, "missing") == True` — treating `missing` as a forbidden-field check. These are mutually exclusive semantics. At least one of implementation or tests is wrong.

**Impact:** If used in any demo or certification context with incorrect behavior, this violates Law IV (never misrepresent benchmark results). The scanner silently passes or fails checks incorrectly.

**Status:** Blocked on semantic clarification from founder/Eng-001.

---

### Risk 2 — HIGH: Two diverged `rules.yaml` files, one with confirmed YAML syntax error
`~/rules.yaml` (home directory) uses schema `rules:` + `applies_to_resources: [list]` and has a documented YAML parse error in sentinel.log. `~/velocityarmor-demo/rules.yaml` uses `policies:` + `resource_type: string` and matches `pa.py`. These are incompatible. Any script or CI job pointing to the wrong file will crash silently.

**Impact:** Brittle CI, confusing for contributors, potential for silent scan failures.

---

### Risk 3 — MEDIUM: gh CLI not authenticated — zero PR visibility
Neither CTO-001 nor QA-001 can read open PRs, post review comments, or gate merges. The entire code review pipeline is blind. Any engineer could merge to main without review.

**Impact:** Engineering governance gap. Must resolve before any active development cycle.

---

## Crucible-Sim Status (from CEO-001 audit + QA-001 review)

| Component | Status | Notes |
|-----------|--------|-------|
| scoring.py | ✅ Clean | D1-D9 honest, no inflation |
| detectors.py | ✅ Clean | Cost spiral logic correct |
| runner.py | ✅ Clean | Score from SimulationState only, trace signing present |
| benchmark_agents.py | ✅ Clean | No self-preferencing |
| README links | 🔴 Broken | Absolute local paths — broken for all external users |
| docs/frameworks/ | 🔴 Empty | 4 linked docs don't exist — 404s for prospects |
| CI badge | 🟡 Missing | No passing-tests badge in README |
| PyPI listing | 🟡 Missing | Install via git+https only |

**Law IV status:** CLEAN. No score manipulation found in crucible-sim.

---

## VelocityArmor-Demo Status

| Item | Status |
|------|--------|
| pa.py core logic | 🟡 Partial — `missing` op semantics wrong |
| rules.yaml (repo) | ✅ Matches pa.py schema |
| rules.yaml (home dir) | 🔴 YAML syntax error, schema diverged |
| test_scanner.py (root, 6 tests) | 🔴 2 assertions fail (REG-001) |
| tests/test_scanner.py (3 tests) | ✅ All pass (doesn't test missing op) |
| README.md | 🔴 Contains only `# trigger\ntrigger\ntrigger\ntrigger` |
| CI workflow | 🟡 Runs 3-test version only — misses failing tests |
| report.json | 🟡 20 LOW violations — CRITICAL/HIGH/MEDIUM scan reliability unconfirmed |

---

## Immediate Actions Required

1. **Eng-001**: Confirm `missing` operator semantics → fix implementation or tests (REG-001)
2. **Eng-001**: Investigate and fix `velocityarmor-demo/README.md` trigger content (REG-003)
3. **Eng-001**: Fix broken README links in crucible-sim (from CEO-001 audit)
4. **Eng-001**: Create stub docs for `docs/frameworks/` in crucible-sim OR remove broken links
5. **QA-001**: Consolidate duplicate test files once Eng-001 confirms semantics (REG-004)
6. **DevOps-001**: Resolve gh CLI authentication — provide PAT or run `gh auth login`
7. **DevOps-001**: Add GitHub Actions CI badge to crucible-sim README
8. **CTO-001 → founder**: Request gh CLI authentication to restore PR review gate

---

## Uptime Note

No live benchmark endpoint has been verified this cycle. DevOps-001 has not reported uptime metrics. Benchmark baseline (D1-D9 scores with seed=42) has not been established. This must be addressed next cycle.
