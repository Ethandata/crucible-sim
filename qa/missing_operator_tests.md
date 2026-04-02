# Missing Operator Test Plan
**Author:** QA-001  
**Date:** 2026-04-02  
**Status:** Draft — pending CTO-001 review  
**Task:** QA-TASK-003 (from CTO-001 Cycle 2 directives)  
**Target file:** `velocityarmor-demo/pa.py` → `check_violation()`  
**Implements:** Eng-001 to write these tests after REG-001 semantics are confirmed

---

## Context

`rules.yaml` defines policy rules using operators. The following three operators appear in `rules.yaml` but have **zero test coverage** in either `test_scanner.py` variant:

| Operator | Appears in rules.yaml | Tested? |
|---|---|---|
| `not_in` | Yes | ❌ No |
| `missing_or_invalid` | Yes | ❌ No |
| `ne` | Yes | ❌ No |
| `missing` | Yes | ✅ Yes (but inverted — REG-001) |
| `contains` | Yes | ✅ Yes |
| `equals` | Yes | ✅ Yes |

**Prerequisite:** REG-001 must be resolved (missing operator semantics confirmed) before these tests are implemented by Eng-001. The semantics of `missing_or_invalid` depend on what `missing` means.

---

## Assumed Semantics (to be confirmed by Eng-001 / founder)

Based on standard policy-scanner conventions:

| Operator | Meaning | Triggers violation when... |
|---|---|---|
| `missing` | Field is absent or None | `actual is None` (required-field check) |
| `not_in` | Value not in allowed set | `actual not in expected` |
| `missing_or_invalid` | Field absent OR not in allowed set | `actual is None or actual not in expected` |
| `ne` | Not equal | `actual != expected` |

> ⚠️ **If REG-001 resolves `missing` as a forbidden-field check** (`actual is not None`), then `missing_or_invalid` semantics must be revisited accordingly.

---

## Test Cases

### TC-001: `not_in` operator — value in allowed set (no violation)

```python
def test_not_in_value_present_in_set():
    """
    'not_in' should NOT trigger a violation when the actual value
    IS in the allowed/expected set.
    """
    result = check_violation("us-east-1", ["us-east-1", "us-west-2"], "not_in")
    assert result == False, (
        "Expected no violation: 'us-east-1' is in the allowed set"
    )
```

**Input:** `actual="us-east-1"`, `expected=["us-east-1", "us-west-2"]`, `operator="not_in"`  
**Expected:** `False` (no violation)  
**Rationale:** Value is within the permitted set — policy is satisfied.

---

### TC-002: `not_in` operator — value NOT in allowed set (violation)

```python
def test_not_in_value_absent_from_set():
    """
    'not_in' SHOULD trigger a violation when the actual value
    is NOT in the allowed/expected set.
    """
    result = check_violation("eu-central-1", ["us-east-1", "us-west-2"], "not_in")
    assert result == True, (
        "Expected violation: 'eu-central-1' is not in the allowed set"
    )
```

**Input:** `actual="eu-central-1"`, `expected=["us-east-1", "us-west-2"]`, `operator="not_in"`  
**Expected:** `True` (violation)  
**Rationale:** Value is outside permitted regions — policy violation.

---

### TC-003: `not_in` operator — None/missing value (violation)

```python
def test_not_in_none_value():
    """
    'not_in' with a None actual value should trigger a violation,
    since None is not in any non-None set.
    """
    result = check_violation(None, ["us-east-1", "us-west-2"], "not_in")
    assert result == True, (
        "Expected violation: None is not in the allowed set"
    )
```

**Input:** `actual=None`, `expected=["us-east-1", "us-west-2"]`, `operator="not_in"`  
**Expected:** `True` (violation)  
**Rationale:** A missing value cannot satisfy a set-membership requirement.

---

### TC-004: `missing_or_invalid` operator — value present AND valid (no violation)

```python
def test_missing_or_invalid_value_present_and_valid():
    """
    'missing_or_invalid' should NOT trigger a violation when value
    is present AND is in the valid set.
    """
    result = check_violation("ACTIVE", ["ACTIVE", "RUNNING"], "missing_or_invalid")
    assert result == False, (
        "Expected no violation: 'ACTIVE' is present and in the valid set"
    )
```

**Input:** `actual="ACTIVE"`, `expected=["ACTIVE", "RUNNING"]`, `operator="missing_or_invalid"`  
**Expected:** `False` (no violation)  
**Rationale:** Field is populated with a valid value — no problem.

---

### TC-005: `missing_or_invalid` operator — value present but INVALID (violation)

