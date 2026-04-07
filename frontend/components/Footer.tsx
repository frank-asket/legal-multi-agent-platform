"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Scale } from "lucide-react";
import { apiDocsUrl } from "@/lib/api";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#consultation", label: "Live desk" },
      { href: "/dashboard", label: "Workspace" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "#whitepaper", label: "Overview" },
      { href: "/account", label: "Account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#consultation", label: "Disclaimer" },
      { href: "#faq", label: "Data & security" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: apiDocsUrl(), label: "API docs", external: true },
    ],
  },
] as const;

export function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 md:px-6 md:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.45 }}
          className="flex flex-col gap-10 md:flex-row md:justify-between"
        >
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-lg shadow-black/30">
                <Scale className="h-5 w-5 text-white" strokeWidth={1.5} />
              </span>
              <span className="text-xs font-bold tracking-[0.2em]">LEGAL INTEL</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Multi-agent legal desk with source-linked answers — built for firms, in-house teams, and international
              affairs workflows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      {"external" in item && item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-white/70 transition hover:text-white"
                        >
                          {item.label}
                          <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm text-white/70 transition hover:text-white"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
        <p className="mt-12 border-t border-white/10 pt-8 text-center text-[11px] text-white/40 md:text-left">
          © {new Date().getFullYear()} · Demonstration environment — outputs are not legal advice
        </p>
      </div>
      <div className="overflow-hidden border-t border-white/5 px-4 pb-6 pt-10 sm:px-5 md:px-6">
        <p
          className="select-none text-center text-[clamp(3rem,14vw,10rem)] font-black leading-none tracking-tighter text-white/[0.07]"
          aria-hidden
        >
          LEGAL INTEL
        </p>
      </div>
    </footer>
  );
}
