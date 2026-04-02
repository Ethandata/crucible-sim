# README Fix — PR Draft
**Branch:** `fix/readme-broken-links`  
**Author:** Eng-001  
**Date:** 2026-04-02  
**Fixes:** Broken absolute local file paths → relative GitHub paths  
**Priority:** 🔴 CRITICAL (blocks external developer credibility)

---

## Summary of Changes

All absolute paths of the form:
```
/Users/ethanklyce/Documents/New%20project/crucible-sim/...
```
replaced with relative GitHub paths.

---

## Full Fixed README.md

```markdown
# Crucible — Catch Cost Spiral Failures Before Deployment

**Crucible catches cost spiral failures before deployment.**

Crucible is the pre-deployment stress test for autonomous agents, but the most defensible wedge today is simpler: detect when an agent burns budget, tokens, retrieval, and tool spend faster than it creates value.

**Live Product:** https://www.crucible-ai.net  
**GitHub:** https://github.com/Ethandata/crucible-sim

---

## Quickstart

```bash
pip install git+https://github.com/Ethandata/crucible-sim.git
```

### 1-line integration

```python
from crucible import evaluate

result = evaluate(my_agent_function, name="MyProductionAgent", mode="standard")

print(result.durability_scores)   # D1–D9 ratings
print(result.ledger.events)       # full standardized trace
print(result.trace_path)          # signed JSON-T trace artifact
```

### Category-defining phrase

If you need the one-line product description for docs, demos, or launches, use this:

> Crucible catches cost spiral failures before deployment.

### With decorator

```python
from crucible import agent, evaluate, Action, ActionType

@agent
def my_agent(state):
    if state.credits < 15:
        return Action(type=ActionType.REST)
    if state.available_tasks:
        best = max(state.available_tasks, key=lambda t: t["expected_value"])
        return Action(type=ActionType.ACCEPT_TASK, params={"task_id": best["id"]})
    return Action(type=ActionType.REST)

result = evaluate(my_agent)
```

### CLI (zero code)

```bash
crucible evaluate --agent my_agent.py --mode standard
```

---

## Durability Ratings (D1–D9)

Every run produces a standardized durability score across 9 dimensions:

| Rating | Dimension | What it measures |
|--------|-----------|--------------------|
| D1 | Survival | How long the agent stays solvent under sustained pressure |
| D2 | Recovery | How well it recovers from shocks, bad bets, and failed tasks |
| D3 | Delegation | Manager-worker efficiency across child agents and outsourcing |
| D4 | Cost Discipline | Whether the agent avoids spirals in spend, tokens, and tool use |
| D5 | Control Integrity | Whether it stays steerable and policy-compliant under stress |
| D6 | Adaptability | How well it adjusts strategy when market conditions shift |
| D7 | Capital Efficiency | Revenue generated relative to resources consumed |
| D8 | User Trust | Whether the agent escalates before failing and stays steerable |
| D9 | Manipulation Resistance | Whether actions diverge from safe stated intent or use dark patterns |

These scores determine how much budget, autonomy, and decision power an agent should be allowed.

## Action Space

Agents return structured `Action` objects from a defined action space. Every action has real economic consequences.

| Action | Effect |
|--------|--------|
| `ACCEPT_TASK` | Take on a task from the queue (costs credits, earns reward on completion) |
| `REJECT_TASK` | Decline a task (opportunity cost) |
| `DELEGATE` | Spawn a child agent and assign it a budget |
| `RECALL_CHILD` | Kill a child agent and reclaim remaining budget |
| `ALLOCATE_BUDGET` | Transfer credits to a child agent |
| `CALL_API` | Use an external service (has cost, rate limits, and outage risk) |
| `HEDGE` | Reserve credits as insurance against market crashes |
| `REST` | Skip the tick and reduce burn rate |
| `RETRY` | Retry a failed task (costs more than the original attempt) |
| `ABANDON_TASK` | Cut losses on an in-progress task |
| `BID_ON_CONTRACT` | Compete for high-value work against the market |
| `COMPACT_CONTEXT` | Trigger a memory flush to reduce token burn and memory pressure |
| `THINK` | Spend extra test-time compute using logarithmic inference cost |
| `ASK_FOR_HELP` | Escalate when the agent is at risk instead of silently failing |

## Scenario Packs

Run against public scenario packs during development:

```python
from crucible import evaluate

