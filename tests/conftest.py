"""
Pytest hooks: deterministic security/rate-limit defaults before `server.main` imports settings.
"""

from __future__ import annotations

import os

# Forced so local `.env` never enables paid LLM calls or auth during unit tests.
os.environ["API_KEYS"] = ""
os.environ["RATE_LIMIT_PER_MINUTE"] = "0"
os.environ["OPENROUTER_API_KEY"] = ""

import pytest

from legal_multi_agent.openrouter import reset_openrouter_client
from legal_multi_agent.settings import reset_settings_cache


@pytest.fixture(autouse=True)
def _reset_service_caches() -> None:
    reset_settings_cache()
    reset_openrouter_client()
    yield
    reset_settings_cache()
    reset_openrouter_client()
