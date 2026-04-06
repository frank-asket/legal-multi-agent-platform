"""
Agent nodes: librarian (stub corpus), researcher / counsel / auditor with OpenRouter
when OPENROUTER_API_KEY is set; otherwise deterministic stubs for local dev and CI.
"""

from __future__ import annotations

import json
import re
from typing import Any, Literal, cast

from legal_multi_agent.openrouter import chat_completion_json, model_for_role, openrouter_configured
from legal_multi_agent.settings import get_settings
from legal_multi_agent.state import (
    AgentStatusEvent,
    AnalystAnswer,
    AuditorVerdict,
    GlobalDefinitionEntry,
    LegalChunk,
    LegalGraphState,
    PlaybookFlag,
    RankedPassage,
    RetrievalQuery,
    SourceSpan,
)


def _status(
    agent: AgentStatusEvent["agent"],
    phase: str,
    detail: str,
    *,
    document_id: str | None = None,
) -> AgentStatusEvent:
    ev: AgentStatusEvent = {"agent": agent, "phase": phase, "detail": detail}
    if document_id is not None:
        ev["document_id"] = document_id
    return ev


def _demo_chunks(document_ids: list[str]) -> dict[str, list[LegalChunk]]:
    """Deterministic placeholder corpus until real ingestion lands."""
    out: dict[str, list[LegalChunk]] = {}
    for doc_id in document_ids:
        hdr = ["1. Definitions", "1.1 Confidential Information"]
        out[doc_id] = [
            LegalChunk(
                chunk_id=f"{doc_id}-chunk-def",
                document_id=doc_id,
                text=(
                    '"Confidential Information" means all non-public information disclosed '
                    "by either party, whether marked confidential or not."
                ),
                page_number=1,
                section_number="1.1",
                section_title="Confidential Information",
                parent_headers=hdr,
                is_table=False,
            ),
            LegalChunk(
                chunk_id=f"{doc_id}-chunk-liab",
                document_id=doc_id,
                text=(
                    "Limitation of Liability. Except for breaches of confidentiality or "
                    "indemnity obligations, each party's aggregate liability shall not exceed "
                    "the fees paid in the twelve months preceding the claim."
                ),
                page_number=5,
                section_number="8",
                section_title="Limitation of Liability",
                parent_headers=["8. Limitation of Liability"],
                is_table=False,
            ),
        ]
    return out


def _rank_passages(
    expanded: list[str],
    q: str,
    doc_ids: list[str],
    chunks_by_doc: dict[str, list[LegalChunk]],
    limit: int = 6,
) -> list[RankedPassage]:
    passages: list[RankedPassage] = []
    q_l = q.lower()
    for doc_id in doc_ids:
        for ch in chunks_by_doc.get(doc_id, []):
            text_l = ch["text"].lower()
            score = sum(1 for term in expanded if term.lower() and term.lower() in text_l)
            hybrid = float(score) * 0.5 + (
                1.0 if "liabilit" in q_l and "liabilit" in text_l else 0.2
            )
            passages.append(
                RankedPassage(
                    chunk=ch,
                    vector_score=hybrid,
                    lexical_score=float(score),
                    hybrid_score=hybrid,
                )
            )
    passages.sort(key=lambda p: p["hybrid_score"], reverse=True)
    return passages[:limit]


async def _expand_queries_llm(
    raw_question: str,
    feedback_keywords: list[str],
) -> tuple[list[str], list[str]]:
    system = (
        "You generate concise retrieval queries for legal contract clauses. "
        'Reply with valid JSON only: {"expanded_queries": string[], '
        '"must_match_sections": string[]}. '
        "expanded_queries: 3–6 short phrases or questions. "
        "must_match_sections: optional section labels to prefer; use [] if none."
    )
    fk = ", ".join(feedback_keywords[:12]) if feedback_keywords else "(none)"
    user = f"USER_QUESTION:\n{raw_question}\n\nPRIOR_RETRY_KEYWORDS:\n{fk}\n"
    data = await chat_completion_json(
        model=model_for_role("researcher"),
        system=system,
        user=user,
        temperature=0.25,
        max_tokens=320,
    )
    eq = data.get("expanded_queries") or []
    ms = data.get("must_match_sections") or []
    if not isinstance(eq, list):
        eq = []
    if not isinstance(ms, list):
        ms = []
    out_q = [str(x).strip() for x in eq if str(x).strip()]
    out_m = [str(x).strip() for x in ms if str(x).strip()]
    return out_q, out_m


