"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  { id: "librarian", label: "Intake", hint: "Structure" },
  { id: "researcher", label: "Research", hint: "Sources" },
  { id: "counsel", label: "Drafting", hint: "Answer" },
  { id: "auditor", label: "Quality", hint: "Verify" },
] as const;

type AgentStatusDetail = {
  agent?: string;
  phase?: string;
  detail?: string;
  idle?: boolean;
};

function matchStep(agent?: string): number {
  if (!agent) return -1;
  const a = agent.toLowerCase();
  if (a.includes("librarian")) return 0;
  if (a.includes("researcher")) return 1;
  if (a.includes("counsel")) return 2;
  if (a.includes("auditor")) return 3;
  return -1;
}

export function AgentProgressRail({ variant = "light" }: { variant?: "light" | "dark" } = {}) {
  const reduce = useReducedMotion();
  const dark = variant === "dark";
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [caption, setCaption] = useState<string>("");

  useEffect(() => {
    const onStatus = (ev: Event) => {
      const ce = ev as CustomEvent<AgentStatusDetail>;
      const d = ce.detail;
      if (!d) return;
      if (d.idle) {
        setActiveIdx(-1);
        setCaption("");
        return;
      }
      const idx = matchStep(d.agent);
      if (idx >= 0) setActiveIdx(idx);
      const line = [d.agent, d.phase].filter(Boolean).join(" · ");
      if (line) setCaption(line);
      if (d.detail) setCaption(`${line}${line ? " — " : ""}${d.detail}`);
    };
    window.addEventListener("legal-platform-agent-status", onStatus as EventListener);
    return () =>
      window.removeEventListener("legal-platform-agent-status", onStatus as EventListener);
  }, []);

  return (
    <div
      className={
        dark
          ? "overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5"
          : "overflow-hidden rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-3 py-2.5 shadow-sm"
      }
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span
          className={`hidden shrink-0 text-[10px] font-bold uppercase tracking-wider sm:inline ${
            dark ? "text-white/45" : "text-slate-500"
          }`}
        >
          Desk stages
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-0.5 sm:gap-1">
          {STEPS.map((step, i) => {
            const active = i === activeIdx;
            const past = activeIdx >= 0 && i < activeIdx;
            return (
              <motion.div
                key={step.id}
                layout={!reduce}
                className="flex items-center gap-0.5 sm:gap-1"
                initial={false}
              >
                {i > 0 ? (
                  <span className={dark ? "text-white/20" : "text-slate-300"} aria-hidden>
                    →
                  </span>
                ) : null}
                <span
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-[11px] ${
                    active
                      ? dark
                        ? "bg-white text-black shadow-md ring-2 ring-white/30"
                        : "bg-[#0c0f14] text-white shadow-md ring-2 ring-[#0c0f14]/20"
                      : past
                        ? dark
                          ? "bg-white/15 text-white ring-1 ring-white/25"
                          : "bg-slate-200/90 text-[#0c0f14] ring-1 ring-slate-300/80"
                        : dark
                          ? "bg-black/40 text-white/55 ring-1 ring-white/10"
                          : "bg-white text-slate-600 ring-1 ring-slate-100"
                  }`}
                >
                  {active && !reduce ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/10"
                      aria-hidden
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                  <span className="relative">{step.label}</span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      {caption ? (
        <p
          className={`mt-1 truncate text-[11px] ${dark ? "text-white/60" : "text-slate-600"}`}
          title={caption}
        >
          {caption}
        </p>
      ) : (
        <p className={`mt-1 text-[11px] ${dark ? "text-white/40" : "text-slate-400"}`}>
          Idle — run the legal desk with step-by-step to watch Intake → Research → Drafting → Quality check.
        </p>
      )}
    </div>
  );
}
