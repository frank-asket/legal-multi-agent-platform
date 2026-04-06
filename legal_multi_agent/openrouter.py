"""
OpenRouter client (OpenAI-compatible API) with JSON helpers and safe parsing.

Config: legal_multi_agent.settings / OPENROUTER_* env. Without a key, nodes use local stubs.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Literal

from openai import AsyncOpenAI

from legal_multi_agent.settings import get_settings

logger = logging.getLogger(__name__)

_ASYNC_CLIENT: AsyncOpenAI | None = None

_DEFAULT_BASE = "https://openrouter.ai/api/v1"


def reset_openrouter_client() -> None:
    """Clear cached HTTP client (tests or config reload)."""
    global _ASYNC_CLIENT
    _ASYNC_CLIENT = None


def openrouter_configured() -> bool:
    key = get_settings().openrouter_api_key
    if key is None:
        return False
    return bool(key.get_secret_value().strip())


def _get_async_client() -> AsyncOpenAI:
    global _ASYNC_CLIENT
    if _ASYNC_CLIENT is None:
        s = get_settings()
        secret = s.openrouter_api_key
        if secret is None:
            raise RuntimeError("OPENROUTER_API_KEY is not set")
        key = secret.get_secret_value().strip()
        if not key:
            raise RuntimeError("OPENROUTER_API_KEY is not set")
        base = (s.openrouter_base_url or _DEFAULT_BASE).strip().rstrip("/") or _DEFAULT_BASE
        ref = (s.openrouter_http_referer or "https://localhost").strip() or "https://localhost"
        title = (s.openrouter_app_title or "Legal Multi-Agent Platform").strip()
        _ASYNC_CLIENT = AsyncOpenAI(
            api_key=key,
            base_url=base,
            timeout=s.openrouter_timeout_sec,
            max_retries=2,
            default_headers={
                "HTTP-Referer": ref,
                "X-Title": title,
            },
        )
    return _ASYNC_CLIENT


LLMRole = Literal["researcher", "counsel", "auditor"]


def model_for_role(role: LLMRole) -> str:
    s = get_settings()
    defaults: dict[LLMRole, str] = {
        "researcher": "openai/gpt-4o-mini",
        "counsel": "anthropic/claude-3.5-sonnet",
        "auditor": "openai/gpt-4o-mini",
    }
    override: dict[LLMRole, str | None] = {
        "researcher": s.legal_llm_model_researcher,
        "counsel": s.legal_llm_model_counsel,
        "auditor": s.legal_llm_model_auditor,
    }
    raw = (override[role] or "").strip()
    return raw or defaults[role]


def _strip_markdown_fence(text: str) -> str:
    t = text.strip()
    m = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```\s*$", t, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return t


def extract_json_object(text: str) -> dict[str, Any]:
    """Parse a JSON object from model output; handles fences and trailing junk."""
    t = _strip_markdown_fence(text)
    try:
        out = json.loads(t)
        if isinstance(out, dict):
            return out
    except json.JSONDecodeError:
        pass
    start = t.find("{")
    end = t.rfind("}")
    if start != -1 and end > start:
        out = json.loads(t[start : end + 1])
        if isinstance(out, dict):
            return out
    raise ValueError("Model output did not contain a JSON object")


async def chat_completion_json(
    *,
    model: str,
    system: str,
    user: str,
    temperature: float = 0.2,
    max_tokens: int = 2048,
) -> dict[str, Any]:
    """
    Request a JSON object from the model. Retries without response_format if unsupported.
    """
    if not openrouter_configured():
        raise RuntimeError("OPENROUTER_API_KEY is not set")
    client = _get_async_client()
    kwargs: dict[str, Any] = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    try:
        resp = await client.chat.completions.create(
            **kwargs, response_format={"type": "json_object"}
        )
    except Exception as e:
        logger.warning("OpenRouter json_object rejected (%s); retrying without it", e)
        resp = await client.chat.completions.create(**kwargs)
    choice = resp.choices[0]
    content = (choice.message.content or "").strip()
    if not content:
        raise ValueError("Empty completion")
    return extract_json_object(content)
