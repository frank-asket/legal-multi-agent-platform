"""Ensure streamed graph run matches a single invoke (no double execution)."""

from __future__ import annotations

import asyncio

from legal_multi_agent.graph import build_legal_graph
from legal_multi_agent.state import initial_legal_state


async def _last_values_state(user_query: str) -> dict:
    g = build_legal_graph()
    base = initial_legal_state(
        thread_id="stream-test",
        user_query=user_query,
        document_ids=["demo-doc"],
    )
    last: dict | None = None
    async for mode, payload in g.astream(base, stream_mode=["updates", "values"]):
        if mode == "values":
            last = dict(payload)
    assert last is not None
    return last


def test_stream_last_values_matches_ainvoke() -> None:
    q = "Define confidential information."
    g = build_legal_graph()
    base = initial_legal_state(
        thread_id="invoke-test",
        user_query=q,
        document_ids=["demo-doc"],
    )
    invoked = asyncio.run(g.ainvoke(base))
    streamed = asyncio.run(_last_values_state(q))
    assert (
        invoked.get("analyst_answer", {}).get("plain_english")
        == streamed.get("analyst_answer", {}).get("plain_english")
    )
    assert invoked.get("auditor_verdict") == streamed.get("auditor_verdict")
