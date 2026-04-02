# Contributing to crucible-sim

Thank you for your interest in contributing to Crucible — the economic autonomy standard for AI agents.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/crucible-sim.git
   cd crucible-sim
   ```
3. **Install** in development mode:
   ```bash
   pip install -e ".[dev]"
   ```
4. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Making Changes

- Keep changes focused — one logical change per PR
- Add or update tests for any new behavior
- Run the test suite before submitting:
  ```bash
  pytest tests/ -v
  ```
- Follow existing code style (PEP 8, type hints where present)

## Submitting a Pull Request

1. Push your branch to your fork
2. Open a Pull Request against `main` on `Ethandata/crucible-sim`
3. Fill in the PR description: what changed, why, and how to test it
4. CI must pass (pytest gate) before merge

## Reporting Issues

- Use [GitHub Issues](https://github.com/Ethandata/crucible-sim/issues)
- Include: Python version, OS, steps to reproduce, expected vs actual behavior
- For security issues, see [SECURITY.md](./SECURITY.md) — do **not** file a public issue

## Law IV — Benchmark Integrity

Crucible is a benchmark and certification product. Any change that could affect
scoring output (D1–D9, Phi index, trace signing) must include:

- A test that demonstrates the before/after behavior
- An explicit note in the PR that it affects scoring

We do not ship changes that could silently inflate or deflate benchmark scores.

## Code of Conduct

Be direct, be honest, be useful. We review PRs on merit.

## Questions?

Open an issue or email hello@crucible-ai.net.