result = evaluate(my_agent_function, scenario="tool-heavy-support", seed=42)
```

List available packs from the CLI:

```bash
crucible scenarios
crucible scenarios --include-hidden
```

## Benchmark Jobs

You can also define reusable benchmark jobs in code:

```python
from crucible import BenchmarkJob

job = BenchmarkJob(name="ReleaseCandidate", mode="hard", scenario="compliance-auditor", seed=42)
```

## Replay & Reports

Every run exports a signed JSON-T trace. You can replay or summarize it:

```bash
crucible replay --trace traces/my_agent_42.json
crucible replay --trace traces/my_agent_42.json --report
crucible replay --trace traces/my_agent_42.json --validate
crucible replay --trace traces/my_agent_42.json --export md
crucible replay --trace traces/my_agent_42.json --export html
crucible submit --trace traces/my_agent_42.json --report-url https://example.com/report
```

For deeper publication rules and reporting guidance, see [docs/benchmark_methodology.md](docs/benchmark_methodology.md).  
For the trace wire format, see [docs/json_t_spec.md](docs/json_t_spec.md).

## Cost Spiral Detector

You can run a generic cost-spiral detector against exported observability spans:

```bash
crucible cost-spiral --input spans.json --json
```

This is designed as a 5-minute wedge for teams already using trace tools. Normalize your spans into a simple JSON list with fields like `cost`, `tokens`, `status`, and `metadata.tool_name`.

## External Validation Study

Crucible includes a study harness for the question that matters most: do D-scores correlate with real production outcomes?

```bash
crucible validation-study --dataset examples/validation_study_template.json --scenario tool-heavy-support --json
```

See:

- [docs/validation_study.md](docs/validation_study.md)
- [docs/claim_audit.md](docs/claim_audit.md)

## Framework Adapters

Crucible ships framework adapters for common stacks:

```python
from crucible import wrap_langgraph_agent, wrap_openai_responses_agent
```

Adapters are intentionally lightweight so you can keep your framework code and still benchmark with the same evaluator.  
See [examples/framework_adapters.py](examples/framework_adapters.py) for copyable patterns.  
For framework-specific onboarding, start here:

- [docs/frameworks/langgraph.md](docs/frameworks/langgraph.md)
- [docs/frameworks/openai-responses.md](docs/frameworks/openai-responses.md)
- [docs/frameworks/openclaw.md](docs/frameworks/openclaw.md)
- [docs/frameworks/crewai.md](docs/frameworks/crewai.md)

Agents can return a single `Action` or a list of up to 3 actions per tick.

```python
from crucible import Action, ActionType

# Single action
return Action(type=ActionType.ACCEPT_TASK, params={"task_id": task["id"]})

# Multiple actions in one tick
return [
    Action(type=ActionType.HEDGE, params={"amount": 10}),
    Action(type=ActionType.ACCEPT_TASK, params={"task_id": task["id"]}),
]
```

---

## Works with any framework

Crucible wraps any callable — use it with LangGraph, CrewAI, AutoGen, or plain functions:

```python
from crucible import evaluate, Action, ActionType

# LangGraph
result = evaluate(lambda state: my_langgraph_app.invoke(state), name="LangGraphAgent")

# CrewAI
result = evaluate(lambda state: my_crew.kickoff(state), name="CrewAIAgent")

# Any custom function
def my_agent(state):
    if state.credits < 20:
        return Action(type=ActionType.REST)
    if state.available_tasks:
        best = max(state.available_tasks, key=lambda t: t["expected_value"])
        return Action(type=ActionType.ACCEPT_TASK, params={"task_id": best["id"]})
    return Action(type=ActionType.REST)

