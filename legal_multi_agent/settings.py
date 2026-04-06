"""Application settings (environment + .env). Single source of truth for production config."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- API / HTTP ---
    log_level: str = Field(default="INFO", description="Logging level")
    cors_allow_origins: str = Field(
        default="*",
        description="Comma-separated origins, or * (tighten in production)",
    )
    trusted_hosts: str = Field(
        default="",
        description="Comma-separated hostnames for TrustedHostMiddleware; empty disables",
    )
    api_keys: str = Field(
        default="",
        description="Comma-separated API keys; empty disables X-API-Key checks",
    )
    rate_limit_per_minute: int = Field(
        default=0,
        ge=0,
        description="Default rate limit for /v1/query; 0 = no limit",
    )

    # --- Payload limits ---
    max_user_query_chars: int = Field(default=16_000, ge=256, le=500_000)
    max_thread_id_chars: int = Field(default=128, ge=8, le=256)
    max_document_ids: int = Field(default=50, ge=1, le=500)
    max_document_id_chars: int = Field(default=256, ge=32, le=1024)
    max_ws_message_bytes: int = Field(default=262_144, ge=1024, le=2_097_152)

    # --- OpenRouter ---
    openrouter_api_key: SecretStr | None = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_http_referer: str = "https://localhost"
    openrouter_app_title: str = "Legal Multi-Agent Platform"
    openrouter_timeout_sec: float = Field(default=120.0, ge=5.0, le=600.0)

    legal_llm_model_researcher: str | None = None
    legal_llm_model_counsel: str | None = None
    legal_llm_model_auditor: str | None = None
    legal_llm_max_tokens_counsel: int = Field(default=3072, ge=256, le=8192)

    database_url: str | None = Field(default=None, description="Optional Postgres URL (future retrieval)")

    @field_validator("log_level")
    @classmethod
    def log_level_upper(cls, v: str) -> str:
        return v.upper()

    def cors_origins_list(self) -> list[str]:
        raw = self.cors_allow_origins.strip()
        if raw == "*":
            return ["*"]
        return [x.strip() for x in raw.split(",") if x.strip()]

    def trusted_hosts_list(self) -> list[str]:
        return [x.strip() for x in self.trusted_hosts.split(",") if x.strip()]

    def api_key_set(self) -> frozenset[str]:
        if not self.api_keys.strip():
            return frozenset()
        return frozenset(x.strip() for x in self.api_keys.split(",") if x.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()


def reset_settings_cache() -> None:
    """For tests that mutate environment between cases."""
    get_settings.cache_clear()
