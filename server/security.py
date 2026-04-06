"""Input validation and optional API-key checks for HTTP and WebSockets."""

from __future__ import annotations

import re

from fastapi import HTTPException, Request, WebSocket

from legal_multi_agent.settings import get_settings

_THREAD_ID_RE = re.compile(r"^[A-Za-z0-9._\-]{1,256}$")


def enforce_http_api_key(request: Request) -> None:
    keys = get_settings().api_key_set()
    if not keys:
        return
    supplied = request.headers.get("X-API-Key", "").strip()
    if supplied not in keys:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def websocket_api_key_rejected(websocket: WebSocket) -> bool:
    """
    Returns True if the connection should be rejected (401).
    Call before accept().
    """
    keys = get_settings().api_key_set()
    if not keys:
        return False
    supplied = websocket.headers.get("X-API-Key", "").strip() or websocket.headers.get(
        "x-api-key", ""
    ).strip()
    return supplied not in keys


def validate_thread_id_or_400(thread_id: str) -> None:
    s = get_settings()
    if len(thread_id) > s.max_thread_id_chars or not _THREAD_ID_RE.match(thread_id):
        raise HTTPException(status_code=400, detail="Invalid thread_id")


def websocket_thread_id_invalid(thread_id: str) -> bool:
    s = get_settings()
    return len(thread_id) > s.max_thread_id_chars or not _THREAD_ID_RE.match(thread_id)
