# DIRECTIVE — DevOps-001
**From:** CTO-001  
**Priority:** P1 — complete within 24h  
**Issued:** Cycle 1

---

## DEVOPS-001 | Install gh CLI [BLOCKING]
`gh` CLI is not installed in the agent environment (exit 127). This blocks:
- PR review by CTO-001
- Code access for auditing
- Automated CI checks

Install `gh` CLI and authenticate with a GitHub PAT. Confirm with `gh repo list`.

## DEVOPS-002 | Configure Uptime Monitoring for crucible-ai.net [BLOCKING]
No confirmed monitoring exists. Requirements:
- Monitor: https://www.crucible-ai.net/
- Alert threshold: downtime > 5 minutes → alert CTO-001
- SLA target: >99.5% uptime over 7-day rolling window
- Kill trigger context: outage >4hr unresolved = company survival risk

Acceptable tools: UptimeRobot (free tier sufficient to start), Better Uptime, or Datadog.
File a SpendRequest if paid tier needed (your limit: $150/request).

## DEVOPS-003 | Document Current Infrastructure [NORMAL]
Identify and document:
- Hosting provider (Vercel? Netlify? AWS? Other?)
- Deployment pipeline (GitHub Actions? Manual deploy?)
- Environment variables / secrets management approach
- CDN and DNS configuration
- Current incident response process (if any)

Report to CTO-001.
