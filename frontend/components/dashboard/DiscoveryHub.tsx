"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Radio,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import { apiDocsUrl, getApiBase } from "@/lib/api";
import { loadRunHistory, type RiskBand, type RunHistoryEntry } from "@/lib/run-history";
import { AgentProgressRail } from "./AgentProgressRail";
import { useDashboardShell } from "./DashboardShellContext";

type ReadyState = { ok: boolean; openrouter: boolean | null; error: string | null };

function riskLabel(band: RiskBand): string {
  if (band === "high") return "Elevated";
  if (band === "medium") return "Watch";
  return "Stable";
}

function riskStyles(band: RiskBand): string {
  if (band === "high") return "bg-red-100 text-red-900 ring-red-200";
  if (band === "medium") return "bg-amber-100 text-amber-900 ring-amber-200";
  return "bg-emerald-100 text-emerald-900 ring-emerald-200";
}

export function DiscoveryHub() {
  const { setReviewMode } = useDashboardShell();
  const [ready, setReady] = useState<ReadyState>({
    ok: false,
    openrouter: null,
    error: null,
  });
  const [history, setHistory] = useState<RunHistoryEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [ask, setAsk] = useState("");

  const refreshHistory = useCallback(() => {
    setHistory(loadRunHistory());
  }, []);

  useEffect(() => {
    refreshHistory();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "legal_platform_run_history") refreshHistory();
    };
    const onCustom = () => refreshHistory();
    window.addEventListener("storage", onStorage);
    window.addEventListener("legal-platform-run-history", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("legal-platform-run-history", onCustom);
    };
  }, [refreshHistory]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const base = getApiBase();
        const [h, r] = await Promise.all([
          fetch(`${base}/health`, { cache: "no-store" }),
          fetch(`${base}/health/ready`, { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (!h.ok) {
          setReady({ ok: false, openrouter: null, error: `health ${h.status}` });
          return;
        }
        if (!r.ok) {
          setReady({ ok: false, openrouter: null, error: `ready ${r.status}` });
          return;
        }
        const body = (await r.json()) as { openrouter_configured?: boolean };
        setReady({
          ok: true,
          openrouter: !!body.openrouter_configured,
          error: null,
        });
      } catch (e) {
        if (!cancelled) {
          setReady({
            ok: false,
            openrouter: null,
            error: (e as Error).message || "unreachable",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runs = history.length;
  const last = history[0];
  const grounded = history.filter((x) => x.faithful === true).length;
  const review = history.filter((x) => x.faithful === false).length;
  const q = filter.trim().toLowerCase();
  const filtered = q
    ? history.filter(
        (e) =>
          e.query.toLowerCase().includes(q) ||
          e.threadId.toLowerCase().includes(q) ||
          e.documentIds.some((d) => d.toLowerCase().includes(q)),
      )
    : history;

  const submitAsk = () => {
    const text = ask.trim();
    if (!text) {
      window.location.hash = "consultation";
      return;
    }
    window.dispatchEvent(
      new CustomEvent("legal-platform-prefill-query", {
        detail: { query: text },
      }),
    );
    setAsk("");
    window.location.hash = "consultation";
  };

  const openMatterReview = (e: RunHistoryEntry) => {
    setReviewMode(true);
    window.dispatchEvent(
      new CustomEvent("legal-platform-prefill-query", {
        detail: {
          query: e.query,
          documentIds: e.documentIds.join(", "),
        },
      }),
    );
    window.location.hash = "consultation";
  };

  return (
    <div className="min-w-0 space-y-6 pb-6 pt-14 lg:pt-6">
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-1 shadow-sm ring-1 ring-slate-100/80">
        <Sparkles
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0c0f14]/40 sm:left-5"
          aria-hidden
        />
        <input
          type="text"
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitAsk()}
          placeholder='Audit this for hiring restrictions...'
          className="w-full rounded-xl border-0 bg-transparent py-4 pl-12 pr-28 text-sm text-[#0c0f14] outline-none placeholder:text-slate-400 sm:pl-14 sm:text-[15px]"
          aria-label="Ask the legal assistant"
        />
        <button
          type="button"
          onClick={submitAsk}
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-[#0c0f14] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-slate-800"
        >
          Run
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <AgentProgressRail />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter matter runs…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0c0f14] shadow-sm outline-none ring-[#0c0f14]/15 focus:ring-2"
            aria-label="Filter recent runs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="#consultation"
            className="inline-flex items-center gap-2 rounded-full bg-[#0c0f14] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-slate-800"
          >
            Agent console
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <a
            href={apiDocsUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            API docs
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Radio className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
            API
          </div>
          {ready.error ? (
            <p className="mt-3 text-sm font-semibold text-red-700">Offline</p>
          ) : ready.ok ? (
            <p className="mt-3 text-sm font-semibold text-emerald-800">Connected</p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Checking…</p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            {ready.error ? ready.error : getApiBase()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Cpu className="h-3.5 w-3.5" aria-hidden />
            Models
          </div>
          <p className="mt-3 text-sm font-semibold text-[#0c0f14]">
            {ready.openrouter === null
              ? "…"
              : ready.openrouter
                ? "OpenRouter live"
                : "Stub / offline LLM"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">From GET /health/ready</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Activity className="h-3.5 w-3.5" aria-hidden />
            Runs (this browser)
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-[#0c0f14]">{runs}</p>
          <p className="mt-1 text-[11px] text-slate-500">Stored locally after each completion</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Bot className="h-3.5 w-3.5" aria-hidden />
            Last auditor
          </div>
          {last ? (
            <>
              <div className="mt-3 flex items-center gap-2">
                {last.faithful === true ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                ) : last.faithful === false ? (
                  <XCircle className="h-5 w-5 text-amber-600" aria-hidden />
                ) : (
                  <span className="text-slate-400">—</span>
                )}
                <span className="text-sm font-semibold text-[#0c0f14]">
                  {last.faithful === true
                    ? "Grounded"
                    : last.faithful === false
                      ? "Review needed"
                      : "Unknown"}
                </span>
              </div>
              {last.faithfulnessScore !== null && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Score {Math.round(last.faithfulnessScore * 100)}%
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No runs yet — use the console or chatbot.</p>
          )}
        </div>
      </div>

      {(grounded > 0 || review > 0) && (
        <p className="text-xs text-slate-500">
          Session totals:{" "}
          <span className="font-medium text-emerald-800">{grounded} grounded</span>
          {review > 0 ? (
            <>
              {" "}
              · <span className="font-medium text-amber-800">{review} need review</span>
            </>
          ) : null}
        </p>
      )}

      <section aria-labelledby="active-matters-heading">
        <h2 id="active-matters-heading" className="text-sm font-semibold text-[#0c0f14]">
          Active matters
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Recent runs as matter cards — risk is heuristic from playbook flags and auditor (not legal advice).
        </p>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Complete a query to populate matters. Cards open review mode with your document IDs prefilled.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {history.slice(0, 6).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openMatterReview(e)}
                  className="flex w-full flex-col rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm ring-1 ring-slate-100/80 transition hover:border-slate-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 min-w-0 text-sm font-medium text-[#0c0f14]">{e.query || "—"}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${riskStyles(e.riskBand)}`}
                    >
                      {riskLabel(e.riskBand)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {new Date(e.at).toLocaleString()} · {e.documentIds.join(", ") || "—"}
                  </p>
                  {e.agents.length > 0 ? (
                    <p className="mt-1 text-[11px] text-slate-600">Trail: {e.agents.join(" → ")}</p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        aria-labelledby="recent-runs-heading"
      >
        <h2 id="recent-runs-heading" className="text-base font-semibold text-[#0c0f14]">
          Recent agent runs
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Librarian → researcher → counsel → auditor (this browser only)
        </p>
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            {runs === 0
              ? "Complete a query in the agent console or floating assistant to populate this list."
              : "No runs match your filter."}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {filtered.slice(0, 8).map((e) => (
              <li key={e.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#0c0f14]">{e.query || "—"}</p>
                  <p className="text-[11px] text-slate-500">
                    {new Date(e.at).toLocaleString()} · thread {e.threadId.slice(0, 12)}… · docs{" "}
                    {e.documentIds.join(", ")}
                  </p>
                  {e.agents.length > 0 && (
                    <p className="mt-0.5 text-[11px] text-slate-600">Trail: {e.agents.join(" → ")}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${riskStyles(e.riskBand)}`}
                  >
                    {riskLabel(e.riskBand)}
                  </span>
                  {e.faithful === true ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-900 ring-1 ring-emerald-100">
                      Grounded
                    </span>
                  ) : e.faithful === false ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-100">
                      Review
                    </span>
                  ) : null}
                  {e.chunkDocCount > 0 && (
                    <span className="text-[10px] text-slate-400">{e.chunkDocCount} chunks</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6"
        aria-label="Agent pipeline"
      >
        <h2 className="text-sm font-semibold text-[#0c0f14]">Graph pipeline</h2>
        <ol className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700">
          {["Librarian", "Researcher", "Counsel", "Auditor"].map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              {i > 0 ? <span className="text-slate-400">→</span> : null}
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-100">{label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-slate-500">
          The auditor may route back to retrieval until retries are exhausted (see README architecture).
        </p>
      </section>

      <section
        id="archive-placeholder"
        className="scroll-mt-28 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6"
        aria-labelledby="archive-heading"
      >
        <h2 id="archive-heading" className="text-sm font-semibold text-[#0c0f14]">
          Archive
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Closed matters will land here with retention policy controls once matter lifecycle APIs exist (shared team vault
          in Clerk orgs is on the roadmap).
        </p>
      </section>

      <section
        id="shared-placeholder"
        className="scroll-mt-28 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6"
        aria-labelledby="shared-heading"
      >
        <h2 id="shared-heading" className="text-sm font-semibold text-[#0c0f14]">
          Shared with team
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Organization vaults will let collaborators reuse uploaded bundles without re-ingestion. Today, document IDs
          are manual — wire shared storage and ACLs to activate this workspace.
        </p>
      </section>

      <section
        id="dashboard-contact"
        className="scroll-mt-28 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        aria-labelledby="dash-contact-heading"
      >
        <h2 id="dash-contact-heading" className="text-sm font-semibold text-[#0c0f14]">
          Contact & setup
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Use <strong className="font-medium text-[#0c0f14]">API docs</strong> for integration, set an API key in the
          agent console if your deployment requires it, and open <strong className="font-medium text-[#0c0f14]">Account</strong>{" "}
          for Clerk profile and billing.
        </p>
      </section>
    </div>
  );
}
