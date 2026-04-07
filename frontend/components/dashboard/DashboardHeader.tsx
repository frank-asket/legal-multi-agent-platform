"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Globe2, MapPin, Scale } from "lucide-react";
import { useDashboardShell } from "./DashboardShellContext";
import { LOCAL_REGIONS, regionLabel } from "@/lib/jurisdiction";
import type { LocalRegion } from "@/lib/jurisdiction";
import { apiDocsUrl } from "@/lib/api";

export function DashboardHeader() {
  const { user } = useUser();
  const {
    matterTitle,
    setMatterTitle,
    jurisdictionMode,
    setJurisdictionMode,
    localRegion,
    setLocalRegion,
  } = useDashboardShell();

  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || "User";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur-md sm:px-5 md:px-8">
      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-3 pt-10 lg:flex-row lg:items-center lg:justify-between lg:pt-3">
        <div className="flex min-w-0 items-center gap-3 lg:max-w-[38%]">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-white transition hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
              <Scale className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="hidden text-[10px] font-bold tracking-[0.15em] text-white sm:block">LEGAL INTEL</span>
          </Link>
          <div className="min-w-0 flex-1 lg:pt-0">
            <label className="sr-only" htmlFor="matter-title">
              Matter or file name
            </label>
            <input
              id="matter-title"
              value={matterTitle}
              onChange={(e) => setMatterTitle(e.target.value)}
              placeholder="Matter title"
              className="w-full border-0 border-b border-transparent bg-transparent text-sm font-medium text-white outline-none transition placeholder:text-white/35 focus:border-white/25"
            />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <nav className="flex items-center gap-6 text-sm" aria-label="Workspace views">
            <a
              href={apiDocsUrl()}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white/45 transition hover:text-white"
            >
              Agent
            </a>
            <span className="font-semibold text-white">Dashboard</span>
          </nav>
          <p className="mt-0.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
            Agent Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end lg:shrink-0">
          <div
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
            role="group"
            aria-label="Jurisdiction mode"
          >
            <ModeChip
              active={jurisdictionMode === "international"}
              icon={<Globe2 className="h-3.5 w-3.5" aria-hidden />}
              label="Intl"
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
            <select
              id="region-select"
              value={localRegion}
              onChange={(e) => setLocalRegion(e.target.value as LocalRegion)}
              className="rounded-full border border-white/15 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white outline-none focus:ring-1 focus:ring-white/30"
            >
              {LOCAL_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          ) : null}
          <Link
            href="/"
            className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/60 hover:border-white/30 hover:text-white sm:inline-block"
          >
            Marketing site
          </Link>
          <span className="hidden max-w-[140px] truncate text-sm text-white/80 md:inline">{displayName}</span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-2 ring-white/20",
              },
            }}
          />
        </div>
      </div>
      {jurisdictionMode === "local" ? (
        <p className="mx-auto mt-2 hidden max-w-[1600px] text-[11px] text-white/40 md:block">
          Pinned: {regionLabel(localRegion)} — feeds follow this pin.
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
        active ? "bg-white text-black" : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
