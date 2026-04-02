# Crucible AI — GitHub Actions CI Readiness
**Last Updated:** 2026-04-02T16:21:07Z
**Author:** DevOps-001
**Tasks:** DEVOPS-003 / DEVOPS-TASK-3 / DEVOPS-TASK-4

---

## CI Pipeline Status

### GitHub Actions: ENABLED ✅

| Field | Value |
|-------|-------|
| Workflow name | CI |
| Workflow file | `.github/workflows/ci.yml` |
| Workflow ID | 250889197 |
| State | **active** |
| Created | 2026-03-24T18:53:24Z |
| Badge URL | `https://github.com/Ethandata/crucible-sim/workflows/CI/badge.svg` |
| Total runs | 31 |
| Last run | 2026-03-30T18:55:27Z (run #31) |
| Last run result | ✅ **success** |
| Last commit | "Add cost spiral detector and validation study scaffold" |

**Recent CI run history (all passing):**
| Run # | Date | Commit Message | Result |
|-------|------|---------------|--------|
| 31 | 2026-03-30 | Add cost spiral detector and validation study scaffold | ✅ success |
| 30 | 2026-03-27 | Add report-driven submission flow and framework docs | ✅ success |
| 29 | 2026-03-27 | Upgrade Crucible with D8/D9, traces, scenarios, adapters, and reporting | ✅ success |
| 28 | 2026-03-25 | Update README.md | ✅ success |
| 27 | 2026-03-25 | Fix CLI: suppress verbose output when --json is used | ✅ success |

**CI URL for QA-001 reference:** https://github.com/Ethandata/crucible-sim/actions/runs/23762138849

---

## Branch Protection (main)

| Setting | Value |
|---------|-------|
| Branch protected | ❌ **NO** |
| Required status checks | None |
| Enforcement level | off |
| Required reviews | None |

> ⚠️ **RISK — HIGH:** `main` branch has NO protection rules. Any authenticated collaborator can push directly to main without CI passing or PR review. This is a governance gap that blocks the PR review process described in Cycle 2 directives.

**Recommended action:** Enable branch protection requiring:
1. CI to pass before merge
2. At least 1 PR review approval
3. No direct pushes to main

This requires founder action in GitHub repo settings (DevOps-001 cannot set this without write access).

---

## CI Badge — README Status

| Field | Value |
|-------|-------|
| Badge present in README | ❌ **NO** |
| Badge markdown to add | `![CI](https://github.com/Ethandata/crucible-sim/actions/workflows/ci.yml/badge.svg)` |

**Action required:** Add CI badge to top of README.md.
- Badge will show green ✅ since CI is currently passing
- Coordinate with Eng-001 before touching README to avoid merge conflicts
- DevOps-001 has queued this as a founder-review action (cannot push to main directly per policy)

---

## Secrets / Env Vars Needed for Pipeline

| Secret/Var | Purpose | Status |
|------------|---------|--------|
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions | ✅ Available automatically |
| `GH_TOKEN` | For `gh` CLI in agent context | ❌ **NOT SET** — blocks gh CLI for all agents |
| PyPI API token (if needed) | For `pip publish` | Not needed yet (git install only) |

---

## gh CLI Authentication — BLOCKING ❌

**Status:** gh CLI is not authenticated in the agent environment.
- `gh auth login` requires an interactive OAuth flow or PAT injection
- Neither CTO-001 nor QA-001 can use gh CLI (confirmed in Cycle 2 directive)
- This blocks: PR list, PR review, merge gate operations

**Resolution path:** Founder must provide a GitHub PAT with `repo` + `pull_requests` read/write scope and inject it as `GH_TOKEN` environment variable in the agent runtime.

---

## Python Test Environment (DEVOPS-TASK-4)

QA-001 can reference CI runs for test results without a local environment:

**Latest passing CI run:** https://github.com/Ethandata/crucible-sim/actions/runs/23762138849

**To run tests locally:**
```bash
# Install crucible-sim
pip install git+https://github.com/Ethandata/crucible-sim.git

# Run tests (from repo root)
git clone https://github.com/Ethandata/crucible-sim.git
cd crucible-sim
pip install -e ".[dev]"  # or pip install pytest
pytest tests/
```

**Test files available:**
- `tests/test_evaluate.py` — Core simulation tests
- `tests/test_scoring.py` — Durability scorer tests
- `tests/test_cli.py` — CLI integration tests
- `tests/test_examples.py` — Example agent tests
- `tests/test_readme.py` — API contract and file layout tests
- `tests/test_submission.py` — RunResult serialization tests

QA-001 should reference CI run #31 for current pass/fail status until local environment is available.
