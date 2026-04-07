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

export function AgentProgressRail() {
  const reduce = useReducedMotion();
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
      className="overflow-hidden rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-3 py-2.5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline">
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
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                ) : null}
                <span
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-[11px] ${
                    active
                      ? "bg-[#0c0f14] text-white shadow-md ring-2 ring-[#0c0f14]/20"
                      : past
                        ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80"
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
        <p className="mt-1 truncate text-[11px] text-slate-600" title={caption}>
          {caption}
        </p>
      ) : (
        <p className="mt-1 text-[11px] text-slate-400">
          Idle — run the legal desk with step-by-step to watch Intake → Research → Drafting → Quality check.
        </p>
      )}
    </div>
  );
}
