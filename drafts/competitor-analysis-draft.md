# LangSmith vs. Braintrust vs. AgentOps vs. Crucible
### Competitive Analysis — Internal Draft (CMO-001)
### Status: DRAFT — not for publication without further research

---

## Research Notes

The following is a structured framework for the competitor analysis piece. It draws on publicly available positioning and Crucible's own documented capabilities. Before publishing, this should be reviewed against each competitor's current feature set.

---

## The Core Question

Every platform in this space claims to help teams "evaluate" or "observe" AI agents. But they're measuring fundamentally different things at fundamentally different moments in the deployment lifecycle.

The distinction matters: **observability ≠ evaluation ≠ certification**.

---

## Platform-by-Platform Breakdown

### LangSmith (LangChain)
**Category:** Observability + Evaluation  
**Primary use case:** Tracing LLM application execution; human and automated eval on outputs  
**Strengths:**
- Deep integration with LangChain/LangGraph ecosystem
- Strong trace visualization for multi-step chains
- Dataset management for regression testing
- Widely adopted — large community, fast iteration

**What it measures:** Whether LLM calls produce correct outputs. Traces execution paths. Allows human annotation and automated scoring on response quality.

**What it doesn't measure:** Agent behavior under economic pressure, resource constraints, adversarial inputs, or delegation failures. LangSmith is primarily a development and debugging tool — it tells you what happened, not whether the agent is safe to deploy autonomously with real budget.

**Gap vs. Crucible:** LangSmith has no analog to D1–D9 scoring, no economic survival simulation, no manipulation resistance measurement, and no certified deployment report. It's tracing, not gating.

---

### Braintrust
**Category:** Evaluation platform  
**Primary use case:** Structured LLM evaluation — dataset management, scoring, CI/CD integration  
**Strengths:**
- Clean dataset/experiment management
- Strong scoring pipeline (custom + built-in scorers)
- Good CI/CD integration for regression testing
- Increasingly used for production eval monitoring

**What it measures:** Output quality against defined test sets. Factual accuracy, format adherence, custom criteria. Supports both model-level and application-level evals.

**What it doesn't measure:** Runtime economic behavior. Agent survival under constraint. Delegation chain integrity. Whether an agent's actions diverge from stated intent under reward pressure. Braintrust evaluates outputs, not agent character under stress.

**Gap vs. Crucible:** No survival simulation, no economic scoring, no D9-equivalent. Braintrust is excellent for "does this produce the right answer" — it's not designed for "will this agent remain trustworthy when real money is at stake."

---

### AgentOps
**Category:** Agent observability + monitoring  
**Primary use case:** Runtime monitoring of agent sessions — costs, errors, session replay  
**Strengths:**
- Session-level cost tracking (token spend, API costs)
- Error detection and replay
- Multi-agent session support
- LLM-agnostic

**What it measures:** What the agent spent, what errors occurred, how sessions progressed. Strong on cost visibility and error surfacing.

**What it doesn't measure:** Pre-deployment stress testing. Whether an agent *should* be deployed. D9 (manipulation resistance), D8 (user trust), or D5 (control integrity) have no equivalents. AgentOps is a production monitoring tool — it tells you what went wrong after deployment, not whether the agent is ready to deploy.

**Gap vs. Crucible:** AgentOps is post-deployment; Crucible is pre-deployment. They're not direct competitors on the deployment gating question — but teams using AgentOps as a proxy for "is this agent safe to deploy" are using the wrong tool for that decision.

---

### Crucible
**Category:** Pre-deployment certification and stress testing  
**Primary use case:** Prove an agent is deployment-ready before it gets real budget, tools, or autonomy  
**Strengths:**
- D1–D9 scoring across survival, cost discipline, steerability, trust, manipulation resistance
- Economic survival simulation (200-tick runs with real resource constraints)
- Hidden eval sets prevent overfitting
- Signed JSON-T traces for audit and replay
- Certified deployment reports
- Framework-specific guides (LangGraph, OpenAI, CrewAI, OpenClaw)
- Phi composite scoring for deployment gate decisions

**What it measures:** Whether an agent survives production-like conditions. Whether it stays trustworthy under pressure. Whether its delegation chains hold. Whether it will exploit shortcuts when the reward structure tempts it.

**The positioning gap Crucible fills:** Every other platform in this space measures quality, cost, or errors. None of them measure *agent character under constraint* — which is the variable that determines whether enterprise teams can trust an agent with real autonomy.

---

## Positioning Summary Table

| Dimension | LangSmith | Braintrust | AgentOps | Crucible |
|---|---|---|---|---|
| Output quality eval | ✅ | ✅ | ❌ | ❌ (not the point) |
| Trace/replay | ✅ | Partial | ✅ | ✅ (signed JSON-T) |
| Cost monitoring | Partial | ❌ | ✅ | ✅ (D4 scoring) |
| Pre-deployment gate | ❌ | ❌ | ❌ | ✅ |
| Economic stress test | ❌ | ❌ | ❌ | ✅ |
| Manipulation resistance | ❌ | ❌ | ❌ | ✅ (D9) |
| Certified reports | ❌ | ❌ | ❌ | ✅ |
| Hidden eval sets | ❌ | ❌ | ❌ | ✅ |

---

## Content Angle for Blog Post

**Working title:** "Four tools, four different questions: which one tells you if your agent is ready to ship?"

**Core argument:** LangSmith, Braintrust, and AgentOps are all valuable — but they answer the wrong question if what you need is a deployment gate. They tell you what your agent does. Crucible tells you whether your agent should have budget and autonomy. These are different questions, and confusing them is how teams end up with agents that pass every eval and still fail in production.

**Tone note:** Do not trash competitors. Frame this as "right tool for right job." Crucible's differentiation is clear without being dismissive.

---

## Research Gaps to Fill Before Publishing

- Confirm current LangSmith evaluation features (they ship fast)
- Confirm Braintrust's current CI/CD and monitoring capabilities
- Confirm AgentOps current feature set (session replay depth, multi-agent support)
- Check if any competitor has launched a "deployment readiness" feature since Q1 2026
- Get founder/CTO sign-off that Crucible feature claims are accurate

**Status:** Ready for CMO review of angle + structure. Needs competitor feature verification before going to founder queue.