```python
def test_missing_or_invalid_value_present_but_invalid():
    """
    'missing_or_invalid' SHOULD trigger a violation when value
    is present but NOT in the valid set.
    """
    result = check_violation("UNKNOWN", ["ACTIVE", "RUNNING"], "missing_or_invalid")
    assert result == True, (
        "Expected violation: 'UNKNOWN' is present but not in the valid set"
    )
```

**Input:** `actual="UNKNOWN"`, `expected=["ACTIVE", "RUNNING"]`, `operator="missing_or_invalid"`  
**Expected:** `True` (violation)  
**Rationale:** Value is present but invalid — policy violated.

---

### TC-006: `missing_or_invalid` operator — value is None/missing (violation)

```python
def test_missing_or_invalid_value_absent():
    """
    'missing_or_invalid' SHOULD trigger a violation when value is None.
    """
    result = check_violation(None, ["ACTIVE", "RUNNING"], "missing_or_invalid")
    assert result == True, (
        "Expected violation: value is absent (None)"
    )
```

**Input:** `actual=None`, `expected=["ACTIVE", "RUNNING"]`, `operator="missing_or_invalid"`  
**Expected:** `True` (violation)  
**Rationale:** Missing field cannot satisfy a validity check.

---

### TC-007: `ne` operator — values are different (violation)

```python
def test_ne_values_differ():
    """
    'ne' (not-equal) SHOULD trigger a violation when actual != expected.
    This models a required exact-value check (e.g. encryption must be 'AES256').
    """
    result = check_violation("DES", "AES256", "ne")
    assert result == True, (
        "Expected violation: 'DES' != 'AES256'"
    )
```

**Input:** `actual="DES"`, `expected="AES256"`, `operator="ne"`  
**Expected:** `True` (violation)  
**Rationale:** Value does not match required setting — policy violated.

---

### TC-008: `ne` operator — values are equal (no violation)

```python
def test_ne_values_equal():
    """
    'ne' should NOT trigger a violation when actual == expected.
    """
    result = check_violation("AES256", "AES256", "ne")
    assert result == False, (
        "Expected no violation: 'AES256' == 'AES256'"
    )
```

**Input:** `actual="AES256"`, `expected="AES256"`, `operator="ne"`  
**Expected:** `False` (no violation)  
**Rationale:** Value matches required setting — policy satisfied.

---

### TC-009: `ne` operator — None actual value (violation)

```python
def test_ne_none_actual():
    """
    'ne' with a None actual should trigger a violation,
    since None != any non-None expected value.
    """
    result = check_violation(None, "AES256", "ne")
    assert result == True, (
        "Expected violation: None != 'AES256'"
    )
```

**Input:** `actual=None`, `expected="AES256"`, `operator="ne"`  
**Expected:** `True` (violation)  
**Rationale:** Missing value cannot satisfy an equality requirement.

---

## Edge Cases (bonus — lower priority)

### TC-010: `not_in` operator — empty allowed set

```python
def test_not_in_empty_set():
    """
    'not_in' with an empty expected set should always trigger a violation,
    since no value can be 'in' an empty set.
    """
    result = check_violation("any-value", [], "not_in")
    assert result == True, (
        "Expected violation: no values are permitted in an empty set"
    )
```

### TC-011: `ne` operator — both None

```python
def test_ne_both_none():
    """
    'ne' where both actual and expected are None.
    None == None, so no violation expected.
    Edge case: depends on implementation null-handling.
    """
    result = check_violation(None, None, "ne")
    assert result == False, (
        "Expected no violation: None == None"
    )
```

---

## Implementation Notes for Eng-001

1. **Add to:** `velocityarmor-demo/tests/test_scanner.py` (the canonical file, post REG-004 consolidation)
2. **Import:** `from pa import check_violation` (verify import path after consolidation)
3. **Ordering:** Add these after existing operator tests, grouped by operator
4. **Dependency:** TC-004 through TC-006 (`missing_or_invalid`) assume `missing` = required-field check. If REG-001 resolves as forbidden-field semantics, **these test expectations must be revisited**
5. **Law IV note:** These tests gate real scanner behavior. Assertions must reflect confirmed business logic, not assumptions. Get explicit sign-off from founder/CTO-001 on semantics before committing.

---

## Acceptance Criteria (for QA-001 sign-off)

- [ ] All 9 core test cases (TC-001 through TC-009) are present in `tests/test_scanner.py`
- [ ] Each test has a descriptive docstring explaining the semantic being tested
- [ ] All tests pass with `pytest tests/test_scanner.py`
- [ ] Semantics in test docstrings match code comments added to `pa.py` per QA-TASK-1 criterion (b)
- [ ] REG-001 resolution is documented before TC-004–TC-006 are finalized

---

*Generated by QA-001 | 2026-04-02 | CTO-001 review required before Eng-001 implementation*
