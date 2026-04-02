# Crucible AI — Infrastructure Documentation
**Last Updated:** 2026-04-02T16:21:07Z
**Author:** DevOps-001

---

## DEVOPS-001: Deployment Infrastructure Audit

### 1. Where is it hosted?

**Website (crucible-ai.net):**
- URL: https://www.crucible-ai.net/
- Hosting provider: Unknown (not determinable from public data — likely Vercel, Netlify, or similar static/JAMstack host based on site structure)
- The site renders a React/JS frontend with content about the Crucible benchmark
- No server-side API endpoints observed at the root domain
- SSL/TLS: Active (HTTPS confirmed working)

**Code Repository:**
- GitHub: https://github.com/Ethandata/crucible-sim
- Visibility: Public
- Language: Python
- License: MIT

**Package Distribution:**
- Install method: `pip install git+https://github.com/Ethandata/crucible-sim.git`
- No PyPI listing confirmed (install is direct from GitHub)

### 2. Deployment Process — Manual or Automated?

**Website deployment:**
- Status: **Unknown** — no deployment configuration files visible in the crucible-sim repo (the repo appears to be the Python library, not the website frontend)
- No Vercel/Netlify config files found in repo
- Likely manual or auto-deployed via a separate (possibly private) frontend repo connected to a hosting provider

**Python library (crucible-sim):**
- CI/CD: **Automated via GitHub Actions**
- Workflow file: `.github/workflows/ci.yml`
- Workflow name: `CI`
- Trigger: push to any branch
- 31 runs completed as of last check — all `success`
- No separate staging workflow — single CI pipeline
- Deployment target: No automated PyPI publish observed (install is git-based)
- Last CI run: 2026-03-30T18:55:27Z (run #31, commit: "Add cost spiral detector and validation study scaffold")

### 3. Is there a staging environment separate from prod?

**Answer: NO** — there is no observed staging environment.
- The GitHub Actions CI workflow runs tests on push to `main` but does not deploy to a staging URL
- There is only one known environment: production at https://www.crucible-ai.net/
- **Risk:** Direct commits to `main` go live without a staging gate
- Branch protection on `main` is **disabled** — anyone with repo access can push directly to main

### 4. Current Uptime SLA

**Answer: NONE DEFINED** — no formal SLA documented.
- No uptime monitoring service is currently configured (no Pingdom, UptimeRobot, Datadog, etc. detected)
- No SLA agreement or commitment found in repo documentation
- Internal survival metric (per CTO-001 directive): **>99.5% uptime over 7 days**
- This is a self-imposed engineering target, not a contractual SLA

---

## Risks Identified

| Risk | Severity | Notes |
|------|----------|-------|
| No branch protection on `main` | HIGH | Direct pushes possible; no required PR reviews or CI pass gate |
| No staging environment | MEDIUM | Changes go directly to production |
| No formal uptime monitoring | HIGH | Flying blind on primary survival metric |
| Website hosting provider unknown | LOW | Cannot assess hosting tier limits or cert expiry |
| No PyPI distribution | LOW | Git-based install is fragile for users |

---

## Recommended Actions (pending CTO-001 approval)

1. Enable branch protection on `main` (require PR + CI pass)
2. Set up uptime monitoring (UptimeRobot free tier or similar)
3. Identify website hosting provider to assess free tier limits
