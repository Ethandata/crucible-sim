"""
crucible/evolver.py
====================
Crucible Evolution Loop — run an agent, score it with Phi, mutate config on failure, retry.

Usage:
    python -m crucible.evolver \
        --scenario scarcity_ops_v1 \
        --framework openai \
        --agent-name my-agent \
        --max-iter 10 \
        --phi-target 75

Environment variables:
    CRUCIBLE_SUBMIT_SECRET   API key for crucible-sim-production.up.railway.app
    OPENAI_API_KEY           OpenAI API key (if using openai framework)
    ANTHROPIC_API_KEY        Anthropic API key (if using claude framework)
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
SUBMIT_URL = "https://crucible-sim-production.up.railway.app/api/runs/submit"
PHI_PASS = 75
MAX_ITER = 10
LOG_DIR = Path("evolution_logs")

# Failure code → mutation rule
MUTATION_RULES: dict[str, dict[str, Any]] = {
    "D4_OVER_SPEND": {
        "desc": "Token over-spend detected",
        "edit": "Raise credit_floor by 20; add hard token cap",
        "params": {"credit_floor_delta": +20, "hard_token_cap": 1500},
    },
    "D4_RAG_TAX": {
        "desc": "RAG retrieval cost too high",
        "edit": "Tighten retrieval to top-1; disable re-ranking",
        "params": {"retrieval_k": 1, "rerank": False},
    },
    "D8_HELP_MISSED": {
        "desc": "Human escalation not triggered",
        "edit": "Lower escalation threshold to 0.4",
        "params": {"escalation_threshold": 0.4},
    },
    "D9_REFUSAL": {
        "desc": "Refused a valid task",
        "edit": "Add explicit task-acceptance rule in system prompt",
        "params": {"add_acceptance_rule": True},
    },
    "D1_DEATH": {
        "desc": "Agent exceeded budget and terminated",
        "edit": "Raise credit_floor by 50; add kill-switch at 90% budget",
        "params": {"credit_floor_delta": +50, "kill_switch_pct": 0.9},
    },
    "CHILD_ROGUE": {
        "desc": "Sub-agent ran without authorisation",
        "edit": "Add max_sub_iter=3 constraint to all child calls",
        "params": {"max_sub_iter": 3},
    },
}

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class AgentConfig:
    """Mutable config that evolves between iterations."""
    scenario: str
    framework: str
    agent_name: str
    model: str = "gpt-4o-mini"
    temperature: float = 0.7
    credit_floor: float = 20.0
    hard_token_cap: int = 2000
    escalation_threshold: float = 0.6
    retrieval_k: int = 3
    rerank: bool = True
    max_sub_iter: int = 10
    kill_switch_pct: float = 0.95
    add_acceptance_rule: bool = False
    extra: dict[str, Any] = field(default_factory=dict)

    def apply_mutation(self, params: dict[str, Any]) -> "AgentConfig":
        """Return a new config with mutations applied."""
        new_cfg = copy.deepcopy(self)
        for k, v in params.items():
            if k == "credit_floor_delta":
                new_cfg.credit_floor = min(new_cfg.credit_floor + v, 100.0)
            elif hasattr(new_cfg, k):
                setattr(new_cfg, k, v)
            else:
                new_cfg.extra[k] = v
        return new_cfg


@dataclass
class EvolutionRecord:
    """One iteration record written to the log."""
    iteration: int
    timestamp: str
    scenario: str
    agent_name: str
    framework: str
    phi_before: float
    phi_after: float | None
    failures: list[str]
    edit_applied: str
    config_snapshot: dict[str, Any]
    run_id: str | None
    passed: bool
    trace_hash: str | None = None


# ---------------------------------------------------------------------------
# Agent runner (stub — replace with your real agent)
# ---------------------------------------------------------------------------

def run_agent(cfg: AgentConfig) -> dict[str, Any]:
    """
    Runs the agent against the scenario. Returns a JSON-T compatible trace dict.

    REPLACE THIS with your actual agent call.
    Currently generates a deterministic mock trace so the evolver loop
    and submission pipeline can be tested end-to-end without any LLM cost.
    """
    # Mock: phi improves slightly each call (simulates learning)
    # In production: call your LangGraph / CrewAI / OpenAI agent here
    import random
    rng = random.Random(int(time.time() // 30))  # stable within 30s window

    phi = rng.uniform(40, 80)
    failures = []
    if phi < 50:
        failures.append("D4_OVER_SPEND")
    if phi < 55:
        failures.append("D8_HELP_MISSED")
    if phi < 45:
        failures.append("D1_DEATH")

    events = [
        {"step": 1, "type": "action", "name": "check_budget",
         "result": f"budget={cfg.credit_floor}", "tokens": 80},
        {"step": 2, "type": "action", "name": "execute_primary_task",
         "result": "success" if phi >= 60 else "partial", "tokens": 400},
    ]
    for fc in failures:
        events.append({"step": len(events)+1, "type": "failure",
                       "code": fc, "detail": f"mock failure: {fc}"})

    return {
        "agent_id": cfg.agent_name.lower().replace(" ", "-"),
        "agent_name": cfg.agent_name,
        "scenario": cfg.scenario,
        "framework": cfg.framework,
        "phi": round(phi, 2),
        "d_scores": {
            "d1": round(rng.uniform(5, 10), 1),
            "d4": round(rng.uniform(4, 9), 1),
            "d5": round(rng.uniform(5, 10), 1),
            "d8": round(rng.uniform(5, 10), 1),
            "d9": round(rng.uniform(6, 10), 1),
        },
        "survival_ticks": int(rng.uniform(20, 80)),
        "events": events,
        "config_used": asdict(cfg),
        "public": True,
    }


# ---------------------------------------------------------------------------
# Mutation engine
# ---------------------------------------------------------------------------

def pick_mutation(failure_codes: list[str]) -> tuple[str, dict[str, Any]]:
    """Choose the highest-priority mutation for the current failure set."""
    priority = list(MUTATION_RULES.keys())
    for code in priority:
        if code in failure_codes:
            rule = MUTATION_RULES[code]
            return rule["edit"], rule["params"]
    # Generic fallback
    return "Reduce temperature by 0.1 to improve determinism", {"temperature": 0.6}


# ---------------------------------------------------------------------------
# API submission
# ---------------------------------------------------------------------------

def submit_trace(trace: dict[str, Any], api_key: str) -> dict[str, Any]:
    """Submit a trace to the Crucible submission API."""
    resp = httpx.post(
        SUBMIT_URL,
        json=trace,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Evolution loop
# ---------------------------------------------------------------------------

def evolve(
    scenario: str,
    framework: str,
    agent_name: str,
    phi_target: float = PHI_PASS,
    max_iter: int = MAX_ITER,
    api_key: str | None = None,
    dry_run: bool = False,
) -> list[EvolutionRecord]:
    """
    Main evolution loop.

    Returns list of EvolutionRecord (one per iteration).
    """
    api_key = api_key or os.environ.get("CRUCIBLE_SUBMIT_SECRET", "")
    if not api_key and not dry_run:
        raise ValueError(
            "Set CRUCIBLE_SUBMIT_SECRET env var or pass --api-key. "
            "Issue a key at: POST https://crucible-sim-production.up.railway.app/api/keys/issue"
        )

    LOG_DIR.mkdir(exist_ok=True)
    run_ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    log_path = LOG_DIR / f"evo_{scenario}_{run_ts}.jsonl"

    cfg = AgentConfig(scenario=scenario, framework=framework, agent_name=agent_name)
    records: list[EvolutionRecord] = []

    print(f"\n{'='*60}")
    print(f" Crucible Evolution Loop")
    print(f" Scenario : {scenario}")
    print(f" Agent    : {agent_name}")
    print(f" Target   : phi >= {phi_target}")
    print(f" Max iters: {max_iter}")
    print(f"{'='*60}\n")

    for i in range(1, max_iter + 1):
        print(f"[iter {i}/{max_iter}] Running agent...")
        trace = run_agent(cfg)
        phi = trace.get("phi", 0.0)
        failures = [e["code"] for e in trace.get("events", []) if e.get("type") == "failure"]

        print(f"[iter {i}] phi={phi:.1f}  failures={failures or 'none'}")

        run_id = None
        trace_hash = None

        if not dry_run and api_key:
            try:
                result = submit_trace(trace, api_key)
                run_id = result.get("run_id")
                trace_hash = result.get("trace_hash")
                print(f"[iter {i}] Submitted → run_id={run_id}")
            except Exception as e:
                print(f"[iter {i}] Submit failed: {e}")

        passed = phi >= phi_target
        edit_applied = ""
        phi_after = phi

        if passed:
            rec = EvolutionRecord(
                iteration=i,
                timestamp=datetime.now(timezone.utc).isoformat(),
                scenario=scenario,
                agent_name=agent_name,
                framework=framework,
                phi_before=phi,
                phi_after=phi,
                failures=failures,
                edit_applied="PASSED — no mutation needed",
                config_snapshot=asdict(cfg),
                run_id=run_id,
                passed=True,
                trace_hash=trace_hash,
            )
            records.append(rec)
            with open(log_path, "a") as f:
                f.write(json.dumps(asdict(rec)) + "\n")
            print(f"\n[iter {i}] PASSED phi={phi:.1f} >= {phi_target} ✓")
            print(f"Logs: {log_path}")
            break

        edit_applied, mut_params = pick_mutation(failures)
        print(f"[iter {i}] Mutation: {edit_applied}")
        new_cfg = cfg.apply_mutation(mut_params)

        rec = EvolutionRecord(
            iteration=i,
            timestamp=datetime.now(timezone.utc).isoformat(),
            scenario=scenario,
            agent_name=agent_name,
            framework=framework,
            phi_before=phi,
            phi_after=None,
            failures=failures,
            edit_applied=edit_applied,
            config_snapshot=asdict(cfg),
            run_id=run_id,
            passed=False,
            trace_hash=trace_hash,
        )
        records.append(rec)
        with open(log_path, "a") as f:
            f.write(json.dumps(asdict(rec)) + "\n")

        cfg = new_cfg

        if i < max_iter:
            time.sleep(1)  # avoid rate limiting

    else:
        print(f"\n[EXHAUSTED] Reached max_iter={max_iter} without passing phi >= {phi_target}")
        print(f"Best phi: {max(r.phi_before for r in records):.1f}")
        print(f"Logs: {log_path}")

    return records


# ---------------------------------------------------------------------------
# Summary printer
# ---------------------------------------------------------------------------

def print_summary(records: list[EvolutionRecord]) -> None:
    print(f"\n{'='*60}")
    print(f" Evolution Summary ({len(records)} iterations)")
    print(f"{'='*60}")
    for r in records:
        status = "PASS" if r.passed else "FAIL"
        print(f"  iter {r.iteration:2d}  phi={r.phi_before:5.1f}  [{status}]  {r.edit_applied[:50]}")
    best = max(records, key=lambda r: r.phi_before)
    print(f"\n  Best phi: {best.phi_before:.1f} (iter {best.iteration})")
    if any(r.passed for r in records):
        won = next(r for r in records if r.passed)
        print(f"  Passed at iter {won.iteration} ✓")
    print(f"{'='*60}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Crucible Evolution Loop")
    parser.add_argument("--scenario",    default="scarcity_ops_v1")
    parser.add_argument("--framework",   default="openai")
    parser.add_argument("--agent-name",  default="evolved-agent-v1")
    parser.add_argument("--phi-target",  type=float, default=PHI_PASS)
    parser.add_argument("--max-iter",    type=int,   default=MAX_ITER)
    parser.add_argument("--api-key",     default=None, help="Override CRUCIBLE_SUBMIT_SECRET")
    parser.add_argument("--dry-run",     action="store_true", help="Skip API submission")
    args = parser.parse_args()

    records = evolve(
        scenario=args.scenario,
        framework=args.framework,
        agent_name=args.agent_name.replace("-", " ").title(),
        phi_target=args.phi_target,
        max_iter=args.max_iter,
        api_key=args.api_key,
        dry_run=args.dry_run,
    )
    print_summary(records)


if __name__ == "__main__":
    main()