async def librarian_node(state: LegalGraphState) -> dict:
    """Ingestion architect: stub loads demo chunks + synthetic definitions."""
    doc_ids = list(state.get("document_ids") or [])
    chunks = _demo_chunks(doc_ids)
    defs: list[GlobalDefinitionEntry] = []
    for doc_id in doc_ids:
        for ch in chunks.get(doc_id, []):
            if "Definitions" in " ".join(ch.get("parent_headers") or []):
                defs.append(
                    GlobalDefinitionEntry(
                        term="Confidential Information",
                        definition=ch["text"][:280],
                        source_id=f"src-{ch['chunk_id']}",
                        page_number=ch["page_number"],
                    )
                )
                break
    return {
        "chunks_by_document": chunks,
        "global_definitions": defs,
        "status_log": [
            _status("librarian", "ingest", f"Indexed {sum(len(v) for v in chunks.values())} chunks")
        ],
    }


async def researcher_node(state: LegalGraphState) -> dict:
    """Retrieval: optional LLM query expansion; hybrid-style ranking over chunks."""
    q = state.get("user_query") or ""
    doc_ids = list(state.get("document_ids") or [])
    chunks_by_doc = state.get("chunks_by_document") or {}
    feedback = state.get("retrieval_feedback")
    fb_kw = list(feedback.get("suggested_keywords") or []) if feedback else []

    expanded = [q]
    must_match: list[str] = []
    if openrouter_configured():
        try:
            eq, ms = await _expand_queries_llm(q, fb_kw)
            expanded = [q] + [x for x in eq if x and x != q]
            must_match = ms
        except Exception as e:
            expanded = [q] + fb_kw
            must_match = []
            err = f"researcher OpenRouter expansion failed: {e}"
            return {
                "retrieval_query": RetrievalQuery(
                    raw_question=q,
                    expanded_queries=expanded,
                    must_match_sections=must_match,
                    document_ids=doc_ids,
                ),
                "candidate_passages": _rank_passages(expanded, q, doc_ids, chunks_by_doc),
                "status_log": [
                    _status("researcher", "retrieve", "LLM expansion failed; keywords only"),
                ],
                "errors": [err],
            }
    else:
        if fb_kw:
            extended = [q, *fb_kw]
        else:
            extended = [q]

    # Dedupe while preserving order
    seen: set[str] = set()
    expanded_clean: list[str] = []
    for t in expanded if openrouter_configured() else extended:
        k = t.lower()
        if k not in seen:
            seen.add(k)
            expanded_clean.append(t)

    top = _rank_passages(expanded_clean, q, doc_ids, chunks_by_doc)
    detail = (
        f"OpenRouter expansion + {len(top)} passages"
        if openrouter_configured()
        else f"Selected {len(top)} passages for counsel"
    )
    return {
        "retrieval_query": RetrievalQuery(
            raw_question=q,
            expanded_queries=expanded_clean,
            must_match_sections=must_match,
            document_ids=doc_ids,
        ),
        "candidate_passages": top,
        "status_log": [_status("researcher", "retrieve", detail)],
    }


def _mock_high_risk_flags(passages: list[RankedPassage]) -> list[PlaybookFlag]:
    flags: list[PlaybookFlag] = []
    for rp in passages:
        t = rp["chunk"]["text"].lower()
        if "unlimited" in t and "indemn" in t:
            flags.append(
                PlaybookFlag(
                    rule_id="indemnity-unlimited",
                    label="Unlimited indemnity",
                    severity="critical",
                    rationale="Unlimited indemnity increases exposure materially.",
                    source_id=f"src-{rp['chunk']['chunk_id']}",
                )
            )
    return flags


_SEVERITIES = ("low", "medium", "high", "critical")


def _normalize_playbook_flags(raw: Any, chunk_ids: set[str]) -> list[PlaybookFlag]:
    if not isinstance(raw, list):
        return []
    out: list[PlaybookFlag] = []
    for item in raw[:16]:
        if not isinstance(item, dict):
            continue
        sev = str(item.get("severity", "medium")).lower()
        if sev not in _SEVERITIES:
            sev = "medium"
        sid = item.get("source_id")
        if sid is not None:
            sid = str(sid)
            ck = sid.removeprefix("src-")
            if ck not in chunk_ids:
                sid = None
        flag = PlaybookFlag(
            rule_id=str(item.get("rule_id", "custom"))[:64],
            label=str(item.get("label", "Risk"))[:200],
            severity=cast(Literal["low", "medium", "high", "critical"], sev),
            rationale=str(item.get("rationale", ""))[:2000],
        )
        if sid:
            flag["source_id"] = sid
        out.append(flag)
    return out


