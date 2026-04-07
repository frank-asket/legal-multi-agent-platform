"use client";

import { FileText, Highlighter } from "lucide-react";

/**
 * Placeholder for split-pane review: wire PDF.js or signed URLs when storage is available.
 * Heat-map legend matches future clause-highlight overlays from cited_spans.
 */
export function PdfReviewPlaceholder({ variant = "default" }: { variant?: "default" | "zyra" } = {}) {
  const zyra = variant === "zyra";
  return (
    <div
      className={
        zyra
          ? "flex h-full min-h-[320px] flex-col rounded-2xl border border-zinc-700 bg-zinc-900/95 shadow-[0_0_40px_rgba(255,255,255,0.05)] ring-1 ring-zinc-700/50"
          : "flex h-full min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100/80"
      }
      aria-label="Document preview (placeholder)"
    >
      <div
        className={
          zyra
            ? "flex items-center justify-between border-b border-zinc-700 px-4 py-3"
            : "flex items-center justify-between border-b border-slate-100 px-4 py-3"
        }
      >
        <span
          className={
            zyra
              ? "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-300"
              : "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
          }
        >
          <FileText className={zyra ? "h-4 w-4 text-white" : "h-4 w-4 text-slate-400"} aria-hidden />
          Source PDF
        </span>
        <span
          className={
            zyra
              ? "inline-flex items-center gap-1 rounded-full border border-white/35 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white"
              : "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900 ring-1 ring-amber-200"
          }
        >
          <Highlighter className="h-3 w-3" aria-hidden />
          Heat-map (demo)
        </span>
      </div>
      <div
        className={
          zyra
            ? "relative flex-1 overflow-hidden bg-gradient-to-b from-zinc-950 to-black p-4"
            : "relative flex-1 overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/40 p-4"
        }
      >
        <div
          className={
            zyra
              ? "mx-auto max-w-sm space-y-3 rounded-lg border border-zinc-700 bg-zinc-900/90 p-4 shadow-inner"
              : "mx-auto max-w-sm space-y-3 rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-inner"
          }
        >
          <div className={zyra ? "h-2 w-3/4 rounded bg-zinc-700" : "h-2 w-3/4 rounded bg-slate-200"} />
          <div className={zyra ? "h-2 w-full rounded bg-zinc-800" : "h-2 w-full rounded bg-slate-100"} />
          <div className={zyra ? "h-2 w-5/6 rounded bg-zinc-800" : "h-2 w-5/6 rounded bg-slate-100"} />
          <div
            className={
              zyra
                ? "h-2 w-full rounded bg-white/35 ring-1 ring-white/50"
                : "h-2 w-full rounded bg-amber-200/90 ring-1 ring-amber-400/50"
            }
            title="Cited clause"
          />
          <div className={zyra ? "h-2 w-2/3 rounded bg-zinc-800" : "h-2 w-2/3 rounded bg-slate-100"} />
          <div
            className={
              zyra
                ? "h-2 w-full rounded bg-zinc-600/80 ring-1 ring-white/35"
                : "h-2 w-full rounded bg-red-200/80 ring-1 ring-red-300/60"
            }
            title="Flagged risk"
          />
          <div className={zyra ? "h-2 w-4/5 rounded bg-zinc-800" : "h-2 w-4/5 rounded bg-slate-100"} />
          <p className={zyra ? "pt-2 text-[11px] leading-relaxed text-zinc-500" : "pt-2 text-[11px] leading-relaxed text-slate-500"}>
            When your matter vault is linked, the signed PDF appears here with highlights that jump from the answer to
            the exact clause. Until then, use the citations listed beside your summary.
          </p>
        </div>
      </div>
    </div>
  );
}
