"""FastAPI app: production defaults — limits, auth, rate limits, request IDs, health probes."""

from __future__ import annotations

import json
import logging
import uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from legal_multi_agent.graph import build_legal_graph
from legal_multi_agent.openrouter import openrouter_configured, reset_openrouter_client
from legal_multi_agent.settings import get_settings
from legal_multi_agent.state import initial_legal_state
from server.middleware import RequestIdMiddleware
from server.security import (
    enforce_http_api_key,
    validate_thread_id_or_400,
    websocket_api_key_rejected,
    websocket_thread_id_invalid,
)

logger = logging.getLogger(__name__)

_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_legal_graph()
    return _compiled_graph


def _configure_logging() -> None:
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level, logging.INFO),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    _configure_logging()
    settings = get_settings()
    reset_openrouter_client()
    logger.info(
        "Startup settings log_level=%s rate_limit=%s openrouter=%s",
        settings.log_level,
        settings.rate_limit_per_minute,
        openrouter_configured(),
    )
    get_graph()
    yield
    logger.info("Shutdown")


def _rate_limit_string() -> str:
    r = get_settings().rate_limit_per_minute
    return f"{r}/minute" if r > 0 else "10000000/minute"


limiter = Limiter(key_func=get_remote_address, default_limits=[])

app = FastAPI(
    title="Legal Multi-Agent Platform",
    version="0.2.0",
    description="Agentic legal Q&A — librarian, researcher, counsel, auditor.",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

def _add_host_and_cors_middleware(application: FastAPI) -> None:
    settings = get_settings()
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    if hosts := settings.trusted_hosts_list():
        application.add_middleware(TrustedHostMiddleware, allowed_hosts=hosts)


_add_host_and_cors_middleware(app)
app.add_middleware(RequestIdMiddleware)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    rid = getattr(request.state, "request_id", None) or str(uuid.uuid4())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "request_id": rid},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    rid = getattr(request.state, "request_id", None) or str(uuid.uuid4())
    detail = exc.detail
    if not isinstance(detail, (str, list, dict)):
        detail = str(detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": detail, "request_id": rid},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    rid = getattr(request.state, "request_id", None) or str(uuid.uuid4())
    logger.exception("Unhandled error request_id=%s", rid)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "request_id": rid},
    )


def _slim_state_for_client(state: dict[str, Any]) -> dict[str, Any]:
    slim = dict(state)
    cbd = slim.get("chunks_by_document")
    if isinstance(cbd, dict):
        slim["chunks_by_document"] = {k: len(v) for k, v in cbd.items() if isinstance(v, list)}
    return slim


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ready")
def ready() -> dict[str, str | bool]:
    try:
        get_graph()
        return {"status": "ready", "openrouter_configured": openrouter_configured()}
    except Exception:
        logger.exception("Readiness check failed")
        raise HTTPException(status_code=503, detail="not_ready")


class QueryRequest(BaseModel):
    """Synchronous legal Q&A over the compiled graph (no streaming)."""

    user_query: str = Field(..., min_length=1)
    document_ids: list[str] = Field(default_factory=lambda: ["demo-doc"])
    thread_id: str = Field(default="http", min_length=1)

    @model_validator(mode="after")
    def enforce_payload_limits(self):
        s = get_settings()
        q = self.user_query.strip()
        if not q:
            raise ValueError("user_query is empty")
        if len(q) > s.max_user_query_chars:
            raise ValueError(
                f"user_query exceeds maximum length ({s.max_user_query_chars})"
            )
        object.__setattr__(self, "user_query", q)
        tid = self.thread_id.strip()
        if len(tid) > s.max_thread_id_chars:
            raise ValueError("thread_id too long")
        object.__setattr__(self, "thread_id", tid)
        if len(self.document_ids) > s.max_document_ids:
            raise ValueError(f"too many document_ids (max {s.max_document_ids})")
        for d in self.document_ids:
            if len(str(d)) > s.max_document_id_chars:
                raise ValueError("document_id too long")
        return self


class QueryResponse(BaseModel):
    state: dict[str, Any]


@app.post("/v1/query", response_model=QueryResponse)
@limiter.limit(_rate_limit_string())
async def query_legal(request: Request, req: QueryRequest) -> QueryResponse:
    """Runs the full LangGraph once. Apply API key (if configured) and rate limits."""
    validate_thread_id_or_400(req.thread_id)
    enforce_http_api_key(request)
    graph = get_graph()
    doc_ids = [str(x) for x in req.document_ids if str(x).strip()]
    if not doc_ids:
        doc_ids = ["demo-doc"]
    base = initial_legal_state(
        thread_id=req.thread_id,
        user_query=req.user_query,
        document_ids=doc_ids,
    )
    final = await graph.ainvoke(base)
    return QueryResponse(state=_slim_state_for_client(dict(final)))


@app.websocket("/ws/session/{thread_id}")
async def session_ws(websocket: WebSocket, thread_id: str) -> None:
    if websocket_api_key_rejected(websocket):
        await websocket.close(code=4001, reason="Unauthorized")
        return
    if websocket_thread_id_invalid(thread_id):
        await websocket.close(code=4000, reason="Invalid thread_id")
        return
    await websocket.accept()
    graph = get_graph()
    max_bytes = get_settings().max_ws_message_bytes
    try:
        while True:
            raw = await websocket.receive_text()
            if len(raw.encode("utf-8")) > max_bytes:
                await websocket.send_json(
                    {
                        "type": "error",
                        "detail": f"message exceeds maximum size ({max_bytes} bytes)",
                    }
                )
                continue
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "Invalid JSON"})
                continue

            user_query = (
                str(payload.get("user_query") or payload.get("query") or "").strip()
            )
            document_ids = payload.get("document_ids")
            if not isinstance(document_ids, list) or not document_ids:
                document_ids = ["demo-doc"]

            s = get_settings()
            if len(user_query) > s.max_user_query_chars:
                await websocket.send_json(
                    {
                        "type": "error",
                        "detail": f"user_query exceeds maximum length ({s.max_user_query_chars})",
                    }
                )
                continue
            ids = [str(x) for x in document_ids if str(x).strip()]
            if len(ids) > s.max_document_ids:
                await websocket.send_json(
                    {
                        "type": "error",
                        "detail": f"too many document_ids (max {s.max_document_ids})",
                    }
                )
                continue
            bad_doc = False
            for d in ids:
                if len(d) > s.max_document_id_chars:
                    await websocket.send_json(
                        {"type": "error", "detail": "document_id too long"}
                    )
                    bad_doc = True
                    break
            if bad_doc:
                continue

            if not user_query:
                await websocket.send_json(
                    {"type": "error", "detail": "user_query is required"}
                )
                continue

            base = initial_legal_state(
                thread_id=thread_id,
                user_query=user_query,
                document_ids=ids,
            )

            final_slim: dict[str, Any] | None = None
            async for mode, pl in graph.astream(base, stream_mode=["updates", "values"]):
                if mode == "updates":
                    await websocket.send_json({"type": "update", "delta": pl})
                elif mode == "values":
                    final_slim = _slim_state_for_client(dict(pl))

            if final_slim is not None:
                await websocket.send_json({"type": "result", "state": final_slim})
    except WebSocketDisconnect:
        logger.debug("WebSocket disconnected thread_id=%s", thread_id)
