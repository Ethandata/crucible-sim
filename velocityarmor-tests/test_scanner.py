import pytest
import sys
import os
import json
import subprocess
import tempfile

# FORCE IMPORT PATH: Look one directory up for pa.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from pa import check_violation, get_nested_value
except ImportError:
    print(f"DEBUG: Current directory: {os.getcwd()}")
    print(f"DEBUG: sys.path: {sys.path}")
    raise


# ─────────────────────────────────────────────
# Unit Tests: get_nested_value
# ─────────────────────────────────────────────

def test_dot_notation_extraction():
    """Verify get_nested_value can dig through JSON layers (from root test_scanner.py)"""
    mock_data = {
        "values": {
            "instance_type": "t3.micro",
            "network": {"vpc_id": "vpc-123"}
        }
    }
    assert get_nested_value(mock_data, "values.instance_type") == "t3.micro"
    assert get_nested_value(mock_data, "values.network.vpc_id") == "vpc-123"
    assert get_nested_value(mock_data, "non.existent.path") is None

def test_dot_notation():
    """Verify we can dig into the Terraform plan structure (from tests/test_scanner.py)"""
    mock_data = {"values": {"instance_type": "t3.micro"}}
    assert get_nested_value(mock_data, "values.instance_type") == "t3.micro"


# ─────────────────────────────────────────────
# Unit Tests: check_violation operators
# ─────────────────────────────────────────────

def test_equality_operator():
    """Test standard 'eq' logic"""
    # No violation: value matches expected (t3.micro == t3.micro, so eq is False = no violation)
    assert check_violation("t3.micro", "t3.micro", "eq") == False
    # Violation: value does NOT match expected (m5.large != t3.micro)
    assert check_violation("m5.large", "t3.micro", "eq") == True

def test_violation_logic():
    """Verify that an incorrect instance type triggers a violation (from tests/test_scanner.py)"""
    assert check_violation("m5.large", "t3.micro", "eq") == True

def test_contains_operator_ipv4():
    """Verify we can catch 0.0.0.0/0 in a list of CIDRs"""
    bad_cidrs = ["10.0.0.0/8", "0.0.0.0/0"]
    assert check_violation(bad_cidrs, "0.0.0.0/0", "contains") == True

def test_contains_operator_ipv6():
    """Verify we can catch IPv6 global open ranges (::/0)"""
    bad_cidrs_v6 = ["::/0"]
    assert check_violation(bad_cidrs_v6, "::/0", "contains") == True

def test_security_logic():
    """Verify we catch 0.0.0.0/0 in CIDR lists (from tests/test_scanner.py)"""
    assert check_violation(["0.0.0.0/0"], "0.0.0.0/0", "contains") == True

def test_missing_operator():
    """
    'missing' operator fires when a required field IS ABSENT (actual is None).

    Semantics decision (TASK-1 / REG-002):
      pa.py implements `return actual is None` — meaning 'missing' = True when
      the field is not present. This matches all rules.yaml usage (e.g. flagging
      missing reserved_concurrent_executions, missing mfa_devices, etc.).
      The original root test_scanner.py had these assertions inverted — fixed here.
    """
    # Field IS present → no violation (missing operator returns False)
    assert check_violation("present_value", None, "missing") == False

    # Field IS absent (None) → violation (missing operator returns True)
    assert check_violation(None, None, "missing") == True

def test_regex_operator():
    """Verify regex pattern matching for naming conventions"""
    # Violation: 'dev-bucket' does not start with 'prod-'
    assert check_violation("dev-bucket", "^prod-", "regex") == True
    # No violation: 'prod-bucket' starts with 'prod-'
    assert check_violation("prod-bucket", "^prod-", "regex") == False


# ─────────────────────────────────────────────
# End-to-End Integration Test (ENG-004)
# ─────────────────────────────────────────────

def test_e2e_scan():
    """
    Run pa.py against the real plan.json and rules.yaml, assert the output
    report.json is well-formed and contains expected structure.

    This validates the full pipeline — argument parsing, YAML loading,
    JSON loading, violation detection, and report writing.
    """
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    pa_path    = os.path.join(repo_root, 'pa.py')
    plan_path  = os.path.join(repo_root, 'plan.json')
    rules_path = os.path.join(repo_root, 'rules.yaml')

    with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as tmp:
        out_path = tmp.name

    try:
        result = subprocess.run(
            [sys.executable, pa_path,
             '--plan', plan_path,
             '--rules', rules_path,
             '--out', out_path],
            capture_output=True, text=True
        )

        # Scanner must exit cleanly
        assert result.returncode == 0, (
            f"pa.py exited with code {result.returncode}\nSTDERR: {result.stderr}"
        )

        # Output file must exist and be valid JSON
        assert os.path.exists(out_path), "report.json was not created"
        with open(out_path) as f:
            report = json.load(f)

        # Report must have the two expected top-level keys
        assert "summary" in report, "report.json missing 'summary' key"
        assert "violations" in report, "report.json missing 'violations' key"

        # Summary must contain all severity levels
        for level in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
            assert level in report["summary"], f"'summary' missing severity level: {level}"

        # Violations must be a list
        assert isinstance(report["violations"], list), "'violations' must be a list"

        # Every violation entry must have required fields
        for v in report["violations"]:
            assert "address" in v, f"Violation missing 'address': {v}"
            assert "sev"     in v, f"Violation missing 'sev': {v}"
            assert "msg"     in v, f"Violation missing 'msg': {v}"

        # The chaos plan.json intentionally has edge-case resources.
        # We assert the scanner ran without crashing and produced a non-negative count.
        total = sum(report["summary"].values())
        assert total >= 0, "Violation count must be non-negative"

    finally:
        if os.path.exists(out_path):
            os.unlink(out_path)
