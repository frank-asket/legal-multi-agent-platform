"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
};

export function TagPill({ children, active, onClick, title }: Props) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c0f14]/30 focus-visible:ring-offset-2",
        "active:scale-[0.97]",
        active
          ? "bg-[#0c0f14] text-white shadow-md shadow-slate-900/15"
          : "border border-slate-200 bg-white text-[#0c0f14] hover:border-slate-400 hover:shadow-sm",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
