"""
Crucible Python SDK — agent evaluation and evolution loop.

Quick start:
    from crucible.evolver import evolve
    records = evolve(scenario="scarcity_ops_v1", framework="openai", agent_name="My Agent")
"""
from crucible.evolver import evolve, AgentConfig, EvolutionRecord, run_agent

__version__ = "0.1.0"
__all__ = ["evolve", "AgentConfig", "EvolutionRecord", "run_agent"]
