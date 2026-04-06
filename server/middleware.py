"""HTTP middleware: request IDs and access timing."""

from __future__ import annotations

import logging
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("legal_platform.http")


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        rid = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = rid
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.exception(
                "request failed path=%s method=%s duration_ms=%.2f request_id=%s",
                request.url.path,
                request.method,
                duration_ms,
                rid,
            )
            raise
        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = rid
        logger.info(
            "request path=%s method=%s status=%s duration_ms=%.2f request_id=%s",
            request.url.path,
            request.method,
            getattr(response, "status_code", "?"),
            duration_ms,
            rid,
        )
        return response
