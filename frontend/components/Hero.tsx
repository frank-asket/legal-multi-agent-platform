"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ProductPreview } from "@/components/marketing/ProductPreview";

export function Hero() {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.55;
  const stagger = reduce ? 0 : 0.09;

  return (
    <section className="relative overflow-hidden bg-[#0c0f14] pb-6 pt-16 sm:pt-20 md:pt-24">
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-[#0c0f14] to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0 0h40v40H0z'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl sm:right-0" />
      <div className="pointer-events-none absolute -left-16 bottom-1/3 h-56 w-56 rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <motion.div
          className="flex justify-center"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-white/80" aria-hidden />
            Production desk · live
          </span>
        </motion.div>
        <motion.h1
          className="mx-auto mt-6 max-w-4xl text-center text-3xl font-semibold leading-[1.12] text-white sm:text-4xl md:text-5xl md:leading-[1.08]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, delay: stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          Run document-grounded legal review with a multi-agent desk
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-white/70 sm:text-base md:mt-6"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, delay: stagger * 2, ease: [0.22, 1, 0.36, 1] }}
        >
          Ask in everyday language. Get a structured answer with citations into your instrument — built for counsel,
          compliance, and international relations teams reviewing contracts, MOUs, and treaty-related materials.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, delay: stagger * 3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href="#consultation"
            className="inline-flex w-full items-center justify-center rounded-lg border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/55 hover:bg-white/5 sm:w-auto"
          >
            Live demo
          </a>
          <Link
            href="/sign-up"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-[#0c0f14] shadow-lg shadow-black/25 transition hover:bg-slate-100 sm:w-auto"
          >
            Get started
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
        <ProductPreview />
      </div>
    </section>
  );
}
