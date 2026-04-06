<div align="center">

<a href="https://github.com/frank-asket/legal-multi-agent-platform">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=28&duration=3200&pause=900&color=1F6FEB&center=true&vCenter=true&width=820&lines=Legal+Multi-Agent+Platform;Grounded+legal+Q%26A+%E2%80%94+from+retrieval+to+verified+answers" alt="Legal Multi-Agent Platform animated title" />
</a>

**Agentic contracts intelligence — multi-model retrieval, drafting, and faithfulness auditing on your documents.**

<br />

[![Python](https://img.shields.io/badge/python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-workflow-3C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-LLM-6366F1?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)

[![CI](https://img.shields.io/github/actions/workflow/status/frank-asket/legal-multi-agent-platform/ci.yml?branch=main&label=CI&logo=githubactions&style=flat-square)](https://github.com/frank-asket/legal-multi-agent-platform/actions/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)](./Dockerfile)
[![pytest](https://img.shields.io/badge/pytest-suite-0A9EDC?style=flat-square&logo=pytest&logoColor=white)](./pyproject.toml)

<br />

[Features](#-what-you-get) · [Architecture](#-architecture) · [Quick start](#-quick-start) · [Web UI](#-web-ui-nextjs) · [API](#-http--websocket-api) · [Production](#-production-hardening) · [Repo map](#-repository-map)

</div>

---

## What you get

| | Capability |
|---|-------------|
| **Agents** | Sequential **Librarian → Researcher → Counsel → Auditor** flow with conditional **retry** back to retrieval when grounding fails. |
| **Models** | Optional **OpenRouter** with **different model IDs** per role (researcher / counsel / auditor); offline stubs when no API key. |
| **Grounding** | Counsel answers constrained to retrieved chunks; auditor checks faithfulness and suggests **retrieval refinements**. |
| **Delivery** | **Next.js** console in `frontend/`, plus **REST** and **WebSocket** streaming in one graph execution. |
| **Operations** | Typed **settings**, request IDs, optional **API keys**, **rate limits**, CORS / trusted hosts, **Docker** + **GitHub Actions** CI. |

---

## Architecture

Agents share a single **`LegalGraphState`** (chunks, ranked passages, analyst answer, auditor verdict, playbook flags, status log). The auditor can route back to the researcher until retries are exhausted.

```mermaid
flowchart LR
  subgraph ingest [Ingest]
    L[Librarian]
  end
  subgraph retrieve [Retrieve]
    R[Researcher]
  end
  subgraph reason [Reason]
    C[Counsel]
  end
  subgraph verify [Verify]
    A[Auditor]
  end
  L --> R --> C --> A
  A -->|retry if not grounded| R
  A -->|done| Z([End])
```

---

## Quick start

```bash
git clone https://github.com/frank-asket/legal-multi-agent-platform.git
cd legal-multi-agent-platform
python3.11 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
uvicorn server.main:app --reload --host 0.0.0.0 --port 8010
```

| Goal | Command / URL |
|------|----------------|
| Liveness | `GET http://127.0.0.1:8010/health` |
| Readiness | `GET http://127.0.0.1:8010/health/ready` |

Configure **OpenRouter** and per-role models in `.env` when you are ready for live LLMs (see `.env.example`).

Set **`CORS_ALLOW_ORIGINS`** to include **`http://localhost:3000`** when running the Next.js dev server (see `.env.example`).

---

## Web UI (Next.js)

The console is inspired by a clean **legal-services** layout: dark hero, light inquiry area, pill **focus** tags, underline fields, and **Send message** / **HTTP** actions.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open **`http://localhost:3000`**. The app calls the API at **`NEXT_PUBLIC_API_URL`** (default `http://127.0.0.1:8010`): **WebSocket** streaming for agent steps and **POST /v1/query** for one-shot runs.

Put **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** in **`frontend/.env.local`** (see **`frontend/.env.example`**). Do not commit real keys; GitHub push protection may reject commits that contain development key material resembling other vendors’ test credentials.

**GitHub Actions:** add **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** as [repository secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) so the **frontend** CI job can run **`next build`**. You do not need **`CLERK_ENCRYPTION_KEY`** unless you use Clerk’s advanced middleware dynamic-key setup; with a normal secret key the SDK encrypts request data using that secret.

If **`API_KEYS`** is set on the API, paste a key in the form (stored in **`sessionStorage`** only). Browsers cannot send **`X-API-Key`** on WebSocket handshakes, so the UI uses **`?api_key=`** on the socket URL — prefer **WSS** behind TLS in production.

**Docker:** add **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** to the repo root **`.env`**. Compose passes the publishable key as a build arg and mounts **`CLERK_SECRET_KEY`** as a [BuildKit secret](https://docs.docker.com/build/building/secrets/) for **`npm run build`** only (it is not saved in image layers). The same **`.env`** supplies **`CLERK_SECRET_KEY`** at container runtime for **`next start`**. Use a recent Docker / Docker Compose with BuildKit enabled (default on Docker Desktop). Manual builds:  
`docker build --secret id=clerk_secret,env=CLERK_SECRET_KEY -f frontend/Dockerfile frontend`

---

## HTTP & WebSocket API

| Surface | Method / path | Purpose |
|---------|---------------|---------|
| **REST** | `POST /v1/query` | One-shot run; JSON body with `user_query`, `document_ids`, `thread_id`. |
| **Stream** | `WS /ws/session/{thread_id}` | Send JSON: `{"user_query": "...", "document_ids": ["demo-doc"]}`; receive `update` then `result`. |

**Headers (optional)**

- `X-Request-ID` — echoed on responses for tracing.
- `X-API-Key` — required when `API_KEYS` is set in the environment.

---

## Production hardening

1. **Environment** — Tighten `CORS_ALLOW_ORIGINS`, set `TRUSTED_HOSTS`, enable `API_KEYS` for service-to-service calls, and set `RATE_LIMIT_PER_MINUTE` on `/v1/query`. See `.env.example` for payload limits and OpenRouter options.
2. **Edge** — Terminate TLS at your reverse proxy; the bundled **Dockerfile** runs Uvicorn with `--proxy-headers --forwarded-allow-ips` for forwarded client metadata.
3. **Ship** — `docker compose up --build` uses `docker-compose.yml` and reads `.env`.

Logs include path, status, duration, and **`request_id`**; error JSON responses include **`request_id`** where applicable.

---

## Repository map

| Path | Role |
|------|------|
| `legal_multi_agent/settings.py` | Environment and limits (Pydantic Settings). |
| `legal_multi_agent/state.py` | Shared graph state and citation types. |
| `legal_multi_agent/graph.py` | LangGraph build and auditor routing. |
| `legal_multi_agent/nodes.py` | Librarian, researcher, counsel, auditor implementations. |
| `legal_multi_agent/openrouter.py` | OpenRouter / OpenAI-compatible JSON completions. |
| `server/main.py` | FastAPI app, lifespan, rate limits, WebSocket session. |
| `server/middleware.py` | Request ID and access logging. |
| `server/security.py` | API key and thread / payload checks. |
| `frontend/` | Next.js App Router UI (Tailwind, lucide-react). |

---

## Optional: Postgres and pgvector

```bash
pip install -e ".[db]"
```

Extend hybrid retrieval in `legal_multi_agent/nodes.py` (`researcher_node`).

---

## Tests and CI

```bash
pytest
```

CI runs on **Python 3.11** and **3.12** (see `.github/workflows/ci.yml`). Unit tests pin `OPENROUTER_API_KEY` empty so runs stay **offline and deterministic**.

---

<div align="center">

**Built for teams that need traceable, multi-step legal Q&A — not a black-box chatbot.**

<sub>Typing animation via <a href="https://github.com/DenverCoder1/readme-typing-svg">readme-typing-svg</a> · Badges via <a href="https://shields.io">Shields.io</a></sub>

</div>
