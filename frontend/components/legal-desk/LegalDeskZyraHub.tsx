"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Gavel,
  Newspaper,
  Scale,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { InquiryConsole } from "@/components/InquiryConsole";
import { PdfReviewPlaceholder } from "@/components/dashboard/PdfReviewPlaceholder";

/** High-contrast accent on dark legal-desk surfaces (white on black). */
export const ZYRA_NEON = "#ffffff";

type CatalogRow = {
  id: string;
  title: string;
  category: string;
  jurisdiction: string;
  snippet: string;
};

const CATALOG: CatalogRow[] = [
  {
    id: "c1",
    title: "Sample employment duties matrix (demo)",
    category: "Labour & employment",
    jurisdiction: "International",
    snippet: "Illustrative index entry — connect your corpus to replace demo rows.",
  },
  {
    id: "c2",
    title: "Commercial contract warranties — checklist",
    category: "Commercial",
    jurisdiction: "UK",
    snippet: "Placeholder summary; smart search will query your centralized vault.",
  },
  {
    id: "c3",
    title: "Data protection processor clauses (baseline)",
    category: "Privacy & data",
    jurisdiction: "EU GDPR lens",
    snippet: "Categorization tags help jurists filter by regime and topic.",
  },
  {
    id: "c4",
    title: "Treaty implementation note — foreign precedents",
    category: "International / IR",
    jurisdiction: "Multilateral",
    snippet: "IR officers can pin jurisdiction in the workspace header for feeds.",
  },
];

const NEWS = [
  {
    id: "n1",
    tag: "Regulatory",
    title: "Illustrative digest: upcoming filing deadlines in financial services (demo)",
    when: "Today",
    source: "Curated wire (placeholder)",
  },
  {
    id: "n2",
    tag: "Cross-border",
    title: "Placeholder: trade-compact clause watch for in-house counsel",
    when: "This week",
    source: "Desk feed",
  },
  {
    id: "n3",
    tag: "Labour",
    title: "Demo row — connect official gazettes for your pinned region",
    when: "Recent",
    source: "Jurisdiction pin",
  },
];

