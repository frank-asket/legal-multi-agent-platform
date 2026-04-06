# syntax=docker/dockerfile:1
FROM python:3.11-slim-bookworm AS runtime

RUN useradd --create-home --shell /usr/sbin/nologin appuser

WORKDIR /app

COPY pyproject.toml README.md ./
COPY legal_multi_agent ./legal_multi_agent
COPY server ./server

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir .

USER appuser

ENV PYTHONUNBUFFERED=1
EXPOSE 8010

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8010/health').read()" || exit 1

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8010", "--proxy-headers", "--forwarded-allow-ips", "*"]
