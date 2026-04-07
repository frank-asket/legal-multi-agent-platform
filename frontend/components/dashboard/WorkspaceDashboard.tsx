"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Filter,
  MoreVertical,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getApiBase } from "@/lib/api";
import { loadRunHistory, type RiskBand, type RunHistoryEntry } from "@/lib/run-history";
import { AgentProgressRail } from "./AgentProgressRail";
import { useDashboardShell } from "./DashboardShellContext";

type ReadyState = { ok: boolean; error: string | null };

function riskWords(band: RiskBand): string {
  if (band === "high") return "High attention";
  if (band === "medium") return "Moderate";
  return "Stable";
}

const DEMO_INSIGHTS = [
  {
    id: "1",
    title: "Source gap: employer undertaking letter not indexed",
    body: "H1B-style bundle for sample client missing a dated sponsorship undertaking. Desk suggests upload before final filing review.",
    client: "Sample Org Ltd",
    doc: "Matter_Index_v2.pdf",
    updated: "Mar 2, 2026 · 14:20",
    progress: 42,
  },
  {
    id: "2",
    title: "Clause alert: broad indemnity spanning affiliates",
    body: "Cross-border services agreement flags uncapped downstream liability — playbook recommends partner review.",
    client: "Harbor Trading SA",
    doc: "MSA_draft_Clean.docx",
    updated: "Mar 1, 2026 · 09:05",
    progress: 68,
  },
  {
    id: "3",
    title: "Faithfulness check: verify extracted dates",
    body: "Automated pass found possible mismatch between body text and schedule effective date.",
    client: "Inland Logistics",
    doc: "JV_term_sheet.pdf",
    updated: "Feb 28, 2026 · 17:40",
    progress: 30,
  },
] as const;

const DEMO_CLIENTS = [
  {
    name: "Northfield Research · EB-2 NIW",
    caseId: "NF-2026-014",
    type: "Employment-based",
    status: "In review",
    risk: "Medium · 38%",
  },
  {
    name: "Harbour Renewables Ltd",
    caseId: "HR-2026-008",
    type: "Commercial contract",
    status: "Draft ready",
    risk: "Low · 12%",
  },
  {
    name: "Atlas Ministries — grant MOU",
    caseId: "AT-IR-104",
    type: "MOU / cooperation",
    status: "Filed",
    risk: "Low · 9%",
  },
  {
    name: "Meridian Data Corp",
    caseId: "MD-2026-021",
    type: "Privacy addendum",
    status: "In review",
    risk: "High · 61%",
  },
] as const;

function badgeClass() {
  return "rounded-full border border-white/25 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/85";
}

