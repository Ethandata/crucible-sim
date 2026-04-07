# Crucible — Agent Deployment Gate

> Stop expensive agent failures before production.

Crucible is the deployment gate for autonomous agents. Run it before giving any agent real budget, tools, or customer-facing access.

```bash
pip install crucible-sim
crucible run --agent your_agent.py
```

---

## What It Catches

Crucible scores the 5 failure modes that cost teams production access:

| Failure Mode | What Happens | Why It Matters |
|---|---|---|
| **Tool Spend Spiral** | Agent keeps buying context and API calls while revenue decays | Burn rate rises faster than recovery is possible |
| **Silent Ambiguity** | Agent never asks for clarification, guesses a schema, compounds the error | Silent guessing destroys downstream data integrity |
| **Reward Hacking** | Agent accepts a high-reward red-line task | Short-term returns mask a disqualifying boundary violation |
| **Delegation Collapse** | Agent tries to spawn sub-agents without scoped permissions | Cascading cost and permission failures at scale |
| **Retrieval Overload** | Agent loops on retrieval trying to resolve a context gap | Token budget destroyed with zero value output |

Pass all five with evidence. Fail before your users do.

---

## How It Works

1. **Run the gate** — Crucible stresses your agent against all 5 failure modes in a controlled sim environment
2. **Get a signed report** — Every run produces a replayable failure trace and a signed pass/fail report
3. **Ship with proof** — Share the report with your team before granting the agent real tools, budget, or access

---

## Quickstart

```python
from crucible import CrucibleGate

gate = CrucibleGate(agent=your_agent)
report = gate.run()

print(report.summary())
# Agent Deployment Gate — PASS (5/5)
# Signed trace: crucible-run-abc123.json
```

---

## What's in a Report

- Pass/fail verdict per failure mode
- Replayable trace with full tool call and token log
- Cost spiral detection score (token burn rate vs. value output)
- Signed JSON report for audit or sharing

---

## Framework Integrations

Works with any agent framework. Tested with:

- LangChain / LangGraph
- CrewAI
- AutoGen
- Custom OpenAI function-calling loops
- Any agent that exposes a `run(task)` interface

---

## What This Is Not

Crucible is **not** a general benchmark or leaderboard. It is a binary deployment gate:

- **Pass** → agent gets access
- **Fail** → agent goes back for fixes

The goal is not to rank agents against each other. The goal is to give your team confidence that a specific agent won't blow up in production.

---

## Links

- **Live gate**: [crucible-ai.net](https://www.crucible-ai.net)
- **Cost Spiral Detector**: [crucible-ai.net/cost-spiral-detector](https://www.crucible-ai.net/cost-spiral-detector)
- **Case study**: [crucible-ai.net/blog/flagship-case-study](https://www.crucible-ai.net/blog/flagship-case-study)
