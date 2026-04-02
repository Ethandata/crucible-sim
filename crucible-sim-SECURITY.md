# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ Yes     |
| < 2.0   | ❌ No      |

## Reporting a Vulnerability

**Please do not file public GitHub issues for security vulnerabilities.**

Report security issues by emailing: **hello@crucible-ai.net**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your suggested fix (optional)

We will acknowledge receipt within **48 hours** and aim to issue a fix or mitigation within **14 days** for critical issues.

## Scope

The following are in scope for security reports:

- **Code execution vulnerabilities** — `crucible evaluate` and `load_agent()` execute arbitrary Python. Any path traversal, sandbox escape, or privilege escalation is critical.
- **Trace integrity** — signed JSON-T traces should not be forgeable or silently modifiable
- **Score manipulation** — any vector that allows benchmark scores to be inflated without corresponding agent behavior change (Law IV violation)
- **Dependency vulnerabilities** — critical CVEs in direct dependencies

## Out of Scope

- Social engineering attacks
- Vulnerabilities in third-party services (LangGraph, CrewAI, etc.)
- Issues only reproducible on unsupported versions

## Security Design Notes

The `crucible evaluate` CLI is explicitly designed to execute agent code you provide.
**Only evaluate agent files you trust.** This is documented in the README security note.
Do not use Crucible to evaluate untrusted agent code in a shared or production environment
without sandboxing the process externally (e.g., Docker, gVisor).

## Disclosure Policy

We follow coordinated disclosure. We will credit researchers in release notes
unless they request anonymity.
