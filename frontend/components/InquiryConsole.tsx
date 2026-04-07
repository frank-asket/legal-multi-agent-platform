"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  ChevronDown,
  FileJson2,
  Globe,
  Info,
  Layers,
  Loader2,
  MessageSquare,
  Settings2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { TagPill } from "./TagPill";
import { UnderlineField } from "./UnderlineField";
import { getApiBase } from "@/lib/api";
import { appendRunHistory, stateToRunSummary } from "@/lib/run-history";
import { buildWsSessionUrl } from "@/lib/ws-session";

const API_KEY_STORAGE = "legal_platform_api_key";

const SERVICES: {
  id: string;
  label: string;
  docIds: string;
  placeholder: string;
  examples: string[];
}[] = [
  {
    id: "consultation",
    label: "Consultation",
    docIds: "demo-doc",
    placeholder: "What are the key obligations in this agreement?",
    examples: [
      "What are the key obligations in this agreement?",
      "What are the termination and notice requirements?",
    ],
  },
  {
    id: "contract",
    label: "Contract review",
    docIds: "demo-doc",
    placeholder: "Summarize limitation of liability and confidentiality.",
    examples: [
      "Summarize limitation of liability and confidentiality.",
      "Are there unusual or one-sided clauses I should know about?",
    ],
  },
  {
    id: "definitions",
    label: "Definitions",
    docIds: "demo-doc",
    placeholder: "How is Confidential Information defined?",
    examples: [
      "How is Confidential Information defined?",
      "What counts as force majeure in this agreement?",
    ],
  },
  {
    id: "liability",
    label: "Liability",
    docIds: "demo-doc",
    placeholder: "What is the liability cap?",
    examples: [
      "What is the liability cap?",
      "Are consequential damages excluded?",
    ],
  },
];

const DEPTH: { id: string; label: string; hint: string }[] = [
  { id: "quick", label: "Quick scan", hint: "Faster overview" },
  { id: "standard", label: "Balanced", hint: "Default" },
  { id: "deep", label: "Thorough", hint: "More depth" },
];

type StatusLogEvent = {
  agent?: string;
  phase?: string;
  detail?: string;
};

function defaultThread(): string {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "")
      : String(Date.now());
  return `ui-${id}`;
}

