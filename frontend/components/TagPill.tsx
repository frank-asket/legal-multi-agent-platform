"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  /** Dark workspace with white-on-black accents */
  variant?: "default" | "zyra";
};

export function TagPill({ children, active, onClick, title, variant = "default" }: Props) {
  const z = variant === "zyra";
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
        z
          ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c0f14]/30 focus-visible:ring-offset-2",
        "active:scale-[0.97]",
        z
          ? active
            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            : "border border-zinc-600 bg-zinc-800/80 text-zinc-200 hover:border-white/35 hover:text-white"
          : active
            ? "bg-[#0c0f14] text-white shadow-md shadow-slate-900/15"
            : "border border-slate-200 bg-white text-[#0c0f14] hover:border-slate-400 hover:shadow-sm",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