def _counsel_stub(state: LegalGraphState) -> AnalystAnswer:
    passages = list(state.get("candidate_passages") or [])
    q = state.get("user_query") or ""
    defs = state.get("global_definitions") or []
    if not passages:
        return AnalystAnswer(plain_english="No retrieved passages. Cannot answer without source text.", claims=[], cited_spans=[])
    top = passages[0]["chunk"]
    sid = f"src-{top['chunk_id']}"
    excerpt = top["text"][:320]
    def_hints = "; ".join(d["term"] for d in defs[:3]) or "n/a"
    answer = (
        f"The agreement states: {excerpt} "
        f"(Defined terms noted: {def_hints}). "
        f"Citation: {sid}."
    )
    spans = [
        SourceSpan(
            source_id=sid,
            chunk_id=top["chunk_id"],
            document_id=top["document_id"],
            pdf={"document_id": top["document_id"], "page_number": int(top.get("page_number", 1))},
            section_path=" > ".join(top.get("parent_headers") or []),
            text_excerpt=excerpt,
        )
    ]
    return AnalystAnswer(
        plain_english=answer,
        claims=[{"text": answer, "source_ids": [s["source_id"] for s in spans]}],
        cited_spans=spans,
    )


def _dedupe_playbook_flags(flags: list[PlaybookFlag]) -> list[PlaybookFlag]:
    seen: set[str] = set()
    out: list[PlaybookFlag] = []
    for f in flags:
        rid = f["rule_id"]
        if rid in seen:
            continue
        seen.add(rid)
        out.append(f)
    return out


def _max_tokens_counsel() -> int:
    return min(get_settings().legal_llm_max_tokens_counsel, 8192)


async def _counsel_openrouter(
    state: LegalGraphState,
) -> tuple[AnalystAnswer, list[PlaybookFlag]]:
    passages = list(state.get("candidate_passages") or [])
    q = state.get("user_query") or ""
    defs = state.get("global_definitions") or []
    if not passages:
        return AnalystAnswer(plain_english="No retrieved passages. Cannot answer without source text.", claims=[], cited_spans=[])

    passage_payload = []
    allowed: set[str] = set()
    for i, rp in enumerate(passages):
        ch = rp["chunk"]
        allowed.add(ch["chunk_id"])
        passage_payload.append(
            {
                "index": i + 1,
                "chunk_id": ch["chunk_id"],
                "document_id": ch["document_id"],
                "source_id": f"src-{ch['chunk_id']}",
                "page_number": ch.get("page_number", 1),
                "section_path": " > ".join(ch.get("parent_headers") or []),
                "text": ch["text"],
            }
        )
    def_lines = [f"- {d['term']}: {d['definition'][:400]}" for d in defs[:12]]

    system = (
        "You are senior transactional counsel. Answer ONLY using SOURCE_PASSAGES. "
        "Do not invent facts, clauses, or citations. If sources are insufficient, say exactly what is missing. "
        "Write plain_english as short paragraphs grounded in the sources. "
        "Every factual claim in plain_english must be supported by cited_spans. "
        "Use only chunk_id values from SOURCE_PASSAGES. "
        "Return valid JSON with keys: plain_english (string), "
        "claims (array of {text, source_ids}), "
        "cited_spans (array of {source_id, chunk_id, document_id, page_number, section_path, text_excerpt}), "
        "playbook_flags (optional array of {rule_id, label, severity, rationale, source_id?}). "
        "severity must be one of: low, medium, high, critical."
    )
    user = (
        f"QUESTION:\n{q}\n\n"
        f"DEFINITIONS (hints):\n" + "\n".join(def_lines or ["(none)"]) + "\n\n"
        f"SOURCE_PASSAGES:\n{_json_dumps_safe(passage_payload)}\n"
    )
    data = await chat_completion_json(
        model=model_for_role("counsel"),
        system=system,
        user=user,
        temperature=0.2,
        max_tokens=_max_tokens_counsel(),
    )

    plain = str(data.get("plain_english") or "").strip()
    claims_raw = data.get("claims") if isinstance(data.get("claims"), list) else []
    spans_raw = data.get("cited_spans") if isinstance(data.get("cited_spans"), list) else []
    chunk_by_id = {p["chunk"]["chunk_id"]: p["chunk"] for p in passages}

    cited_spans: list[SourceSpan] = []
    for s in spans_raw[:24]:
        if not isinstance(s, dict):
            continue
        cid = str(s.get("chunk_id") or "")
        if cid not in allowed:
            continue
        ch = chunk_by_id[cid]
        sid = str(s.get("source_id") or f"src-{cid}")
        excerpt = str(s.get("text_excerpt") or ch["text"])[:1200]
        pg = int(s.get("page_number") or ch.get("page_number") or 1)
        doc_id = str(s.get("document_id") or ch["document_id"])
        section_path = str(s.get("section_path") or " > ".join(ch.get("parent_headers") or []))
        cited_spans.append(
            SourceSpan(
                source_id=sid,
                chunk_id=cid,
                document_id=doc_id,
                pdf={"document_id": doc_id, "page_number": pg},
                section_path=section_path,
                text_excerpt=excerpt,
            )
        )

    claims: list[dict[str, Any]] = []
    for c in claims_raw[:24]:
        if isinstance(c, dict) and c.get("text"):
            claims.append(
                {
                    "text": str(c["text"]),
                    "source_ids": [str(x) for x in (c.get("source_ids") or []) if str(x)],
                }
            )

    pb_flags = _normalize_playbook_flags(data.get("playbook_flags"), allowed)
    mock_flags = _mock_high_risk_flags(passages)
    uniq_flags = _dedupe_playbook_flags(pb_flags + mock_flags)

    if not plain or not cited_spans:
        stub = _counsel_stub(state)
        return stub, _dedupe_playbook_flags(mock_flags)

    if not claims:
        claims = [{"text": plain, "source_ids": [s["source_id"] for s in cited_spans]}]

    answer = AnalystAnswer(
        plain_english=plain,
        claims=claims,
        cited_spans=cited_spans,
    )
    return answer, uniq_flags


