"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Cpu, Scale } from "lucide-react";

export function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-[#fafbfc] to-slate-100/60 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.45 }}
          className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0c0f14] text-white shadow-lg shadow-slate-900/20">
              <Scale className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0c0f14]">
                Legal Multi-Agent Platform
              </p>
              <p className="text-xs text-slate-500">
                FastAPI backend · Next.js console
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Grounded answers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm">
              <Cpu className="h-3.5 w-3.5" aria-hidden />
              Agent pipeline
            </span>
          </div>
        </motion.div>
        <p className="mt-8 text-center text-[11px] text-slate-400 sm:text-left">
          © {new Date().getFullYear()} · For demonstration and integration testing
        </p>
      </div>
    </footer>
  );
}
