"""Multi-agent legal Q&A — LangGraph state and workflow builders."""

from legal_multi_agent.graph import build_legal_graph
from legal_multi_agent.state import LegalGraphState, initial_legal_state

__all__ = ["LegalGraphState", "build_legal_graph", "initial_legal_state"]
