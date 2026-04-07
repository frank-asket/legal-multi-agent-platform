import { Quote } from "lucide-react";

const ITEMS = [
  {
    quote:
      "We stopped exporting screenshots from five different tools. One desk pass with citations gets associates aligned before partner review.",
    name: "General Counsel",
    role: "Global manufacturing · pilot org",
  },
  {
    quote:
      "The workflow feels like a serious diligence lane — not a toy chatbot. IR colleagues can read the summary and still verify against sources.",
    name: "Head of Treaty Desk",
    role: "Regional ministry · evaluation",
  },
  {
    quote:
      "Faithfulness hints and flags are surprisingly practical. They tell us where the model is confident vs where we still need local counsel.",
    name: "Legal Ops Lead",
    role: "Financial services · design partner",
  },
] as const;

export function Testimonials() {
  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <h2 className="text-center text-2xl font-semibold text-[#0c0f14] sm:text-3xl md:text-4xl">
          Trusted by teams that care about the footnotes
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
          Illustrative testimonials for the marketing narrative — replace with approved client quotes when you publish.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-[#fafbfc] p-6 shadow-sm sm:p-7"
            >
              <Quote className="h-8 w-8 text-[#0c0f14]/20" aria-hidden />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 flex items-center gap-3 border-t border-slate-200/80 pt-5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0c0f14] text-xs font-bold text-white"
                  aria-hidden
                >
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <div>
                  <cite className="not-italic text-sm font-semibold text-[#0c0f14]">{t.name}</cite>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
