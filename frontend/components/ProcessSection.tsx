"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Gavel, Search, ShieldCheck } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

const steps = [
  {
    icon: BookOpen,
    title: "Intake & structure",
    text: "Your instrument is organized so nothing material is skipped in later steps.",
    step: "01",
  },
  {
    icon: Search,
    title: "Research & sources",
    text: "Relevant clauses and definitions are gathered and tied back to the file.",
    step: "02",
  },
  {
    icon: Gavel,
    title: "Drafting the view",
    text: "A plain-language answer is drafted with explicit references to the text.",
    step: "03",
  },
  {
    icon: ShieldCheck,
    title: "Quality check",
    text: "Outputs are checked against the sources so you know what still needs lawyer eyes.",
    step: "04",
  },
] as const;

export function ProcessSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-t border-slate-200 bg-white py-14 sm:py-16 md:py-20"
      id="process"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <SectionReveal className="text-center">
          <h2 className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <span className="h-px w-6 bg-slate-300 sm:w-10" aria-hidden />
            How it works
            <span className="h-px w-6 bg-slate-300 sm:w-10" aria-hidden />
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-snug text-[#0c0f14] sm:text-[1.65rem] md:text-3xl">
            Built like a serious workflow — not a casual chat window.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
            Suited to law firms, in-house teams, and international desks reviewing
            agreements, MOUs, and treaty-related materials. On the demo, scroll to
            the desk and choose an example prompt if you prefer not to type.
          </p>
        </SectionReveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map(({ icon: Icon, title, text, step }, i) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-32px" }}
              transition={{
                duration: reduce ? 0 : 0.45,
                delay: reduce ? 0 : i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-[#fafbfc] p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-200/80 hover:shadow-md sm:p-7 md:rounded-3xl md:p-8">
                <span className="absolute right-4 top-4 font-mono text-[10px] font-semibold tabular-nums text-slate-300">
                  {step}
                </span>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0c0f14] shadow-sm ring-1 ring-slate-100 transition duration-300 group-hover:scale-105 group-hover:shadow-md">
                  <Icon className="h-7 w-7" strokeWidth={1.25} />
                </div>
                <h3 className="mt-5 font-semibold text-[#0c0f14]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
