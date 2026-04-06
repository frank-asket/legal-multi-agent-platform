"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  LayoutGrid,
  ListOrdered,
  Menu,
  MessageCircle,
  Scale,
  X,
} from "lucide-react";
import { ClerkNavbarSession } from "@/components/ClerkNavbarSession";
import { apiDocsUrl } from "@/lib/api";

const links = [
  { href: "#services", label: "Services", Icon: LayoutGrid },
  { href: "#process", label: "Process", Icon: ListOrdered },
  { href: "#consultation", label: "Consultation", Icon: MessageCircle },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0f14]/90 shadow-lg shadow-black/10 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0c0f14]/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-5 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-white transition hover:opacity-95"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition duration-300 group-hover:bg-white/15 sm:h-10 sm:w-10 sm:rounded-lg">
            <Scale className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.18em] sm:text-xs sm:tracking-[0.2em] md:text-sm">
            LEGAL INTEL
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <l.Icon className="h-4 w-4 opacity-70" aria-hidden />
              {l.label}
            </a>
          ))}
          <a
            href={apiDocsUrl()}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            API
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </a>
          <ClerkNavbarSession variant="desktop" />
        </nav>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#0c0f14] shadow-md shadow-black/20 transition duration-300 hover:-translate-y-px hover:bg-slate-100 hover:shadow-lg active:translate-y-0"
          >
            Get started
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="bg-[#0c0f14]/98 px-4 py-4 backdrop-blur-md">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-xl py-3 pl-1 text-white/90 transition hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <l.Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {l.label}
                </a>
              ))}
              <a
                href={apiDocsUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-3 pl-1 text-white/90"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                API docs
              </a>
              <ClerkNavbarSession variant="mobile" />
              <Link
                href="/sign-up"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-semibold text-[#0c0f14] shadow-lg transition active:scale-[0.99]"
                onClick={() => setOpen(false)}
              >
                Get started
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
