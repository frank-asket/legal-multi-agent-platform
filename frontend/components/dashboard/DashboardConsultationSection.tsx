"use client";

import { ContactCard } from "@/components/ContactCard";
import { InquiryConsole } from "@/components/InquiryConsole";
import { QuickStartStrip } from "@/components/QuickStartStrip";
import { PdfReviewPlaceholder } from "./PdfReviewPlaceholder";
import { useDashboardShell } from "./DashboardShellContext";

export function DashboardConsultationSection() {
  const { reviewMode } = useDashboardShell();

  return (
    <section
      className="mx-auto max-w-[1600px] border-t border-slate-200/80 bg-white px-4 py-14 sm:px-5 md:px-8"
      id="consultation"
      aria-label="Multi-agent consultation"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Agent console
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0c0f14]">
          Collaborative legal intelligence
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Run objectives against your documents: librarian, researcher, counsel, and auditor agents with interactive
          verification.
        </p>
      </div>
      <QuickStartStrip />
      {reviewMode ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <InquiryConsole />
          <PdfReviewPlaceholder />
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 lg:items-start">
          <div className="order-2 lg:order-none">
            <ContactCard />
          </div>
          <div className="order-1 lg:order-none">
            <InquiryConsole />
          </div>
        </div>
      )}
      {reviewMode ? (
        <p className="mt-6 text-center text-[11px] text-slate-500">
          Review mode: analyst chat and PDF preview side by side. Upload pipelines and PDF.js wiring unlock clause-level
          highlights from citations.
        </p>
      ) : null}
    </section>
  );
}