def _json_dumps_safe(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


async def counsel_node(state: LegalGraphState) -> dict:
    """Legal analyst: OpenRouter counsel model or deterministic stub."""
    passages = list(state.get("candidate_passages") or [])
    errors: list[str] = []
    if openrouter_configured():
        try:
            analyst, flags = await _counsel_openrouter(state)
            detail = "Drafted answer via OpenRouter counsel model"
        except Exception as e:
            errors.append(f"counsel OpenRouter failed: {e}")
            analyst = _counsel_stub(state)
            flags = _mock_high_risk_flags(passages)
            detail = "Counsel LLM failed; used local stub"
    else:
        analyst = _counsel_stub(state)
        flags = _mock_high_risk_flags(passages)
        detail = "Drafted answer (local stub, no OPENROUTER_API_KEY)"

    out: dict = {
        "analyst_answer": analyst,
        "playbook_flags": flags,
        "status_log": [_status("counsel", "draft", detail)],
    }
    if errors:
        out["errors"] = errors
    return out


def _normalize_audit_text(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\{\{[^}]+\}\}", "", s)
    return re.sub(r"\s+", " ", s).strip()


def _heuristic_auditor_verdict(state: LegalGraphState) -> AuditorVerdict:
    answer = (state.get("analyst_answer") or {}).get("plain_english") or ""
    passages = list(state.get("candidate_passages") or [])
    corpus = " ".join(_normalize_audit_text(p["chunk"]["text"]) for p in passages)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", answer) if s.strip()]

    unsupported: list[str] = []
    for sent in sentences:
        if len(sent) < 12:
            continue
        n = _normalize_audit_text(sent)
        if len(n) < 28:
            window = n
            if window and window not in corpus:
                unsupported.append(sent)
        else:
            hit = any(n[i : i + 28] in corpus for i in range(0, len(n) - 27))
            if not hit:
                unsupported.append(sent)

    faithful = len(unsupported) == 0
    score = 1.0 if faithful else max(0.0, 1.0 - 0.15 * len(unsupported))
    return AuditorVerdict(
        faithful=faithful,
        faithfulness_score=score,
        unsupported_segments=unsupported,
        notes="Heuristic auditor: substring overlap against retrieved passages.",
    )


async def _openrouter_auditor_verdict(
    state: LegalGraphState,
) -> tuple[AuditorVerdict, list[str]]:
    answer = (state.get("analyst_answer") or {}).get("plain_english") or ""
    passages = list(state.get("candidate_passages") or [])
    sources = []
    for rp in passages:
        ch = rp["chunk"]
        sources.append(
            {
                "chunk_id": ch["chunk_id"],
                "document_id": ch["document_id"],
                "source_id": f"src-{ch['chunk_id']}",
                "text": ch["text"],
            }
        )
    system = (
        "You are a careful legal fact-checker. Decide whether DRAFT_ANSWER is fully entailed by "
        "SOURCE_PASSAGES only. Treat factual statements not clearly supported as unsupported. "
        "Return JSON only with keys: faithful (boolean), faithfulness_score (0.0–1.0), "
        "unsupported_segments (strings copied verbatim from the draft), notes (short string), "
        "suggested_keywords (3–8 strings for retrieval when not faithful; else []). "
        "Be strict: invented or weakly supported details are not faithful."
    )
    user = f"DRAFT_ANSWER:\n{answer}\n\nSOURCE_PASSAGES:\n{_json_dumps_safe(sources)}\n"
    data = await chat_completion_json(
        model=model_for_role("auditor"),
        system=system,
        user=user,
        temperature=0.0,
        max_tokens=900,
    )
    faithful = bool(data.get("faithful", False))
    try:
        score = float(data.get("faithfulness_score", 1.0 if faithful else 0.5))
    except (TypeError, ValueError):
        score = 1.0 if faithful else 0.5
    score = max(0.0, min(1.0, score))
    raw_unsup = data.get("unsupported_segments") or []
    unsupported: list[str] = []
    if isinstance(raw_unsup, list):
        unsupported = [str(x) for x in raw_unsup if str(x).strip()]
    if faithful:
        unsupported = []
        score = max(score, 0.95)
    notes = str(data.get("notes") or "").strip() or "OpenRouter auditor verdict."
    raw_kw = data.get("suggested_keywords") or []
    kw: list[str] = []
    if isinstance(raw_kw, list):
        kw = [str(x).strip() for x in raw_kw if str(x).strip()]

    verdict = AuditorVerdict(
        faithful=faithful,
        faithfulness_score=score,
        unsupported_segments=unsupported,
        notes=f"OpenRouter auditor: {notes}",
    )
    return verdict, kw[:12]


def _suggested_keywords_from_segments(segments: list[str]) -> list[str]:
    kw: list[str] = []
    for s in segments[:3]:
        kw.extend(re.findall(r"[A-Za-z]{4,}", s)[:4])
    return list(dict.fromkeys(kw))[:8]


async def auditor_node(state: LegalGraphState) -> dict:
    """
    Faithfulness check: OpenRouter auditor model when configured, else substring heuristic.
    On failure within retry budget, suggest retrieval refinements.
    """
    llm_kw: list[str] = []
    if openrouter_configured():
        try:
            verdict, llm_kw = await _openrouter_auditor_verdict(state)
        except Exception as e:
            verdict = _heuristic_auditor_verdict(state)
            verdict = AuditorVerdict(
                faithful=verdict["faithful"],
                faithfulness_score=verdict["faithfulness_score"],
                unsupported_segments=verdict["unsupported_segments"],
                notes=f"{verdict['notes']} (OpenRouter error: {e})",
            )
    else:
        verdict = _heuristic_auditor_verdict(state)

    retries = int(state.get("auditor_retry_count") or 0)
    max_r = int(state.get("max_auditor_retries") or 2)
    faithful = bool(verdict.get("faithful"))

    updates: dict = {
        "auditor_verdict": verdict,
        "status_log": [
            _status(
                "auditor",
                "verify",
                "Grounding OK" if faithful else f"{len(verdict['unsupported_segments'])} unsupported segment(s)",
            )
        ],
    }

    if not faithful and retries < max_r:
        kw = llm_kw if llm_kw else _suggested_keywords_from_segments(verdict["unsupported_segments"])
        updates["auditor_retry_count"] = retries + 1
        updates["retrieval_feedback"] = {
            "missing_source_ids": [],
            "suspected_unsupported_claims": list(verdict["unsupported_segments"]),
            "suggested_keywords": kw,
        }
        updates["status_log"] = list(updates["status_log"]) + [
            _status("auditor", "retry", f"Scheduling retrieval refinement (attempt {retries + 1})")
        ]

    return updates


def route_after_audit(state: LegalGraphState) -> Literal["researcher", "end"]:
    verdict = state.get("auditor_verdict") or AuditorVerdict(
        faithful=True,
        faithfulness_score=1.0,
        unsupported_segments=[],
        notes="",
    )
    retries = int(state.get("auditor_retry_count") or 0)
    max_r = int(state.get("max_auditor_retries") or 2)
    if verdict.get("faithful"):
        return "end"
    if retries >= max_r:
        return "end"
    return "researcher"