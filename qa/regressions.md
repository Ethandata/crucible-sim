# Crucible / VelocityArmor-Demo Regression Log
**Maintained by:** QA-001 (synced from CTO-001 canonical copy)  
**Last updated:** 2026-04-02  
**Source:** QA-001 static analysis + CTO-001 code review

---

## Active Regressions

### REG-001 — CRITICAL: `missing` operator logic inverted in `pa.py`
- **File:** `velocityarmor-demo/pa.py` → `check_violation()`
- **Status:** OPEN — blocks any release, blocks QA-TASK-1 PR gate
- **Assigned to:** Eng-001 (confirm semantics with founder first)
- **Description:** The `missing` operator is implemented as `return actual is None` — returns `True` when value is absent. However the unit test at `test_scanner.py::test_missing_operator` asserts:
  ```python
  check_violation("present_value", None, "missing") == True  # FAILS — returns False
  check_violation(None, None, "missing") == False            # FAILS — returns True
  ```
  The semantics are inverted: the test expects `missing` to mean "flag if value IS present" (a forbidden-field check), but the implementation returns True when value is absent (a required-field check). One of these is wrong. **The intended behavior must be confirmed before fixing.**
- **Law IV relevance:** If this scanner is used to certify Crucible benchmark results, an inverted operator silently passes violations. Fix before any demo or external use.
- **Fix options:**
  - Option A (flip implementation): `return actual is not None` — flags when value IS present (forbidden field)
  - Option B (flip test): Change test expectations to match current implementation (required-field semantics)
  - **Action required:** Eng-001 to confirm intended semantics with founder, then implement correct fix.

---

### REG-002 — HIGH: `~/rules.yaml` (home dir) has YAML syntax error — scanner crashes on it
- **File:** `~/rules.yaml` (home directory, NOT `velocityarmor-demo/rules.yaml`)
- **Status:** OPEN
- **Assigned to:** Eng-001
- **Description:** `sentinel.log` records: `CRITICAL - Fatal error: mapping values are not allowed here in "rules.yaml", line 3, column 3`. The home-dir `rules.yaml` uses a different schema (`rules:` key, `applies_to_resources` list) than the repo's `rules.yaml` (`policies:` key, `resource_type` string). These two files are diverged. If any script or CI job references the home-dir file, it will crash.
- **Fix:** Determine which `rules.yaml` is canonical. If `~/rules.yaml` is the newer version, update `pa.py` to use `rules:` key and `applies_to_resources` list matching. Document which file is authoritative.

---

### REG-003 — MEDIUM: Suspicious `# trigger` content in `velocityarmor-demo/README.md`
- **File:** `velocityarmor-demo/README.md`
- **Status:** OPEN — flagged per Law IV
- **Assigned to:** Eng-001 (origin investigation)
- **Description:** README.md contains only:
  ```
  # trigger
  trigger
  trigger
  trigger
  ```
  This is anomalous. Could be: (a) a CI webhook trigger artifact, (b) a leftover test manipulation marker, (c) accidental content. The README should describe the project.
- **Law IV relevance:** If this was placed intentionally to manipulate CI triggers or test outcomes, it is a violation.
- **Fix:** Founder/Eng-001 to confirm origin. If unintentional, replace with proper README. If intentional CI artifact, document why in a comment. If manipulation indicator, escalate immediately.

---

### REG-004 — LOW: Duplicate test files with divergent content
- **File:** `velocityarmor-demo/test_scanner.py` (6 tests) vs `velocityarmor-demo/tests/test_scanner.py` (3 tests)
- **Status:** OPEN
- **Assigned to:** Eng-001 (consolidation, after REG-001 fix)
- **Description:** Two test files exist for the same module with different test counts and slightly different assertions. CI workflow runs `pytest tests/test_scanner.py` (the 3-test version), which means 3 tests in the root file are never run in CI. The 3-test version is missing `test_missing_operator` — which is the test that would catch REG-001.
- **Fix:** Consolidate into one canonical file. Keep the more comprehensive root-level `test_scanner.py` (6 tests) and move to `tests/`. Update CI workflow path accordingly.

---

## Resolved Regressions

*(none yet)*

---

## Blocker Status
- `gh` CLI: not installed / not authenticated — PR review gate non-functional
- Python/pytest: not in bash allowlist — tests cannot be executed in agent environment
- Both blockers escalated to founder via CEO-001 per CTO-001 directive

---

## Notes
- `report.json` from last scanner run shows 20 LOW violations (tag checks only) and 0 CRITICAL/HIGH/MEDIUM. Given REG-001 operator logic issues, these results cannot be trusted as complete.
- Missing operator test plan drafted: `data/qa/missing_operator_tests.md` (QA-TASK-003 complete)
