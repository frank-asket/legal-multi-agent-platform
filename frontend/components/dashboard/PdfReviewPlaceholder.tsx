"use client";

import { FileText, Highlighter } from "lucide-react";

/**
 * Placeholder for split-pane review: wire PDF.js or signed URLs when storage is available.
 * Heat-map legend matches future clause-highlight overlays from cited_spans.
 */
export function PdfReviewPlaceholder() {
  return (
    <div
      className="flex h-full min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100/80"
      aria-label="Document preview (placeholder)"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <FileText className="h-4 w-4 text-slate-400" aria-hidden />
          Source PDF
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900 ring-1 ring-amber-200">
          <Highlighter className="h-3 w-3" aria-hidden />
          Heat-map (demo)
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/40 p-4">
        <div className="mx-auto max-w-sm space-y-3 rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-inner">
          <div className="h-2 w-3/4 rounded bg-slate-200" />
          <div className="h-2 w-full rounded bg-slate-100" />
          <div className="h-2 w-5/6 rounded bg-slate-100" />
          <div className="h-2 w-full rounded bg-amber-200/90 ring-1 ring-amber-400/50" title="Cited clause" />
          <div className="h-2 w-2/3 rounded bg-slate-100" />
          <div className="h-2 w-full rounded bg-red-200/80 ring-1 ring-red-300/60" title="Flagged risk" />
          <div className="h-2 w-4/5 rounded bg-slate-100" />
          <p className="pt-2 text-[11px] leading-relaxed text-slate-500">
            Connect document storage to render the real PDF. Answers in the analyst panel already carry{" "}
            <code className="rounded bg-slate-100 px-1 text-[10px]">cited_spans</code> — the next step is
            mapping those spans to viewer coordinates for click-through citations.
          </p>
        </div>
      </div>
    </div>
  );
}
