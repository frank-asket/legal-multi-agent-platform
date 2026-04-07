"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  Scale,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDashboardShell } from "./DashboardShellContext";
import { regionLabel } from "@/lib/jurisdiction";

type NavIcon = typeof LayoutDashboard;

const primaryNav: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/dashboard#dashboard-main", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard#clients-table", label: "Clients", icon: Users },
  { href: "/dashboard#consultation", label: "Petitions", icon: FileText },
  { href: "/dashboard#consultation", label: "Letters", icon: FileText },
];

const secondaryNav: {
  href: string;
  label: string;
  icon: NavIcon;
  match?: "account";
}[] = [
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
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-white" aria-hidden />
      ) : null}
      <Icon className="ml-0.5 h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { jurisdictionMode, localRegion } = useDashboardShell();

  const linkActive = (item: (typeof secondaryNav)[number]) => {
    if (item.match === "account") return pathname.startsWith("/account");
    return false;
  };

  const dashboardActive = pathname === "/dashboard" || pathname === "/dashboard/";

  const pinLabel =
    jurisdictionMode === "international"
      ? "International"
      : regionLabel(localRegion);

  return (
    <>
      <Link href="/dashboard" className="mb-5 flex items-center gap-2 px-2" onClick={onNavigate}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white text-black shadow-sm">
          <Scale className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="text-xs font-bold tracking-[0.12em] text-white">LEGAL INTEL</span>
      </Link>

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
        <p className="truncate text-sm font-medium text-white">{user?.fullName || "Workspace user"}</p>
        <p className="mt-0.5 text-[11px] text-white/45">Workspace plan</p>
      </div>

      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-white/35">Navigation</p>
      <nav className="mb-6 flex flex-col gap-0.5" aria-label="Primary navigation">
        {primaryNav.map((item) => (
          <NavLink
            key={item.href + item.label}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={item.label === "Dashboard" ? dashboardActive : false}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-white/35">More</p>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto" aria-label="Secondary navigation">
        {secondaryNav.map((item) => (
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

      <div className="mt-auto border-t border-white/10 pt-4 text-[11px] text-white/50" id="jurisdiction-pin">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/35">Jurisdiction pin</p>
        <p className="mt-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-medium text-white">{pinLabel}</p>
        <p className="mt-2 px-2 text-[10px] leading-relaxed text-white/40">Adjust from the header; feeds follow this pin.</p>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-white/10 bg-zinc-950 px-3 py-6 lg:flex">
        <SidebarNav />
      </aside>

      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-zinc-900 text-white shadow-lg lg:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[min(18rem,88vw)] border-r border-white/10 bg-zinc-950 px-3 py-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav onNavigate={() => setOpen(false)} />
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[35] bg-black/60 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
