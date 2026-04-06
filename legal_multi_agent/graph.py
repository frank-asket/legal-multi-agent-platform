"""LangGraph workflow: librarian → researcher → counsel → auditor (with optional retry)."""

from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from legal_multi_agent.nodes import (
    auditor_node,
    counsel_node,
    librarian_node,
    researcher_node,
    route_after_audit,
)
from legal_multi_agent.state import LegalGraphState


def build_legal_graph():
    g = StateGraph(LegalGraphState)
    g.add_node("librarian", librarian_node)
    g.add_node("researcher", researcher_node)
    g.add_node("counsel", counsel_node)
    g.add_node("auditor", auditor_node)

    g.add_edge(START, "librarian")
    g.add_edge("librarian", "researcher")
    g.add_edge("researcher", "counsel")
    g.add_edge("counsel", "auditor")
    g.add_conditional_edges(
        "auditor",
        route_after_audit,
        {"researcher": "researcher", "end": END},
    )
    return g.compile()


__all__ = ["build_legal_graph"]
