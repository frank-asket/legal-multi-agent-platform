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

export function InsightsPanel({ variant = "light" }: { variant?: "light" | "dark" } = {}) {
  const dark = variant === "dark";
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

  const shell = dark
    ? "space-y-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-4 lg:p-5"
    : "space-y-4 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100/80 lg:p-5";

  const labelMuted = dark ? "text-white/45" : "text-slate-500";
  const body = dark ? "text-white/60" : "text-slate-600";
  const bodySoft = dark ? "text-white/50" : "text-slate-500";
  const row = dark
    ? "flex justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2"
    : "flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100";
  const rowKey = dark ? "text-white/55" : "text-slate-600";
  const rowVal = dark ? "font-semibold capitalize text-white" : "text-[#0c0f14] font-semibold capitalize";

  return (
    <aside
      className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
      aria-label="Contextual insights"
    >
      <div className={shell}>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>At-a-glance risk</p>
          <p className={`mt-2 text-xs ${body}`}>
            Based on your latest analysis in this browser. Side-by-side PDF review and multi-file comparison arrive when
            your matter vault is connected.
          </p>
          {last ? (
            <ul className={`mt-3 space-y-2 text-xs ${dark ? "text-white" : "text-[#0c0f14]"}`}>
              <li className={row}>
                <span className={rowKey}>Exposure band</span>
                <span className={rowVal}>{last.riskBand}</span>
              </li>
              <li className={row}>
                <span className={rowKey}>Automated clause alerts</span>
                <span className={`tabular-nums ${dark ? "font-semibold text-white" : "font-semibold"}`}>
                  {last.playbookFlagCount}
                </span>
              </li>
              <li className={row}>
                <span className={rowKey}>Source check</span>
                <span className={dark ? "font-semibold text-white" : "font-semibold"}>
                  {last.faithful === true
                    ? "Aligned with text"
                    : last.faithful === false
                      ? "Needs lawyer review"
                      : "—"}
                </span>
              </li>
            </ul>
          ) : (
            <p className={`mt-3 text-xs ${bodySoft}`}>No analyses yet — use the legal desk to populate this panel.</p>
          )}
        </div>

        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>Quick actions</p>
          <div className="mt-2 flex flex-col gap-2">
            <QuickAction
              dark={dark}
              href="#consultation"
              icon={<BookMarked className="h-3.5 w-3.5" aria-hidden />}
              label="Generate summary"
            />
            <QuickAction
              dark={dark}
              href="#consultation"
              icon={<Calendar className="h-3.5 w-3.5" aria-hidden />}
              label="Extract deadlines"
            />
            <QuickAction
              dark={dark}
              href="#consultation"
              icon={<Languages className="h-3.5 w-3.5" aria-hidden />}
              label="Plain English"
            />
          </div>
        </div>

        <div
          className={
            dark
              ? "rounded-xl border border-dashed border-white/15 bg-black/30 p-3"
              : "rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3"
          }
        >
          <p className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>
            <PanelRight className="h-3.5 w-3.5" aria-hidden />
            Review mode
          </p>
          <p className={`mt-1 text-[11px] ${body}`}>
            Place the question panel next to the document preview while you compare citations to the source.
          </p>
          <button
            type="button"
            onClick={() => setReviewMode(!reviewMode)}
            className={
              dark
                ? "mt-2 w-full rounded-full border border-white/20 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                : "mt-2 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0c0f14] shadow-sm transition hover:bg-slate-50"
            }
          >
            {reviewMode ? "Exit review mode" : "Enter review mode"}
          </button>
        </div>

        <div>
          <p className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>
            <Bell className="h-3.5 w-3.5" aria-hidden />
            Regulatory watchdog
          </p>
          <p className={`mt-2 text-[11px] leading-relaxed ${body}`}>
            With {pinned} pinned in the header, alerts on regulatory change affecting newly filed instruments can appear
            here once your counsel desk subscribes to official feeds.
          </p>
        </div>

        <div>
          <p className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>
            <Newspaper className="h-3.5 w-3.5" aria-hidden />
            Jurisdiction feed
          </p>
          <ul className={`mt-2 space-y-2 text-[11px] ${body}`}>
            <FeedRow
              dark={dark}
              icon={<Globe2 className={`h-3 w-3 shrink-0 ${dark ? "text-white/40" : "text-slate-400"}`} aria-hidden />}
              text={`Illustrative digest for ${pinned} — your team can connect trusted gazettes, regulators, and treaty depositories.`}
            />
            <FeedRow
              dark={dark}
              icon={<ListChecks className={`h-3 w-3 shrink-0 ${dark ? "text-white/40" : "text-slate-400"}`} aria-hidden />}
              text="Multilingual desk: pose questions in one working language while the underlying agreement stays in another, when translation is enabled for your organization."
            />
          </ul>
        </div>

        <div className={`border-t pt-3 ${dark ? "border-white/10" : "border-slate-100"}`}>
          <Link
            href="/account"
            className={`text-[11px] font-medium underline-offset-2 hover:underline ${dark ? "text-white" : "text-[#0c0f14]"}`}
          >
            Firm workspace, usage insights, compliance history
          </Link>
          <p className={`mt-1 text-[10px] ${bodySoft}`}>
            Team sharing and partner dashboards are rolling out — this link opens your account for now.
          </p>
        </div>
      </div>
    </aside>
  );
}

function QuickAction({
  href,
  icon,
  label,
  dark,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        dark
          ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs font-medium text-white transition hover:border-white/25 hover:bg-white/5"
          : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#0c0f14] shadow-sm transition hover:bg-slate-50"
      }
    >
      <span className={dark ? "text-white/55" : "text-slate-500"}>{icon}</span>
      {label}
    </Link>
  );
}

function FeedRow({ icon, text, dark }: { icon: ReactNode; text: string; dark: boolean }) {
  return (
    <li
      className={
        dark
          ? "flex gap-2 rounded-lg border border-white/10 bg-black/25 px-2 py-2"
          : "flex gap-2 rounded-lg bg-slate-50/80 px-2 py-2 ring-1 ring-slate-100/80"
      }
    >
      {icon}
      <span className="leading-snug">{text}</span>
    </li>
  );
}
