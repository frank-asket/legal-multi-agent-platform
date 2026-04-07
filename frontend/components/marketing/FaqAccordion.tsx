"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is this legal advice?",
    a: "No. Outputs are informational drafting aids grounded in documents you connect. Regulated or high-stakes matters should involve qualified counsel in your jurisdiction.",
  },
  {
    q: "How do citations work?",
    a: "When your vault is wired in, the desk returns spans that reference document and page context so readers can jump back to the exact clause. Demo mode uses a bundled sample file.",
  },
  {
    q: "Can we self-host the API?",
    a: "The FastAPI service is designed for container deployment. Your IT team controls networking, keys, and retention on private infrastructure.",
  },
  {
    q: "What about data residency?",
    a: "Residency follows where you deploy the backend and connect storage. Professional tier is intended for custom contracts and security questionnaires.",
  },
  {
    q: "Do you train on our uploads?",
    a: "Default architecture targets inference against your registered documents without using your matter text to train public models. Confirm wording with your security review.",
  },
] as const;

export function FaqAccordion() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-slate-200 bg-[#fafbfc] py-16 sm:py-20" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-5 md:px-6">
        <h2 className="text-center text-2xl font-semibold text-[#0c0f14] sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-slate-600">
          Straight answers for legal ops and security reviewers evaluating a document-grounded assistant.
        </p>
        <div className="mt-10 space-y-2">
          {FAQS.map((item, i) => {
            const id = `${baseId}-faq-${i}`;
            const expanded = open === i;
            return (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  id={`${id}-btn`}
                  aria-expanded={expanded}
                  aria-controls={`${id}-panel`}
                  onClick={() => setOpen((v) => (v === i ? null : i))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#0c0f14] transition hover:bg-slate-50/80 sm:text-base"
                >
                  {item.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition ${expanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <div
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={`${id}-btn`}
                    className="border-t border-slate-100 px-5 pb-4 pt-0"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
