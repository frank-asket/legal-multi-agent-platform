"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  CreditCard,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  Scale,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDashboardShell } from "./DashboardShellContext";
import { regionLabel } from "@/lib/jurisdiction";

type NavIcon = typeof LayoutDashboard;

const workspaceItems: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/dashboard", label: "Current matters", icon: LayoutDashboard },
  { href: "/dashboard#archive-placeholder", label: "Archive", icon: Archive },
  { href: "/dashboard#shared-placeholder", label: "Shared with team", icon: Users },
];

const navItems: {
  href: string;
  label: string;
  icon: NavIcon;
  match?: "dashboard-home" | "account";
}[] = [
  { href: "/dashboard#consultation", label: "Legal desk", icon: MessageCircle },
  { href: "/dashboard#recent-runs-heading", label: "Recent analyses", icon: Activity },
  { href: "/dashboard#dashboard-contact", label: "Contact", icon: Mail },
  { href: "/account", label: "Account & billing", icon: CreditCard, match: "account" },
];

function NavLink({
  href,
  label,
  Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  Icon: NavIcon;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#0c0f14] text-white shadow-md shadow-[#0c0f14]/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#0c0f14]"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { jurisdictionMode, localRegion } = useDashboardShell();

  const linkActive = (item: (typeof navItems)[number]) => {
    if (item.match === "account") return pathname.startsWith("/account");
    return false;
  };

  const workspaceActive = (href: string) =>
    href === "/dashboard" && (pathname === "/dashboard" || pathname === "/dashboard/");

  const pinLabel =
    jurisdictionMode === "international"
      ? "International"
      : regionLabel(localRegion);

  return (
    <>
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-2 px-2"
        onClick={onNavigate}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c0f14] text-white shadow-sm">
          <Scale className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="text-sm font-bold tracking-[0.12em] text-[#0c0f14]">
          LEGAL INTEL
        </span>
      </Link>
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Workspaces
      </p>
      <nav className="mb-4 flex flex-col gap-0.5" aria-label="Workspaces">
        {workspaceItems.map((item) => (
          <NavLink
            key={item.href + item.label}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={workspaceActive(item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Navigate
      </p>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto" aria-label="Workspace navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href + item.label}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={linkActive(item)}
            onClick={onNavigate}
          />
        ))}
      </nav>
      <div
        className="mt-auto border-t border-slate-100 pt-4 text-[11px] text-slate-600"
        id="jurisdiction-pin"
      >
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Jurisdiction pin
        </p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 font-medium text-[#0c0f14] ring-1 ring-slate-100">
          {jurisdictionMode === "international" ? "🌐 " : "📍 "}
          {pinLabel}
        </p>
        <p className="mt-2 px-2 text-[10px] leading-relaxed text-slate-500">
          Change in the header — feeds and watchdog copy follow this pin.
        </p>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-slate-200/80 bg-white px-3 py-6 lg:flex">
        <SidebarNav />
      </aside>

      {/* Mobile */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0c0f14] shadow-md lg:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[min(18rem,88vw)] border-r border-slate-200 bg-white px-3 py-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav onNavigate={() => setOpen(false)} />
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[35] bg-[#0c0f14]/25 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
