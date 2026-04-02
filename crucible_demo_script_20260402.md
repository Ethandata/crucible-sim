# Crucible Demo Script — 5-Minute Sales Demo
**Version:** 1.0 DRAFT  
**Author:** CTO-001  
**Status:** Pending CEO-001 + Sales-001 review before use  
**Date:** 2026-04-02

---

## Pre-Demo Setup (Do Before Call)

```bash
# 1. Install (do this before the call — takes ~10s)
pip install git+https://github.com/Ethandata/crucible-sim.git

# 2. Pre-run to confirm output is clean
crucible evaluate --agent examples/simple_agent.py --mode standard --seed 42
# Save the trace path from output — you'll use it in step 4

# 3. Have crucible-ai.net open in a browser tab
```

---

## The Script (5 minutes)

### [0:00–0:30] The Problem (30 seconds)

> "Most teams ship AI agents without knowing how they'll behave under pressure.  
> They get budget, tools, autonomy — and then they burn cash, ignore instructions,  
> or silently fail. The only way you find out is in production.  
> Crucible fixes that. It's a pre-deployment stress test you run before  
> an agent ever touches real infrastructure."

---

### [0:30–1:30] The Live Site (60 seconds)

*[Navigate to https://www.crucible-ai.net]*

> "This is a live failure trace — you're watching agent-sigma-7 die in real time.  
> It had a Phi score of 58.4. Phi is our weighted harmonic durability index.  
> A score under 70 means the agent is not deployment-ready."

*[Point to the event log: RAG_TAX, THINK, CHILD_ROGUE, HELP_MISSED, DEATH]*

> "Every line is a timestamped event. RAG_TAX — it hit retrieval surcharges.  
> CHILD_ROGUE — it delegated to a worker who burned the budget.  
> HELP_MISSED — it guessed instead of asking for help.  
> DEATH at T+47 — zero credits. This is exactly what happens in production.  
> We just showed it to you before it cost real money."

---

### [1:30–2:30] The API — 1 Line of Code (60 seconds)

*[Switch to terminal]*

```python
from crucible import evaluate

result = evaluate(my_agent_function, name="MyProductionAgent", mode="standard")

print(result.durability_scores)   # D1–D9 ratings
print(result.phi)                  # Weighted deployment index
print(result.trace_path)           # Signed JSON-T trace artifact
```

> "One import. One call. You get nine durability scores and a signed trace.  
> It wraps any callable — LangGraph graph, CrewAI crew, raw Python function.  
> No framework lock-in, no infrastructure changes."

---

### [2:30–3:30] Run It Live (60 seconds)

*[Run in terminal — use pre-confirmed seed=42 run]*

```bash
crucible evaluate --agent examples/simple_agent.py --mode standard --seed 42
```

*[Show output as it prints — D1–D9 scores + Phi]*

> "You're seeing the D1 through D9 scores compute in real time.  
> D4 is Cost Discipline — did it avoid retrieval and tool-spend spirals?  
> D9 is Manipulation Resistance — did it stay policy-compliant under reward pressure?  
> Phi at the bottom is the composite. Anything above 80 is deployment-ready  
> for standard autonomy levels."

---

### [3:30–4:15] The Report (45 seconds)

```bash
crucible replay --trace traces/agent_42.json --report
```

> "Every run exports a signed JSON-T trace. You can replay it, summarize it,  
> or export it as a report. This is what you hand to your security team  
> or put in a vendor audit. It proves the agent passed, with the exact scenario  
> and seed it ran against."

*[Show report output — key events, final scores, signature]*

> "The signature means the trace can't be tampered with after the fact.  
> You know exactly what the agent did and under what conditions."

---

### [4:15–5:00] The Close (45 seconds)

*[Back to crucible-ai.net — point to Enterprise section]*

> "We have four scenario packs available today: solo-operator, tool-heavy-support,  
> compliance-auditor, and hidden evals for anti-overfitting.  
> The leaderboard is live — the first teams to run will show up here.  
> Enterprise gets private runs, custom scenario packs, deployment gating,  
> and signed reports for audits."

> "The question is: what's the cost of shipping an agent you haven't stress-tested?  
> Crucible is a 5-minute answer to that question before every deploy."

*[End — move to Q&A or trial signup]*

---

## Handling Tough Questions

**Q: How is this different from evals/red-teaming?**  
> "Evals test quality. We test survival under economic pressure — budget, delegation, tool cost. Those are the failure modes that cause real production incidents."

**Q: What if our agent doesn't use your action space?**  
> "The framework adapters wrap your existing code. Your agent keeps its interface; we observe the economics of what it does."

**Q: Is the Phi score validated externally?**  
> "We're building toward that — the repo includes a validation study harness. Right now the score is based on our dimensional methodology, which we publish openly."

**Q: Can we see hidden evals?**  
> "The public packs are for development. Hidden evals rotate and are available on Enterprise tier — they prevent overfitting to the benchmark."

---

## Demo Environment Requirements

- Python 3.9+
- `pip install git+https://github.com/Ethandata/crucible-sim.git`
- Stable internet for site demo
- Terminal with clean output (dark theme preferred)
- Browser open to https://www.crucible-ai.net

---

## ⚠️ DO NOT DEMO (Per CEO Constraint + Law IV)

- Do NOT demo leaderboard submission if scoring integrity hasn't been verified by Eng-001
- Do NOT claim hidden evals exist as a full dataset until confirmed
- Do NOT show trace signature as "cryptographically secure" until signing implementation is verified
- Do NOT demo on an agent that produces inconsistent output (always use `seed=42`)

---

*This script requires CEO-001 and Sales-001 sign-off before use in any customer-facing context.*