export function WorkspaceDashboard() {
  const { user } = useUser();
  const { setReviewMode } = useDashboardShell();
  const firstName = user?.firstName || user?.username || "there";
  const initial = (user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase();

  const [ready, setReady] = useState<ReadyState>({ ok: false, error: null });
  const [history, setHistory] = useState<RunHistoryEntry[]>([]);
  const [projectFilter, setProjectFilter] = useState("");
  const [clientQuery, setClientQuery] = useState("");

  const refreshHistory = useCallback(() => setHistory(loadRunHistory()), []);
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
        const h = await fetch(`${base}/health`, { cache: "no-store" });
        if (cancelled) return;
        setReady({ ok: h.ok, error: h.ok ? null : `HTTP ${h.status}` });
      } catch (e) {
        if (!cancelled) setReady({ ok: false, error: (e as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runs = history.length;
  const grounded = history.filter((x) => x.faithful === true).length;
  const review = history.filter((x) => x.faithful === false).length;
  const alerts = history.filter((x) => x.riskBand === "high").length;

  const q = projectFilter.trim().toLowerCase();
  const filteredProjects = useMemo(() => {
    const list = history;
    if (!q) return list;
    return list.filter(
      (e) =>
        e.query.toLowerCase().includes(q) ||
        e.threadId.toLowerCase().includes(q) ||
        e.documentIds.some((d) => d.toLowerCase().includes(q)),
    );
  }, [history, q]);

  const gotoDesk = (prefill?: { query?: string; docIds?: string }) => {
    if (prefill?.query) {
      window.dispatchEvent(
        new CustomEvent("legal-platform-prefill-query", {
          detail: { query: prefill.query, documentIds: prefill.docIds },
        }),
      );
    }
    window.location.hash = "consultation";
  };

  const openMatter = (e: RunHistoryEntry) => {
    setReviewMode(true);
    window.dispatchEvent(
      new CustomEvent("legal-platform-prefill-query", {
        detail: { query: e.query, documentIds: e.documentIds.join(", ") },
      }),
    );
    window.location.hash = "consultation";
  };

  const clientsFiltered = useMemo(() => {
    const s = clientQuery.trim().toLowerCase();
    if (!s) return DEMO_CLIENTS;
    return DEMO_CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.caseId.toLowerCase().includes(s) ||
        c.type.toLowerCase().includes(s),
    );
  }, [clientQuery]);

  return (
    <div id="dashboard-main" className="min-w-0 space-y-10 pb-10 pt-12 lg:pt-8">
      {/* Command center — greeting & quick actions */}
      <section className="text-center" aria-label="Quick actions">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Hello, {firstName}{" "}
          <span className="inline-block" aria-hidden>
            👋
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">What should we tackle on your desk today?</p>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <QuickPill
            icon={<UserPlus className="h-5 w-5 text-white" aria-hidden />}
            label="New matter intake"
            onClick={() => gotoDesk({ query: "Summarize parties, governing law, and termination mechanisms." })}
          />
          <QuickPill
            icon={<FileText className="h-5 w-5 text-white" aria-hidden />}
            label="Draft recommendation memo"
            onClick={() => gotoDesk({ query: "Produce an internal memo outlining risks and open questions for partner review." })}
          />
          <QuickPill
            icon={<FileText className="h-5 w-5 text-white" aria-hidden />}
            label="Instrument review pass"
            onClick={() => gotoDesk({ query: "List material obligations and cross-default triggers with citations." })}
          />
          <QuickPill
            icon={<ShieldCheck className="h-5 w-5 text-white" aria-hidden />}
            label="Compliance & clause check"
            onClick={() => {
              setReviewMode(true);
              gotoDesk({ query: "Run playbook-style clause checklist against the registered file." });
            }}
          />
        </div>
      </section>

      {/* Stats — agent dashboard row */}
      <section aria-label="Summary statistics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active analyses"
            value={runs}
            hint={`${grounded} aligned with sources`}
            icon={<Users className="h-4 w-4 text-white/50" aria-hidden />}
          />
          <StatCard
            title="Source-aligned runs"
            value={grounded}
            hint="Automated faithfulness pass"
            icon={<Sparkles className="h-4 w-4 text-white/50" aria-hidden />}
          />
          <StatCard
            title="Counsel review queue"
            value={review}
            hint="Flagged in this browser"
            icon={<AlertTriangle className="h-4 w-4 text-white/50" aria-hidden />}
          />
          <StatCard
            title="High-attention matters"
            value={alerts}
            hint="Elevated exposure band"
            icon={<AlertTriangle className="h-4 w-4 text-white/50" aria-hidden />}
          />
        </div>
        <p className="mt-3 text-center text-[11px] text-white/40">
          Desk endpoint: {ready.ok ? "reachable" : ready.error || "checking…"} · metrics from this device only
        </p>
      </section>

      <AgentProgressRail variant="dark" />

      {/* AI insights */}
      <section aria-labelledby="ai-insights-heading">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-white/80" aria-hidden />
          <h2 id="ai-insights-heading" className="text-lg font-semibold text-white">
            AI insights and recommendations
          </h2>
        </div>
        <ul className="space-y-4">
          {DEMO_INSIGHTS.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-5 lg:flex-row lg:items-stretch"
            >
              <div className="flex shrink-0 items-start lg:w-44">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black text-lg font-semibold text-white">
                  {initial}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/45">
                  <span>Client · {item.client}</span>
                  <span>Document · {item.doc}</span>
                  <span>Updated · {item.updated}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "consultation";
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Open in desk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "consultation";
                    }}
                    className="inline-flex items-center rounded-lg border border-white/35 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/55 hover:bg-white/5"
                  >
                    View details
                  </button>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col justify-center border-t border-white/10 pt-4 lg:w-44 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Case progress</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{item.progress}%</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Workspace shelf — projects from run history */}
      <section
        className="rounded-t-3xl border border-white/10 bg-zinc-950/90 px-4 py-8 sm:px-6 md:px-8"
        aria-labelledby="workspace-shelf-heading"
      >
        <h2 id="workspace-shelf-heading" className="text-lg font-semibold text-white">
          {firstName}&apos;s workspace
        </h2>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 lg:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="search"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              placeholder="Search projects and analyses…"
              className="w-full rounded-full border border-white/15 bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35 focus:ring-1 focus:ring-white/20"
              aria-label="Search workspace"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-full border border-white/15 bg-black/50 px-3 py-2 text-xs font-medium text-white outline-none focus:border-white/35"
              defaultValue="all"
              aria-label="Project filter"
            >
              <option value="all">All projects</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="rounded-full border border-white/15 bg-black/50 px-3 py-2 text-xs font-medium text-white outline-none focus:border-white/35"
              defaultValue="edited"
              aria-label="Sort by"
            >
              <option value="edited">Last edited</option>
              <option value="created">Date created</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/5"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
            <Link href="#recent-runs-heading" className="text-xs font-medium text-white/60 hover:text-white">
              Show all
            </Link>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="mt-8 text-sm text-white/50">
            No saved analyses yet — run a question on the legal desk to populate project cards.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.slice(0, 6).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openMatter(e)}
                  className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-black/40 p-4 text-left transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
                    <span className={badgeClass()}>{riskWords(e.riskBand)}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-medium text-white">{e.query || "Untitled run"}</p>
                  <p className="mt-2 text-[11px] text-white/45">
                    Edited {new Date(e.at).toLocaleString()}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/55">
                    {e.documentIds.length ? `Files: ${e.documentIds.join(", ")}` : "No file ids recorded"}
                    {e.agents.length > 0 ? ` · Stages: ${e.agents.join(" → ")}` : ""}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Clients table */}
      <section id="clients-table" className="scroll-mt-28" aria-labelledby="clients-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="clients-heading" className="text-lg font-semibold text-white">
            Clients &amp; matters
          </h2>
          <div className="flex flex-1 flex-wrap items-center gap-2 sm:max-w-lg sm:flex-initial lg:max-w-xl">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                type="search"
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                placeholder="Search clients…"
                className="w-full rounded-full border border-white/15 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/35"
                aria-label="Search clients"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-white/5"
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-zinc-900/90 text-[11px] font-semibold uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-4 py-3">Client / matter</th>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk signal</th>
                <th className="px-4 py-3 w-12" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {clientsFiltered.map((row) => (
                <tr key={row.caseId} className="bg-black/20 text-white/85 hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-3 tabular-nums text-white/60">{row.caseId}</td>
                  <td className="px-4 py-3 text-white/60">{row.type}</td>
                  <td className="px-4 py-3">
                    <span className={badgeClass()}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/70">{row.risk}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="rounded-lg p-1 text-white/45 hover:bg-white/10 hover:text-white" aria-label="Row actions">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-white/40">
          Sample rows for layout; connect your matter system to replace with live data.
        </p>
      </section>

      {/* Recent analyses list (anchor for sidebar) */}
      <section id="recent-runs-heading" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-base font-semibold text-white">Recent analyses</h2>
        <p className="mt-1 text-xs text-white/45">Full history stays on this device until your vault sync is enabled.</p>
        {history.length === 0 ? (
          <p className="mt-6 text-sm text-white/50">No runs yet — use the desk below or the floating assistant.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {history.slice(0, 10).map((e) => (
              <li key={e.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{e.query || "—"}</p>
                  <p className="text-[11px] text-white/45">{new Date(e.at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={badgeClass()}>{riskWords(e.riskBand)}</span>
                  <button
                    type="button"
                    onClick={() => openMatter(e)}
                    className="text-xs font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        id="archive-placeholder"
        className="scroll-mt-28 rounded-2xl border border-dashed border-white/15 bg-black/30 p-6"
      >
        <h2 className="text-sm font-semibold text-white">Archive</h2>
        <p className="mt-2 text-sm text-white/55">
          Closed matters and expired instructions appear here once lifecycle controls are connected.
        </p>
      </section>
      <section
        id="shared-placeholder"
        className="scroll-mt-28 rounded-2xl border border-dashed border-white/15 bg-black/30 p-6"
      >
        <h2 className="text-sm font-semibold text-white">Shared with team</h2>
        <p className="mt-2 text-sm text-white/55">
          Shared workspaces let colleagues reuse bundles without re-uploading — coming with org vault rollout.
        </p>
      </section>
      <section id="dashboard-contact" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-semibold text-white">Help &amp; setup</h2>
        <p className="mt-2 text-sm text-white/60">
          Technical documentation and access keys live under legal desk settings. Use{" "}
          <Link href="/account" className="font-medium text-white underline-offset-2 hover:underline">
            Account
          </Link>{" "}
          for billing and profile.
        </p>
      </section>
    </div>
  );
}

function QuickPill({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-full border border-white/15 bg-zinc-900/80 px-5 py-4 text-left text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.06]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40">
        {icon}
      </span>
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-white/45">{title}</p>
        <span className="text-white/40">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-white">{value}</p>
      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-white/50">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/35" aria-hidden />
        {hint}
      </p>
    </div>
  );
}
