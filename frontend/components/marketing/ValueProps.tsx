import { Lock, Timer, Scale, Users } from "lucide-react";

const ITEMS = [
  {
    icon: Timer,
    title: "Speed without slog",
    text: "Parallel agents handle retrieval, drafting, and checks so you get a structured pass faster than manual first reads alone.",
  },
  {
    icon: Lock,
    title: "Designed for sensitive work",
    text: "API keys stay in the browser, sessions are referenceable, and outputs are framed as drafting aids — not substitute counsel.",
  },
  {
    icon: Scale,
    title: "Built for nuance",
    text: "Faithfulness scoring and citation spans point back to the instrument so teams know what still needs human judgment.",
  },
  {
    icon: Users,
    title: "Fits firms and IR desks",
    text: "From contract review to treaty-adjacent notes, the same desk pattern scales from single matters to portfolio monitoring.",
  },
] as const;

export function ValueProps() {
  return (
    <section className="border-t border-slate-200 bg-[#fafbfc] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-5 md:px-6">
        <h2 className="text-2xl font-semibold text-[#0c0f14] sm:text-3xl md:text-4xl">
          Why legal teams standardize on this desk
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          Opinionated workflow, source-first answers, and room for counsel to own the final word — especially on cross-border
          and high-stakes files.
        </p>
        <div className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:gap-6">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-[#fafbfc] text-[#0c0f14]">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-[#0c0f14]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
