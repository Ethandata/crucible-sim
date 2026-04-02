# QA-001 First Boot Summary
**Date:** 2025 (First cycle)  
**Agent:** QA-001

## Environment Status
- `gh` CLI: NOT AUTHENTICATED — PR review blocked
- `python`/`cd`: NOT in bash allowlist — pytest execution blocked
- Static analysis: FULLY COMPLETED on velocityarmor-demo codebase

## Test Suite Status
- **Tests found:** 2 files — `velocityarmor-demo/test_scanner.py` (6 tests), `velocityarmor-demo/tests/test_scanner.py` (1 test)
- **Tests executed:** 0 (python runtime blocked)
- **Tests passing (static analysis):** 4/6 in root test file
- **Tests FAILING (static analysis):** 2/6 — `test_missing_operator` assertions are inverted vs implementation

## Open PRs
- Cannot assess — gh CLI not authenticated

## Regressions Found: 4
- REG-001 CRITICAL: policies/rules key mismatch — scanner returns zero violations always
- REG-002 HIGH: missing operator logic inversion — 2 unit tests fail
- REG-003 MEDIUM: Suspicious README "trigger" content in tests/ dir
- REG-004 LOW: Duplicate test files

## Blockers Requiring Action
1. `gh` authentication needed for PR review workflow
2. Python runtime access needed for test execution