const CATEGORIES = [
  "All",
  "Labour & employment",
  "Commercial",
  "Privacy & data",
  "International / IR",
] as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LegalDeskZyraHub({ reviewMode }: { reviewMode: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CATALOG.filter((row) => {
      if (cat !== "All" && row.category !== cat) return false;
      if (!s) return true;
      return (
        row.title.toLowerCase().includes(s) ||
        row.snippet.toLowerCase().includes(s) ||
        row.jurisdiction.toLowerCase().includes(s)
      );
    });
  }, [q, cat]);

  return (
    <section
      id="consultation"
      aria-label="Legal desk"
      className="relative overflow-hidden border-t border-zinc-800 bg-black px-4 py-14 text-white sm:px-5 md:px-8"
    >
      <div
        className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full opacity-[0.12]"
        style={{
          background: `radial-gradient(circle, ${ZYRA_NEON} 0%, transparent 70%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-40 h-96 w-96 rounded-full opacity-[0.1]"
        style={{
          background: `radial-gradient(circle, ${ZYRA_NEON} 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-10 max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: ZYRA_NEON }}
          >
            Legal desk
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.35rem] md:leading-[1.12]">
            Run{" "}
            <span style={{ color: ZYRA_NEON }} className="font-semibold">
              legal intelligence
            </span>{" "}
            with clarity — database, AI answers, counsel, and news in one surface.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Inspired by modern legal AI consoles: dark workspace, crisp white accents, and plain-language tooling for jurists,
            lawyers, and international relations teams. Connect your vault to replace demo catalog and news rows.
          </p>
        </div>

        <div className="mb-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FeatureLaunch
            icon={<BookOpen className="h-5 w-5" aria-hidden />}
            title="Centralized legal database"
            description="Laws and regulations with smart search and categorization."
            onOpen={() => scrollToId("legal-database")}
          />
          <FeatureLaunch
            icon={<Bot className="h-5 w-5" aria-hidden />}
            title="AI legal chatbot"
            description="Instant answers in simple language, tied to your files."
            onOpen={() => scrollToId("ai-legal-chatbot")}
          />
          <FeatureLaunch
            icon={<Scale className="h-5 w-5" aria-hidden />}
            title="Lawyer consultation"
            description="Pro bono and paid pathways based on user needs."
            onOpen={() => scrollToId("lawyer-consultation")}
          />
          <FeatureLaunch
            icon={<Newspaper className="h-5 w-5" aria-hidden />}
            title="Legal news updates"
            description="Latest developments in one glance — pin your jurisdiction."
            onOpen={() => scrollToId("legal-news-updates")}
          />
        </div>

        <div className="space-y-16 md:space-y-20">
          <div id="legal-database" className="scroll-mt-28">
            <SectionHeader
              icon={<BookOpen className="h-4 w-4" />}
              title="Centralized legal database"
              subtitle="Easy access to laws and regulations with smart search and categorization."
            />
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-[0_0_40px_rgba(255,255,255,0.05)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="relative max-w-lg flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    aria-hidden
                  />
                  <label className="sr-only" htmlFor="legal-db-search">
                    Search database
                  </label>
                  <input
                    id="legal-db-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search instruments, topics, jurisdictions…"
                    className="w-full rounded-full border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-white/45 focus:ring-1 focus:ring-white/25"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                        cat === c
                          ? "bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.12)]"
                          : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-900/90 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Jurisdiction</th>
                      <th className="hidden px-4 py-3 md:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-zinc-500">
                          No demo rows match your filters — widen search or pick “All”.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => (
                        <tr key={r.id} className="bg-zinc-950/40 transition hover:bg-zinc-900/60">
                          <td className="px-4 py-3 font-medium text-white">{r.title}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white">
                              {r.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">{r.jurisdiction}</td>
                          <td className="hidden max-w-md px-4 py-3 text-zinc-500 md:table-cell">
                            {r.snippet}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="ai-legal-chatbot" className="scroll-mt-28">
            <SectionHeader
              icon={<Bot className="h-4 w-4" />}
              title="AI legal chatbot"
              subtitle="Instant answers to legal questions in simple, understandable language — with citations when your matter files are connected."
            />
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
                Same multi-stage desk as production — styled for focus
              </span>
            </div>
            <div className="mt-6">
              {reviewMode ? (
                <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                  <InquiryConsole variant="zyra" />
                  <PdfReviewPlaceholder variant="zyra" />
                </div>
              ) : (
                <InquiryConsole variant="zyra" />
              )}
            </div>
          </div>

          <div id="lawyer-consultation" className="scroll-mt-28">
            <SectionHeader
              icon={<Gavel className="h-4 w-4" />}
              title="Lawyer consultation"
              subtitle="Connect with professional lawyers — pro bono intake for qualifying matters and paid consults for expedited review."
            />
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <LawyerCard
                badge="Pro bono"
                title="Clinic & intake"
                text="Route low-income or public-interest questions to verified clinic partners. Availability varies by region."
                cta="Request intake"
              />
              <LawyerCard
                badge="Paid"
                title="On-demand counsel"
                text="Book a licensed lawyer for contract review, second opinions, or negotiation support. Billing through your org."
                cta="See availability"
                highlight
              />
              <LawyerCard
                badge="Enterprise"
                title="Dedicated relationship"
                text="Panel counsel aligned to your jurisdiction pins and matter types. Integrates with your workspace policies."
                cta="Talk to sales"
              />
            </div>
            <p className="mt-4 text-center text-[11px] text-zinc-500">
              Directory and scheduling are roadmap integrations — buttons open your standard contact or CRM flow when wired.
            </p>
          </div>

          <div id="legal-news-updates" className="scroll-mt-28">
            <SectionHeader
              icon={<Newspaper className="h-4 w-4" />}
              title="Legal news updates"
              subtitle="Stay informed with curated developments — align with your pinned jurisdiction in the workspace header."
            />
            <ul className="mt-6 space-y-3">
              {NEWS.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-zinc-700"
                >
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.45)]"
                    style={{ backgroundColor: ZYRA_NEON }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-zinc-500">
                      <span style={{ color: ZYRA_NEON }} className="font-semibold">
                        {item.tag}
                      </span>
                      <span>·</span>
                      <span>{item.when}</span>
                      <span>·</span>
                      <span>{item.source}</span>
                    </div>
                    <p className="mt-1 font-medium text-white">{item.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-center text-[11px] leading-relaxed text-zinc-500">
          <strong className="text-zinc-300">Disclaimer:</strong> AI outputs are informational and not legal advice.
          Escalate high-stakes decisions to qualified counsel in your jurisdiction.
        </p>
      </div>
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: ZYRA_NEON }}
      >
        <span className="text-white/90">{icon}</span>
        {title}
      </p>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}

function FeatureLaunch({
  icon,
  title,
  description,
  onOpen,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 text-left transition hover:border-white/35 hover:shadow-[0_0_32px_rgba(255,255,255,0.06)]"
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 text-white transition group-hover:border-white/40"
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.08)" }}
      >
        {icon}
      </span>
      <span className="mt-4 text-sm font-semibold text-white">{title}</span>
      <span className="mt-1 text-xs leading-relaxed text-zinc-500">{description}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </button>
  );
}

function LawyerCard({
  badge,
  title,
  text,
  cta,
  highlight,
}: {
  badge: string;
  title: string;
  text: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 ${
        highlight
          ? "border-white/40 bg-white/[0.04] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
          : "border-zinc-800 bg-zinc-950/70"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            highlight ? "bg-white text-black" : "border border-zinc-600 text-zinc-400"
          }`}
        >
          {badge}
        </span>
        <Users className="h-4 w-4 text-zinc-600" aria-hidden />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{text}</p>
      <button
        type="button"
        className={`mt-5 inline-flex w-fit items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
          highlight
            ? "bg-white text-black hover:bg-zinc-200"
            : "border border-zinc-600 text-white hover:border-white/40 hover:text-white"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
