"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  BookMarked,
  Calendar,
  Globe2,
  Languages,
  ListChecks,
  Newspaper,
  PanelRight,
} from "lucide-react";
import Link from "next/link";
import { loadRunHistory, type RunHistoryEntry } from "@/lib/run-history";
import { regionLabel } from "@/lib/jurisdiction";
import { useDashboardShell } from "./DashboardShellContext";

export function InsightsPanel() {
  const {
    reviewMode,
    setReviewMode,
    jurisdictionMode,
    localRegion,
  } = useDashboardShell();
  const [last, setLast] = useState<RunHistoryEntry | undefined>();

  const refresh = useCallback(() => {
    const h = loadRunHistory();
    setLast(h[0]);
  }, []);

  useEffect(() => {
    refresh();
    const onCustom = () => refresh();
    window.addEventListener("legal-platform-run-history", onCustom);
    return () => window.removeEventListener("legal-platform-run-history", onCustom);
  }, [refresh]);

  const pinned = jurisdictionMode === "local" ? regionLabel(localRegion) : "International";

  return (
    <aside
      className="lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"
      aria-label="Contextual insights"
    >
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100/80 lg:p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk breakdown</p>
          <p className="mt-2 text-xs text-slate-600">
            Scoped to your most recent run in this browser. Full PDF clause map and compare-table modes ship with
            document storage.
          </p>
          {last ? (
            <ul className="mt-3 space-y-2 text-xs text-[#0c0f14]">
              <li className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                <span className="text-slate-600">Exposure band</span>
                <span className="font-semibold capitalize">{last.riskBand}</span>
              </li>
              <li className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                <span className="text-slate-600">Playbook flags</span>
                <span className="font-semibold tabular-nums">{last.playbookFlagCount}</span>
              </li>
              <li className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                <span className="text-slate-600">Auditor</span>
                <span className="font-semibold">
                  {last.faithful === true ? "Grounded" : last.faithful === false ? "Review" : "—"}
                </span>
              </li>
            </ul>
          ) : (
            <p className="mt-3 text-xs text-slate-500">No runs yet — run the console to populate this panel.</p>
          )}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quick actions</p>
          <div className="mt-2 flex flex-col gap-2">
            <QuickAction
              href="#consultation"
              icon={<BookMarked className="h-3.5 w-3.5" aria-hidden />}
              label="Generate summary"
            />
            <QuickAction
              href="#consultation"
              icon={<Calendar className="h-3.5 w-3.5" aria-hidden />}
              label="Extract deadlines"
            />
            <QuickAction
              href="#consultation"
              icon={<Languages className="h-3.5 w-3.5" aria-hidden />}
              label="Plain English"
            />
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <PanelRight className="h-3.5 w-3.5" aria-hidden />
            Review mode
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Split chat and PDF placeholder for clause heat-maps (mapping cited_spans is the next integration step).
          </p>
          <button
            type="button"
            onClick={() => setReviewMode(!reviewMode)}
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0c0f14] shadow-sm transition hover:bg-slate-50"
          >
            {reviewMode ? "Exit review mode" : "Enter review mode"}
          </button>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Bell className="h-3.5 w-3.5" aria-hidden />
            Regulatory watchdog
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            When local law is pinned ({pinned}), proactive alerts for newly uploaded contracts will appear here once a
            watchlist feed and ingestion webhooks are connected.
          </p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Newspaper className="h-3.5 w-3.5" aria-hidden />
            Jurisdiction feed
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-slate-600">
            <FeedRow
              icon={<Globe2 className="h-3 w-3 shrink-0 text-slate-400" aria-hidden />}
              text={`Placeholder digest for ${pinned} — wire Curated sources in a later sprint.`}
            />
            <FeedRow
              icon={<ListChecks className="h-3 w-3 shrink-0 text-slate-400" aria-hidden />}
              text="Multilingual bridge: upload non-English contracts and ask in English once translation + retrieval are configured per tenant."
            />
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <Link
            href="/account"
            className="text-[11px] font-medium text-[#0c0f14] underline-offset-2 hover:underline"
          >
            Organization vault, usage analytics, audit logs
          </Link>
          <p className="mt-1 text-[10px] text-slate-500">
            Clerk orgs + server-side logging are roadmap items — link leads to account for now.
          </p>
        </div>
      </div>
    </aside>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#0c0f14] shadow-sm transition hover:bg-slate-50"
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </Link>
  );
}

function FeedRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex gap-2 rounded-lg bg-slate-50/80 px-2 py-2 ring-1 ring-slate-100/80">
      {icon}
      <span className="leading-snug">{text}</span>
    </li>
  );
}
