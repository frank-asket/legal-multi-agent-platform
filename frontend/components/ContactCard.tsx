"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Headphones,
  Link2,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";

export function ContactCard() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-[#eef2f6] to-slate-100/90 p-7 shadow-sm ring-1 ring-slate-200/60 sm:p-8 md:rounded-3xl md:p-10"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0c0f14] text-white shadow-md">
            <Headphones className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#0c0f14]">
              Prefer human review?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              The desk speeds up first-pass reading and cites the instrument. For
              opinions, filings, or politically sensitive matters, use it alongside
              qualified lawyers or policy counsel.
            </p>
          </div>
        </div>
        <a
          href="#consultation-form"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0c0f14] shadow-sm transition hover:border-slate-300"
        >
          Try the desk first
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition duration-300 hover:scale-105 hover:border-slate-300 hover:shadow-md active:scale-100"
          aria-label="Links"
        >
          <Link2 className="h-4 w-4" />
        </a>
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition duration-300 hover:scale-105 hover:border-slate-300 hover:shadow-md active:scale-100"
          aria-label="Feed"
        >
          <Rss className="h-4 w-4" />
        </a>
      </div>

      <h3 className="mt-6 text-sm font-semibold text-[#0c0f14]">Contact</h3>

      <div className="mt-4 space-y-5 text-sm text-slate-600 sm:space-y-6">
        <div className="flex gap-3 rounded-xl transition-colors hover:bg-white/40 sm:gap-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <div>
            <p className="font-medium text-[#0c0f14]">Office</p>
            <p className="mt-0.5 leading-relaxed">Remote-first legal intelligence lab</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl transition-colors hover:bg-white/40 sm:gap-4">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <div>
            <p className="font-medium text-[#0c0f14]">Availability</p>
            <p className="mt-0.5 leading-relaxed">Your organization can confirm the service is online before a live matter.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl transition-colors hover:bg-white/40 sm:gap-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <div>
            <p className="font-medium text-[#0c0f14]">Technical desk</p>
            <p className="mt-0.5 leading-relaxed">Documentation for IT and integration teams is linked from the site header.</p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-200/80 pt-5 sm:gap-4 sm:pt-6">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <div>
            <p className="font-medium text-[#0c0f14]">Step-by-step view</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Choose the step-by-step option to see how each stage of the desk advances your question.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
