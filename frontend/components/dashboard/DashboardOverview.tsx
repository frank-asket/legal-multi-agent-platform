import {
  ArrowUpRight,
  ChevronDown,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { StatusPill } from "./StatusPill";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const barHeights = [44, 62, 38, 72, 55, 68, 48, 81, 58];

const weekStrip = [
  { d: "21", w: "Sun", current: true },
  { d: "22", w: "Mon", current: false },
  { d: "23", w: "Tue", current: false },
  { d: "24", w: "Wed", current: false },
  { d: "25", w: "Thu", current: false },
  { d: "26", w: "Fri", current: false },
  { d: "27", w: "Sat", current: false },
];

function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 ${className}`}
    >
      {initials}
    </span>
  );
}

export function DashboardOverview() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 pb-12 pt-16 sm:px-5 md:px-8 lg:pt-6">
      {/* Search */}
      <div className="flex justify-center lg:justify-stretch">
        <div className="relative w-full max-w-xl lg:max-w-none">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search matters, documents, chats…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3 pl-11 pr-4 text-sm text-[#0c0f14] shadow-sm outline-none ring-[#0c0f14]/20 placeholder:text-slate-400 focus:border-[#0c0f14]/30 focus:ring-2"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Case activity */}
        <section
          id="case-activity"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-7"
          aria-labelledby="case-activity-heading"
        >
          <h2 id="case-activity-heading" className="text-base font-semibold text-[#0c0f14]">
            Case activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">Matter volume by month</p>
          <div className="mt-8 flex h-52 items-end justify-between gap-2 sm:gap-3" role="img" aria-label="Bar chart Jan through Sep">
            {months.map((m, i) => (
              <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full max-w-[2.5rem] rounded-t-md bg-[#0c0f14] transition-all"
                  style={{ height: `${(barHeights[i] / 100) * 11}rem` }}
                />
                <span className="text-[10px] font-medium text-slate-500">{m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:grid-cols-2">
          <div id="documents" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-3xl font-semibold tabular-nums text-[#0c0f14]">3</p>
            <p className="mt-2 text-xs font-medium text-slate-500">Pending documents</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-3xl font-semibold tabular-nums text-[#0c0f14]">65%</p>
            <p className="mt-2 text-xs font-medium text-slate-500">Case progress</p>
          </div>
          <div id="next-hearing" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xl font-semibold tabular-nums text-[#0c0f14]">Dec 15</p>
            <p className="mt-2 text-xs font-medium text-slate-500">Next hearing</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-3xl font-semibold tabular-nums text-[#0c0f14]">$2,450</p>
            <p className="mt-2 text-xs font-medium text-slate-500">Outstanding balance</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks */}
        <section
          id="tasks"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          aria-labelledby="tasks-heading"
        >
          <h2 id="tasks-heading" className="text-base font-semibold text-[#0c0f14]">
            Task
          </h2>
          <div id="calendar" className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {weekStrip.map((day) => (
              <button
                key={day.d + day.w}
                type="button"
                className={`flex min-w-[3.25rem] flex-col items-center rounded-xl px-3 py-2 text-center text-xs transition ${
                  day.current
                    ? "bg-[#0c0f14] text-white shadow-md"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="font-semibold">{day.d}</span>
                <span className="opacity-80">{day.w}</span>
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { title: "Review medical records", status: "pending" as const },
              { title: "Draft protective order response", status: "done" as const },
              { title: "Client intake — follow up", status: "pending" as const },
            ].map((t) => (
              <li
                key={t.title}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" aria-label={t.title} />
                <span className="flex-1 text-sm font-medium text-[#0c0f14]">{t.title}</span>
                <StatusPill variant={t.status === "done" ? "done" : "pending"}>
                  {t.status === "done" ? "Done" : "Pending"}
                </StatusPill>
                <button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600" aria-label="More">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Cases */}
        <section
          id="cases"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          aria-labelledby="cases-heading"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="cases-heading" className="text-base font-semibold text-[#0c0f14]">
              Case
            </h2>
            <label className="sr-only" htmlFor="case-filter">
              Filter case type
            </label>
            <div className="relative">
              <select
                id="case-filter"
                className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#0c0f14]/20"
                defaultValue="all"
              >
                <option value="all">All type</option>
                <option value="family">Family</option>
                <option value="pi">Personal injury</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" aria-hidden />
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { name: "David Ross — Divorce", status: "progress" as const },
              { name: "Acme LLC — Vendor dispute", status: "done" as const },
              { name: "Chen v. Harbor Insurance", status: "progress" as const },
            ].map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50/80"
                >
                  <span className="flex-1 text-sm font-medium text-[#0c0f14]">{c.name}</span>
                  <StatusPill variant={c.status === "done" ? "done" : "progress"}>
                    {c.status === "done" ? "Done" : "In progress"}
                  </StatusPill>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transactions */}
        <section
          id="attorney"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          aria-labelledby="txn-heading"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="txn-heading" className="text-base font-semibold text-[#0c0f14]">
              Transaction history
            </h2>
            <div className="relative">
              <select
                className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#0c0f14]/20"
                defaultValue="all"
                aria-label="Filter transactions"
              >
                <option value="all">All type</option>
                <option value="retainer">Retainer</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" aria-hidden />
            </div>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {[
              { id: "TXN PUSFVBB", cat: "Personal injury", amt: "$4,500", method: "PayPal", status: "paid" as const, initials: "DR" },
              { id: "TXN K8LM22Q", cat: "Family law", amt: "$1,200", method: "ACH", status: "pending" as const, initials: "MC" },
              { id: "TXN BX91AAP", cat: "Corporate", amt: "$890", method: "Card", status: "paid" as const, initials: "JL" },
            ].map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
                <Avatar initials={row.initials} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0c0f14]">{row.id}</p>
                  <p className="text-xs text-slate-500">{row.cat}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#0c0f14]">{row.amt}</p>
                  <p className="text-[11px] text-slate-500">{row.method}</p>
                </div>
                <StatusPill variant={row.status === "paid" ? "paid" : "pending"}>
                  {row.status === "paid" ? "Paid" : "Pending"}
                </StatusPill>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent chats */}
        <section
          id="messages"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          aria-labelledby="chats-heading"
        >
          <h2 id="chats-heading" className="text-base font-semibold text-[#0c0f14]">
            Recent chats
          </h2>
          <p className="mt-1 text-xs text-slate-500">Multi-agent session threads</p>
          <ul className="mt-4 space-y-2">
            {[
              { name: "David Romas", time: "2:23 AM", initials: "DR" },
              { name: "Sarah Chen", time: "Yesterday", initials: "SC" },
              { name: "Legal Intel Bot", time: "Mon", initials: "LI" },
            ].map((c) => (
              <li key={c.name + c.time}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <Avatar initials={c.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0c0f14]">{c.name}</p>
                    <p className="text-[11px] text-slate-500">Last sent · {c.time}</p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        id="contact"
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading" className="text-base font-semibold text-[#0c0f14]">
          Contact
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Prefer in-app consult or API? Use the agent console below or reach your firm admin for workspace access.
        </p>
      </section>
    </div>
  );
}