export function InquiryConsole() {
  const reduce = useReducedMotion();
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [depthId, setDepthId] = useState(DEPTH[1].id);
  const [threadId, setThreadId] = useState("");
  const [docIdsStr, setDocIdsStr] = useState("demo-doc");
  const [question, setQuestion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [details, setDetails] = useState("");

  const [timeline, setTimeline] = useState<StatusLogEvent[]>([]);
  const [outcomeHtml, setOutcomeHtml] = useState<string | null>(null);
  const [status, setStatus] = useState(
    "Ready — type a question or tap an example below.",
  );
  const [busy, setBusy] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0],
    [serviceId],
  );

  useEffect(() => {
    setThreadId((t) => t || defaultThread());
    setApiKey(() => {
      try {
        return sessionStorage.getItem(API_KEY_STORAGE) || "";
      } catch {
        return "";
      }
    });
  }, []);

  useEffect(() => {
    const onPrefill = (ev: Event) => {
      const ce = ev as CustomEvent<{ query?: string; documentIds?: string }>;
      const d = ce.detail;
      if (d?.query != null) setQuestion(d.query);
      if (typeof d?.documentIds === "string" && d.documentIds.trim()) {
        setDocIdsStr(d.documentIds.trim());
      }
    };
    window.addEventListener("legal-platform-prefill-query", onPrefill as EventListener);
    return () =>
      window.removeEventListener("legal-platform-prefill-query", onPrefill as EventListener);
  }, []);

  useEffect(() => {
    setDocIdsStr(service.docIds);
  }, [service]);

  useEffect(() => {
    try {
      sessionStorage.setItem(API_KEY_STORAGE, apiKey.trim());
    } catch {
      /* ignore */
    }
  }, [apiKey]);

  const appendFromDelta = useCallback((delta: Record<string, unknown>) => {
    for (const patch of Object.values(delta)) {
      if (!patch || typeof patch !== "object") continue;
      const p = patch as { status_log?: StatusLogEvent[] };
      const log = p.status_log;
      if (!Array.isArray(log) || log.length === 0) continue;
      setTimeline((prev) => [...prev, ...log]);
      const last = log[log.length - 1];
      try {
        window.dispatchEvent(
          new CustomEvent("legal-platform-agent-status", {
            detail: {
              agent: last.agent,
              phase: last.phase,
              detail: last.detail,
            },
          }),
        );
      } catch {
        /* ignore */
      }
    }
  }, []);

  const renderOutcome = useCallback((state: Record<string, unknown>) => {
    const analyst = state.analyst_answer as
      | { plain_english?: string; cited_spans?: Record<string, unknown>[] }
      | undefined;
    const verdict = state.auditor_verdict as
      | {
          faithful?: boolean;
          faithfulness_score?: number;
          notes?: string;
          unsupported_segments?: string[];
        }
      | undefined;
    const flags = (state.playbook_flags as Record<string, unknown>[]) || [];
    const errors = (state.errors as string[]) || [];
    const chunks = state.chunks_by_document;

    const plain = analyst?.plain_english || "";
    const spans = analyst?.cited_spans || [];
    const faithful = !!verdict?.faithful;
    const score =
      typeof verdict?.faithfulness_score === "number"
        ? verdict.faithfulness_score
        : null;

    let html = `<div class="space-y-6">`;

    html += `<div class="flex flex-wrap gap-2">`;
    html += `<span class="rounded-full px-3 py-1 text-xs font-semibold ${
      faithful ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
    }">${faithful ? "Auditor: grounded" : "Auditor: review needed"}</span>`;
    if (score !== null) {
      html += `<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Faithfulness ${Math.round(score * 100)}%</span>`;
    }
    html += `</div>`;

    if (plain) {
      html += `<p class="text-lg leading-relaxed text-[#0c0f14]" style="font-family:Georgia, 'Times New Roman', serif">${escapeHtml(plain)}</p>`;
    }

    if (spans.length) {
      html += `<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Citations</h3><div class="space-y-3">`;
      for (const s of spans) {
        const pdf = s.pdf as { page_number?: number } | undefined;
        const ref = `${String(s.source_id ?? "")} · ${String(s.document_id ?? "")} · p.${pdf?.page_number ?? "?"}`;
        html += `<blockquote class="border-l-4 border-[#0c0f14] bg-slate-50 pl-4 py-3 text-sm"><div class="text-xs font-medium text-slate-500">${escapeHtml(ref)}</div><div class="mt-1 text-slate-700">${escapeHtml(String(s.text_excerpt ?? ""))}</div></blockquote>`;
      }
      html += `</div>`;
    }

    if (flags.length) {
      html += `<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Playbook</h3><div class="space-y-2">`;
      for (const f of flags) {
        const sev = String(f.severity ?? "low");
        html += `<div class="rounded-xl border border-slate-200 p-3 text-sm"><div class="font-semibold">${escapeHtml(String(f.label ?? f.rule_id ?? "Flag"))} <span class="text-slate-500">(${escapeHtml(sev)})</span></div><div class="text-slate-600">${escapeHtml(String(f.rationale ?? ""))}</div></div>`;
      }
      html += `</div>`;
    }

    if (verdict?.notes) {
      html += `<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Auditor notes</h3><p class="text-sm text-slate-600">${escapeHtml(verdict.notes)}</p>`;
    }

    if (chunks && typeof chunks === "object") {
      html += `<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Indexed chunks</h3><pre class="overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600">${escapeHtml(JSON.stringify(chunks, null, 2))}</pre>`;
    }

    if (errors.length) {
      html += `<div class="rounded-lg bg-red-50 p-3 text-sm text-red-800">${escapeHtml(errors.join(" · "))}</div>`;
    }

    html += `</div>`;
    setOutcomeHtml(html);
  }, []);

  const clearPanels = useCallback(() => {
    setTimeline([]);
    setOutcomeHtml(null);
    try {
      window.dispatchEvent(
        new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const runWebSocket = useCallback(() => {
    const q =
      [question.trim(), details.trim()].filter(Boolean).join("\n\n") ||
      service.placeholder;
    const tid = threadId.trim();
    if (!tid || !q) {
      setStatus("Please add a question (or choose an example).");
      return;
    }
    const docIds = docIdsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!docIds.length) {
      setStatus("Add at least one document ID in advanced settings.");
      return;
    }

    clearPanels();
    setBusy(true);
    setStatus("Connecting to your assistant…");

    const ws = new WebSocket(buildWsSessionUrl(tid, apiKey));
    let gotResult = false;

    ws.onopen = () => {
      setStatus("Reviewing your documents and drafting an answer…");
      ws.send(JSON.stringify({ user_query: q, document_ids: docIds }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as {
          type: string;
          delta?: Record<string, unknown>;
          state?: Record<string, unknown>;
          detail?: string;
        };
        if (msg.type === "error") {
          setStatus(msg.detail || "Error");
          setOutcomeHtml(
            `<div class="text-sm text-red-700">${escapeHtml(msg.detail || "Error")}</div>`,
          );
          try {
            window.dispatchEvent(
              new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
            );
          } catch {
            /* ignore */
          }
          ws.close();
          setBusy(false);
          return;
        }
        if (msg.type === "update" && msg.delta) appendFromDelta(msg.delta);
        if (msg.type === "result" && msg.state) {
          gotResult = true;
          renderOutcome(msg.state);
          appendRunHistory(stateToRunSummary(msg.state, tid, q, docIds));
          setStatus("Done — your answer is below.");
          try {
            window.dispatchEvent(
              new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
            );
          } catch {
            /* ignore */
          }
          ws.close();
          setBusy(false);
        }
      } catch {
        setStatus("Invalid server message.");
        try {
          window.dispatchEvent(
            new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
          );
        } catch {
          /* ignore */
        }
        setBusy(false);
      }
    };

    ws.onerror = () => {
      setStatus(
        "Could not connect. Is the legal API running? Check advanced settings or ask your admin.",
      );
      try {
        window.dispatchEvent(
          new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
        );
      } catch {
        /* ignore */
      }
      setBusy(false);
    };

    ws.onclose = (ev) => {
      if (!gotResult && ev.code !== 1000 && ev.code !== 1005) {
        setStatus("Disconnected (" + ev.code + ").");
      }
      setBusy(false);
    };
  }, [
    apiKey,
    appendFromDelta,
    clearPanels,
    details,
    docIdsStr,
    question,
    renderOutcome,
    service.placeholder,
    threadId,
  ]);

  const runHttp = useCallback(async () => {
    const q =
      [question.trim(), details.trim()].filter(Boolean).join("\n\n") ||
      service.placeholder;
    const tid = threadId.trim();
    if (!tid || !q) {
      setStatus("Please add a question (or choose an example).");
      return;
    }
    const docIds = docIdsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    clearPanels();
    setBusy(true);
    setStatus("Sending your question…");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey.trim()) headers["X-API-Key"] = apiKey.trim();
    try {
      const res = await fetch(`${getApiBase()}/v1/query`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_query: q,
          document_ids: docIds.length ? docIds : ["demo-doc"],
          thread_id: tid,
        }),
      });
      const body = (await res.json()) as {
        state?: Record<string, unknown>;
        detail?: unknown;
      };
      if (!res.ok) {
        const detail =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail ?? body);
        setStatus(`${res.status}: ${detail.slice(0, 120)}`);
        setOutcomeHtml(`<pre class="text-xs text-red-800 whitespace-pre-wrap">${escapeHtml(JSON.stringify(body, null, 2))}</pre>`);
        try {
          window.dispatchEvent(
            new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
          );
        } catch {
          /* ignore */
        }
        setBusy(false);
        return;
      }
      if (body.state) {
        renderOutcome(body.state);
        appendRunHistory(stateToRunSummary(body.state, tid, q, docIds));
      }
      setStatus("Done — your answer is below.");
      try {
        window.dispatchEvent(
          new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
        );
      } catch {
        /* ignore */
      }
    } catch (e) {
      setStatus(String((e as Error).message || e));
      try {
        window.dispatchEvent(
          new CustomEvent("legal-platform-agent-status", { detail: { idle: true } }),
        );
      } catch {
        /* ignore */
      }
    }
    setBusy(false);
  }, [
    apiKey,
    clearPanels,
    details,
    docIdsStr,
    question,
    renderOutcome,
    service.placeholder,
    threadId,
  ]);

  const depthLabel =
    DEPTH.find((d) => d.id === depthId)?.label?.toLowerCase() ?? depthId;

  return (
    <motion.div
      id="consultation-form"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100/80 sm:p-8 md:rounded-3xl md:p-10"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/90">
            No signup for the demo
          </p>
          <h2 className="mt-1 max-w-xl text-2xl font-semibold leading-tight text-[#0c0f14] sm:text-[1.65rem] md:text-3xl">
            Ask your question — get a grounded answer
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600">
          <Layers className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Depth:{" "}
          <strong className="font-semibold text-[#0c0f14]">{depthLabel}</strong>
          <span className="text-slate-400">(demo)</span>
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
        Choose what you need help with, write in everyday language (or use an
        example), then run the assistant. You&apos;ll see a plain summary and
        citations from the text — useful support for your own review, not a
        substitute for a qualified lawyer.
      </p>

      <div className="mt-8">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Target className="h-3.5 w-3.5" aria-hidden />
          What do you need?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <TagPill
              key={s.id}
              active={serviceId === s.id}
              onClick={() => {
                setServiceId(s.id);
                setQuestion("");
              }}
            >
              {s.label}
            </TagPill>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          How thorough should it be?
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Cosmetic for now — labels help you preview how depth might feel later.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEPTH.map((d) => (
            <TagPill
              key={d.id}
              title={d.hint}
              active={depthId === d.id}
              onClick={() => setDepthId(d.id)}
            >
              {d.label}
            </TagPill>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            Your question
          </span>
          <span className="text-[11px] text-slate-500">
            Tip: leave blank to use the suggested wording
          </span>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={service.placeholder}
          rows={4}
          className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-[#0c0f14] text-sm outline-none ring-[#0c0f14]/0 transition focus:border-[#0c0f14]/40 focus:ring-2 focus:ring-[#0c0f14]/15 placeholder:text-slate-400"
        />
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Try an example
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {service.examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuestion(ex)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs leading-snug text-[#0c0f14] transition hover:border-slate-400 hover:shadow-sm sm:max-w-[280px]"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FileJson2 className="h-3.5 w-3.5" aria-hidden />
          Extra context (optional)
        </span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Dates, party names, or background — merged into your question for the assistant."
          rows={2}
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0c0f14] outline-none transition focus:border-[#0c0f14]/40 focus:ring-2 focus:ring-[#0c0f14]/15 placeholder:text-slate-400"
        />
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-[#0c0f14] transition hover:bg-slate-50"
          aria-expanded={showAdvanced}
        >
          <span className="inline-flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-500" aria-hidden />
            Technical &amp; connection settings
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition ${showAdvanced ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {showAdvanced ? (
          <div className="mt-4 space-y-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 sm:p-5">
            <UnderlineField
              label="Your name"
              hint="Optional — not sent to the API."
              value={yourName}
              onChange={setYourName}
              placeholder="Jordan Smith"
            />
            <UnderlineField
              label="Your email"
              hint="Optional"
              value={yourEmail}
              onChange={setYourEmail}
              placeholder="you@company.com"
            />
            <UnderlineField
              label="Session ID"
              hint="For live updates; a new one is created for you automatically."
              value={threadId}
              onChange={setThreadId}
            />
            <UnderlineField
              label="Document IDs"
              value={docIdsStr}
              onChange={setDocIdsStr}
              placeholder="demo-doc"
            />
            <UnderlineField
              label="API key"
              hint="Only if your server requires it; stored in this browser only."
              value={apiKey}
              onChange={setApiKey}
              type="password"
            />
            <p className="text-xs leading-relaxed text-slate-500">
              Connected to:{" "}
              <code className="rounded bg-slate-200/60 px-1 py-0.5 text-[11px]">
                {getApiBase()}
              </code>
              . If the page cannot reach the API, ask your team to allow this site
              in CORS or run the backend locally.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={busy}
          onClick={runWebSocket}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0c0f14] px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-slate-900/25 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none sm:min-w-[220px]"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Zap className="h-4 w-4" aria-hidden />
          )}
          Get answer — live updates
          {!busy ? (
            <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : null}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={runHttp}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition duration-300 hover:-translate-y-px hover:border-slate-500 hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden />
          ) : (
            <Globe className="h-4 w-4 text-slate-500" aria-hidden />
          )}
          Get answer — one step
        </button>
      </div>

      <div className="mt-4 flex gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-xs leading-relaxed text-amber-950/90">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
        <p>
          Outputs are informational and based on the documents you connect. They
          are not legal advice. For regulated or high-stakes matters, involve
          qualified counsel.
        </p>
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        {busy ? (
          <Loader2
            className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#0c0f14]"
            aria-hidden
          />
        ) : (
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
        )}
        {status}
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Bot className="h-4 w-4 text-slate-400" aria-hidden />
            What&apos;s happening
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Live steps from each specialist agent (best with “live updates”).
          </p>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-3 shadow-inner">
            <AnimatePresence initial={false}>
              {timeline.length === 0 ? (
                <motion.li
                  key="empty"
                  initial={false}
                  className="rounded-xl px-3 py-6 text-center text-sm text-slate-400"
                >
                  Run the assistant to see progress here.
                </motion.li>
              ) : (
                timeline.map((ev, i) => (
                  <motion.li
                    key={`${ev.agent}-${ev.phase}-${i}`}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.25 }}
                    className="rounded-xl border border-slate-100/80 bg-white/90 px-3 py-2.5 text-sm shadow-sm backdrop-blur-sm"
                  >
                    <span className="font-semibold text-[#0c0f14]">
                      {ev.agent} · {ev.phase}
                    </span>
                    <p className="mt-0.5 leading-relaxed text-slate-600">
                      {ev.detail}
                    </p>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </div>
        <div>
          <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <MessageSquare className="h-4 w-4 text-slate-400" aria-hidden />
            Your answer
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Summary and citations from your documents appear here.
          </p>
          <div
            className="mt-3 min-h-[220px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            dangerouslySetInnerHTML={{
              __html:
                outcomeHtml ||
                '<p class="text-sm text-slate-500 leading-relaxed">Your answer will appear here with a plain-language summary and quotes tied to the source text. Use <strong>live updates</strong> to watch each step, or <strong>one step</strong> for a single response.</p>',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}