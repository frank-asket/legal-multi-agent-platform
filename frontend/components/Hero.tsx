"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Sparkles, Workflow } from "lucide-react";

export function Hero() {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.55;
  const stagger = reduce ? 0 : 0.09;

  return (
    <section
      className="relative min-h-[min(88vh,560px)] overflow-hidden bg-[#0c0f14] sm:min-h-[520px] md:min-h-[560px]"
      id="services"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0c0f14] to-black"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath fill='%23ffffff' fill-opacity='0.35' d='M0 0h40v40H0z'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 animate-float-slow rounded-full bg-indigo-500/10 blur-3xl sm:right-0" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 animate-float-delayed rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute right-[15%] top-[18%] hidden text-white/10 sm:block">
        <Workflow className="h-24 w-24 md:h-28 md:w-28" strokeWidth={0.6} />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-5 sm:pb-16 sm:pt-24 md:min-h-[560px] md:px-6 md:pb-20 md:pt-32">
        <motion.div
          className="mb-4 inline-flex flex-wrap items-center gap-2"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-200/90" aria-hidden />
            For counsel &amp; IR teams
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/55 backdrop-blur-sm">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Source-linked answers
          </span>
        </motion.div>
        <motion.h1
          className="max-w-3xl text-3xl font-semibold leading-[1.12] text-white sm:text-4xl md:text-5xl md:leading-[1.1]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: dur,
            delay: stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Research-grade support for contracts, treaties, and cross-border files.
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: dur,
            delay: stagger * 2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Ask in everyday language. The desk returns a clear summary with quotes tied
          to your instrument — useful for due diligence, compliance checks, and
          treaty or contract review. Try the demo on a sample agreement; no account
          required.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: dur,
            delay: stagger * 3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 sm:mt-10"
        >
          <a
            href="#consultation"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0c0f14] shadow-lg shadow-black/25 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl active:translate-y-0"
          >
            Try the desk — free demo
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
