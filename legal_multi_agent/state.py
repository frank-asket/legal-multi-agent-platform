"""
LangGraph state schema for the Multi-Agent Legal Intelligence workflow.

List fields that accumulate across nodes use Annotated[..., operator.add] so LangGraph
merges partial updates correctly.
"""

from __future__ import annotations

import operator
from typing import Annotated, Any, Literal, NotRequired, TypedDict


class BoundingBox(TypedDict):
    """Normalized 0–1 coords relative to page width/height (PDF.js–friendly)."""

    x0: float
    y0: float
    x1: float
    y1: float


class PdfCoordinates(TypedDict):
    document_id: str
    page_number: int
    bbox: NotRequired[BoundingBox]


class SourceSpan(TypedDict):
    source_id: str
    chunk_id: str
    document_id: str
    pdf: PdfCoordinates
    section_path: str
    text_excerpt: str


class TableBlock(TypedDict):
    markdown: str
    page_number: int
    bbox: NotRequired[BoundingBox]


class LegalChunk(TypedDict):
    chunk_id: str
    document_id: str
    text: str
    page_number: int
    section_number: NotRequired[str]
    section_title: NotRequired[str]
    parent_chunk_id: NotRequired[str]
    parent_headers: list[str]
    is_table: bool
    table: NotRequired[TableBlock]
    embedding_id: NotRequired[str]


class GlobalDefinitionEntry(TypedDict):
    term: str
    definition: str
    source_id: str
    page_number: int


class RetrievalQuery(TypedDict):
    raw_question: str
    expanded_queries: list[str]
    must_match_sections: list[str]
    document_ids: list[str]


class RankedPassage(TypedDict):
    chunk: LegalChunk
    vector_score: float
    lexical_score: float
    hybrid_score: float


class RetrievalFeedback(TypedDict):
    missing_source_ids: list[str]
    suspected_unsupported_claims: list[str]
    suggested_keywords: list[str]


class PlaybookFlag(TypedDict):
    rule_id: str
    label: str
    severity: Literal["low", "medium", "high", "critical"]
    rationale: str
    source_id: NotRequired[str]


class AnalystAnswer(TypedDict):
    plain_english: str
    claims: list[dict[str, Any]]
    cited_spans: list[SourceSpan]


class AuditorVerdict(TypedDict):
    faithful: bool
    faithfulness_score: float
    unsupported_segments: list[str]
    notes: str


class AgentStatusEvent(TypedDict):
    agent: Literal["librarian", "researcher", "counsel", "auditor", "router"]
    phase: str
    detail: str
    document_id: NotRequired[str]


class LegalGraphState(TypedDict, total=False):
    thread_id: str
    user_query: str
    document_ids: list[str]
    pii_redacted: bool

    chunks_by_document: dict[str, list[LegalChunk]]
    global_definitions: list[GlobalDefinitionEntry]

    retrieval_query: RetrievalQuery
    candidate_passages: list[RankedPassage]
    retrieval_feedback: RetrievalFeedback

    analyst_answer: AnalystAnswer
    playbook_flags: list[PlaybookFlag]

    auditor_verdict: AuditorVerdict
    auditor_retry_count: int
    max_auditor_retries: int

    status_log: Annotated[list[AgentStatusEvent], operator.add]
    errors: Annotated[list[str], operator.add]


def initial_legal_state(
    *,
    thread_id: str,
    user_query: str,
    document_ids: list[str],
    max_auditor_retries: int = 2,
) -> LegalGraphState:
    return LegalGraphState(
        thread_id=thread_id,
        user_query=user_query,
        document_ids=document_ids,
        pii_redacted=False,
        chunks_by_document={},
        global_definitions=[],
        retrieval_query=RetrievalQuery(
            raw_question=user_query,
            expanded_queries=[],
            must_match_sections=[],
            document_ids=document_ids,
        ),
        candidate_passages=[],
        retrieval_feedback=RetrievalFeedback(
            missing_source_ids=[],
            suspected_unsupported_claims=[],
            suggested_keywords=[],
        ),
        analyst_answer=AnalystAnswer(plain_english="", claims=[], cited_spans=[]),
        playbook_flags=[],
        auditor_verdict=AuditorVerdict(
            faithful=True,
            faithfulness_score=1.0,
            unsupported_segments=[],
            notes="",
        ),
        auditor_retry_count=0,
        max_auditor_retries=max_auditor_retries,
        status_log=[],
        errors=[],
    )
