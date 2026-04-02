# GitHub Repo Audit — `Ethandata/crucible-sim`
**Audited by:** CEO-001  
**Date:** 2026-04-02  
**Repo:** https://github.com/Ethandata/crucible-sim  
**Version:** 2.1.0  
**Language:** Python (158KB, 100%)  
**License:** MIT  

---

## EXECUTIVE SUMMARY

The repo is **solid and further along than most pre-revenue benchmarking tools**. The core simulation engine, D1–D9 scoring framework, CLI, scenario packs, and framework adapters are all present. The README is developer-grade and clear. This is a shippable product.

**Overall Grade: B+ / Ready for enterprise demo use with 4 targeted improvements.**

---

## STRENGTHS

### 1. Well-Defined Scoring Framework (D1–D9)
Nine durability dimensions are clearly named and described. The weighted harmonic Durability Index (Phi) is a credible, differentiated scoring mechanism. This is the core IP — it's good.

### 2. Production-Ready Package Structure
```
crucible/
  runner.py        (42KB — core sim loop, largest file, clearly the engine)
  environment.py   (15KB — market regimes, tasks, child agents)
  cli.py           (12KB — full CLI with evaluate, benchmark, replay, submit)
  scoring.py       (11KB — D1–D9 computation)
  reporting.py     (9KB — trace replay, reports, export)
  scenarios.py     (6KB — scenario packs)
  benchmark_agents.py (7KB — reference agents for comparison)
  adapters.py      (3KB — LangGraph, OpenAI Responses, CrewAI, OpenClaw)
  detectors.py     (5KB — cost spiral detection)
  + events, actions, jobs, validation, __init__
```
Proper `pyproject.toml`, `pip install git+...` works. This is installable today.

### 3. Framework Adapters Are a Smart Sales Hook
`wrap_langgraph_agent`, `wrap_openai_responses_agent` — these reduce friction to zero for teams already using those stacks. Sales team should lead with this.

### 4. Cost Spiral Detector as Wedge
The standalone `crucible cost-spiral --input spans.json` command is an excellent low-friction entry point. Teams with existing observability can try Crucible in 5 minutes without rebuilding their agent. This is a strong first-touch for enterprise sales.

### 5. Signed JSON-T Trace Format
Every run produces a signed trace artifact. This enables audit trails, which is directly relevant to enterprise procurement and security reviews.

### 6. Version 2.1 with Real Features
Adversarial scarcity tests, red-line disqualification, retrieval tax accounting, explicit think-time costs — these are real, differentiated benchmark capabilities.

---

## ISSUES & GAPS

### CRITICAL (must fix before enterprise sales)

**C1: Broken Doc Links in README**
README doc links reference local filesystem paths:
```
/Users/ethanklyce/Documents/New project/crucible-sim/docs/benchmark_methodology.md
```
These are absolute local paths — they break for every external visitor. Must be converted to relative GitHub paths:
```
./docs/benchmark_methodology.md
```
**Impact:** First impression killer. Any enterprise prospect clicking the docs link sees a 404. Fix is 5 minutes.

**C2: No PyPI Release**
Installation currently requires `pip install git+https://github.com/...`. No PyPI package exists. Enterprise developers expect `pip install crucible-sim`. Signals "pre-production" to procurement teams.
**Recommendation:** Publish to PyPI. This is a one-time 30-minute task.

**C3: Missing CONTRIBUTING.md / SECURITY.md**
Enterprise buyers doing vendor security review will look for these. Their absence is a yellow flag in procurement checklists.

### IMPORTANT (fix within 2 weeks)

**I1: Validation Study Is Theoretical, Not Empirical**
The `crucible validation-study` command exists, but the study shows `examples/validation_study_template.json` — it's a template, not real data. The README says "Crucible is trying to earn external validity, not claim it in advance." Honest, but it means there's no empirical data showing D-scores correlate with production outcomes.
**This is the #1 credibility gap for enterprise buyers.** Need to run the validation study against even 2-3 real agents and publish results.

**I2: No CI/CD Badge in README**
The `.github/` directory exists but there's no build/test status badge in the README. Enterprise buyers check this. A green CI badge is a trust signal.

**I3: Test Coverage Unknown**
5 test files exist (`test_evaluate.py`, `test_scoring.py`, `test_cli.py`, `test_examples.py`, `test_readme.py`, `test_submission.py`) — this is good. But no coverage % is shown. Add `pytest-cov` and report coverage in CI.

**I4: `detectors.py` Not Mentioned in README Architecture Section**
The file exists (5KB) but is omitted from the README architecture table. Minor inconsistency but signals the README may be slightly stale vs. actual code.

### MINOR (polish items)

**M1: Repo Description Misalignment**
Repo description says "Economic Autonomy Standard" but README headline says "Catch Cost Spiral Failures Before Deployment." The cost spiral framing is sharper and more sales-relevant. Align the repo description to match.

**M2: No Changelog / CHANGELOG.md**
v2.1.0 implies prior versions. What changed? Enterprise buyers want to see version history. A simple CHANGELOG.md adds professionalism.

**M3: No `requirements.txt` for Development**
`pyproject.toml` has test extras (`pytest`, `pytest-timeout`) but no dev requirements file for contributors. Minor friction for open source adoption.

**M4: Homepage in pyproject.toml Points to crucible-ai.net**
Good — this is correct alignment. ✓

---

## RECOMMENDATIONS — PRIORITY ORDER

| # | Action | Owner | Effort | Impact |
|---|--------|-------|--------|--------|
| 1 | Fix broken local doc links in README | CTO-001 / Founder | 5 min | Critical — first impression |
| 2 | Publish to PyPI (`pip install crucible-sim`) | CTO-001 | 30 min | High — credibility |
| 3 | Add CI badge + GitHub Actions workflow if not present | CTO-001 | 1 hr | Medium — trust signal |
| 4 | Add CONTRIBUTING.md + SECURITY.md | CTO-001 | 1 hr | Medium — enterprise procurement |
| 5 | Run validation study on 2-3 real agents, publish results | CTO-001 + founder | 1-2 days | HIGH — #1 sales proof point |
| 6 | Align repo description to "cost spiral" framing | Founder (GitHub settings) | 2 min | Low |
| 7 | Add CHANGELOG.md | CTO-001 | 30 min | Low-medium |

---

## COMPETITIVE POSITION ASSESSMENT

The D1–D9 framework, cost spiral detection, signed traces, and framework adapters put Crucible ahead of any publicly available agent benchmark tool I'm aware of. The main risk is not technical — it's **credibility**: without published validation data, enterprise buyers can't distinguish Crucible from a well-designed prototype. The validation study is the unlock.

---

## BOTTOM LINE FOR FOUNDER

**The repo is real, functional, and impressive.** Fix the broken doc links today (5 minutes). Publish to PyPI this week. Then prioritize running and publishing the validation study — that's what turns a great tool into a credible standard.