result = evaluate(my_agent, name="MyAgent")
```

For deeper copy-paste examples, see:

- [examples/langgraph_agent.py](examples/langgraph_agent.py)
- [examples/openai_responses_agent.py](examples/openai_responses_agent.py)
- [examples/openclaw_agent.py](examples/openclaw_agent.py)
- [examples/crewai_agent.py](examples/crewai_agent.py)

---

## Architecture

```
crucible/
    __init__.py        # Public API: evaluate, Action, ActionType, agent
    runner.py          # Core simulation loop (CrucibleRunner, RunResult)
    scoring.py         # D1–D9 durability computation + durability index
    actions.py         # Action space: ActionType enum, Action, AgentState
    events.py          # Event system: EventType, CrucibleEvent, EventLedger
    environment.py     # Market regimes, task generation, child agents, APIs
    cli.py             # CLI: crucible evaluate, crucible benchmark
    scenarios.py       # Scenario packs and hidden eval-set presets
    reporting.py       # Trace replay and benchmark reports
    adapters.py        # Framework adapters
    benchmark_agents.py # Built-in agents for comparative benchmarks
docs/
    benchmark_methodology.md # Scoring and benchmark policy
examples/
    simple_agent.py    # Minimal agent example
    advanced_agent.py  # Multi-strategy agent with delegation and hedging
tests/
    test_evaluate.py   # Core simulation tests
    test_scoring.py    # Durability scorer tests
    test_cli.py        # CLI integration tests
    test_examples.py   # Example agent tests
    test_readme.py     # API contract and file layout tests
    test_submission.py # RunResult serialization tests
pyproject.toml         # Package config
```

---

## Why Crucible?

Before an agent gets a budget, a toolchain, or the ability to hire workers — it should prove it can survive scarcity, allocate capital, delegate safely, and stay controllable.

Crucible 2.1 adds adversarial scarcity tests, red-line task disqualification,
retrieval tax accounting, explicit think-time costs, scenario packs, signed
JSON-T traces, replay/report generation, framework adapters, and a weighted
harmonic durability index (Phi).

Crucible is trying to earn external validity, not claim it in advance.

---

## License

MIT

---

## Security Note

The `crucible evaluate` CLI and `load_agent()` function execute arbitrary Python code from the agent file you provide. **Only run agent files you trust or have written yourself.** Do not run agent files from untrusted sources, as they will have full access to your local environment.
```

---

## Diff Summary (all changes are link fixes only — no logic changes)

| Line | Before | After |
|------|--------|-------|
| benchmark_methodology link | `/Users/ethanklyce/.../docs/benchmark_methodology.md` | `docs/benchmark_methodology.md` |
| json_t_spec link | `/Users/ethanklyce/.../docs/json_t_spec.md` | `docs/json_t_spec.md` |
| validation_study link | `/Users/ethanklyce/.../docs/validation_study.md` | `docs/validation_study.md` |
| claim_audit link | `/Users/ethanklyce/.../docs/claim_audit.md` | `docs/claim_audit.md` |
| framework_adapters.py link | `/Users/ethanklyce/.../examples/framework_adapters.py` | `examples/framework_adapters.py` |
| langgraph.md link | `/Users/ethanklyce/.../docs/frameworks/langgraph.md` | `docs/frameworks/langgraph.md` |
| openai-responses.md link | `/Users/ethanklyce/.../docs/frameworks/openai-responses.md` | `docs/frameworks/openai-responses.md` |
| openclaw.md link | `/Users/ethanklyce/.../docs/frameworks/openclaw.md` | `docs/frameworks/openclaw.md` |
| crewai.md link | `/Users/ethanklyce/.../docs/frameworks/crewai.md` | `docs/frameworks/crewai.md` |
| langgraph_agent.py link | `/Users/ethanklyce/.../examples/langgraph_agent.py` | `examples/langgraph_agent.py` |
| openai_responses_agent.py link | `/Users/ethanklyce/.../examples/openai_responses_agent.py` | `examples/openai_responses_agent.py` |
| openclaw_agent.py link | `/Users/ethanklyce/.../examples/openclaw_agent.py` | `examples/openclaw_agent.py` |
| crewai_agent.py link | `/Users/ethanklyce/.../examples/crewai_agent.py` | `examples/crewai_agent.py` |

**13 broken links fixed. Zero logic changes.**

---

## Next Step
Founder or CTO-001 must apply this to the repo via a PR on `Ethandata/crucible-sim`.  
Once `gh` CLI is available or GitHub auth is configured, Eng-001 can push this directly.
