"use client";

import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Globe2, MapPin } from "lucide-react";
import { useDashboardShell } from "./DashboardShellContext";
import { LOCAL_REGIONS, regionLabel } from "@/lib/jurisdiction";
import type { LocalRegion } from "@/lib/jurisdiction";

export function DashboardHeader() {
  const {
    matterTitle,
    setMatterTitle,
    jurisdictionMode,
    setJurisdictionMode,
    localRegion,
    setLocalRegion,
  } = useDashboardShell();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-5 md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1 pt-10 lg:pt-0">
          <label className="sr-only" htmlFor="matter-title">
            Matter or file name
          </label>
          <input
            id="matter-title"
            value={matterTitle}
            onChange={(e) => setMatterTitle(e.target.value)}
            placeholder="Name this matter or instrument"
            className="w-full max-w-xl border-0 border-b border-transparent bg-transparent text-lg font-semibold tracking-tight text-[#0c0f14] outline-none transition placeholder:text-slate-400 focus:border-[#0c0f14]/25"
          />
          <p className="mt-0.5 text-[11px] text-slate-500">
            Your workspace for sourced Q&amp;A, jurisdiction context, and review — built for counsel and IR desks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 shadow-sm"
            role="group"
            aria-label="Jurisdiction mode"
          >
            <ModeChip
              active={jurisdictionMode === "international"}
              icon={<Globe2 className="h-3.5 w-3.5" aria-hidden />}
              label="International"
              onClick={() => setJurisdictionMode("international")}
            />
            <ModeChip
              active={jurisdictionMode === "local"}
              icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}
              label="Local"
              onClick={() => setJurisdictionMode("local")}
            />
          </div>

          {jurisdictionMode === "local" ? (
            <label className="sr-only" htmlFor="region-select">
              Local jurisdiction
            </label>
          ) : null}
          {jurisdictionMode === "local" ? (
            <select
              id="region-select"
              value={localRegion}
              onChange={(e) => setLocalRegion(e.target.value as LocalRegion)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#0c0f14] shadow-sm outline-none ring-[#0c0f14]/0 focus:ring-2 focus:ring-[#0c0f14]/15"
            >
              {LOCAL_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          ) : (
            <span className="hidden text-[11px] text-slate-500 sm:inline">
              Cross-border baseline (no single domestic pin).
            </span>
          )}

          <Link
            href="/"
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 sm:inline-block"
          >
            Marketing site
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: "h-9 w-9 ring-2 ring-white shadow-md" },
            }}
          />
        </div>
      </div>
      {jurisdictionMode === "local" ? (
        <p className="mx-auto mt-2 hidden max-w-[1600px] text-[11px] text-slate-500 md:block">
          Pinned: {regionLabel(localRegion)} — regulatory watchdog and news below follow this pin (placeholders until
          backend feeds are wired).
        </p>
      ) : null}
    </header>
  );
}

function ModeChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
        active
          ? "bg-[#0c0f14] text-white shadow-md"
          : "text-slate-600 hover:bg-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
