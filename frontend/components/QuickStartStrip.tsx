import { ArrowRight, FileText, MessageCircle, Sparkles } from "lucide-react";

const steps = [
  {
    n: "1",
    title: "Choose the task",
    text: "Contract review, definitions, liability, treaty-style wording, or a general pass — pick what fits your file.",
    icon: FileText,
  },
  {
    n: "2",
    title: "Ask clearly",
    text: "Type your question or use a suggested prompt. The demo does not require sign-up.",
    icon: MessageCircle,
  },
  {
    n: "3",
    title: "Read with sources",
    text: "Receive a concise answer with references into the text, plus an optional step-by-step view of the desk.",
    icon: Sparkles,
  },
] as const;

export function QuickStartStrip() {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6 md:rounded-3xl md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0c0f14] md:text-xl">
          Three steps — no technical setup
        </h2>
        <a
          href="#consultation-form"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0c0f14] underline decoration-slate-300 underline-offset-4 transition hover:decoration-[#0c0f14]"
        >
          Go to your question
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        The demo uses a sample agreement so you can see citations and structure
        immediately. When your organization connects its own matter files, the
        same process applies.
      </p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {steps.map(({ n, title, text, icon: Icon }) => (
          <li
            key={n}
            className="relative rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm"
          >
            <span className="absolute -top-2 left-4 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#0c0f14] px-1.5 text-[11px] font-bold text-white">
              {n}
            </span>
            <div className="mt-3 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0c0f14]">
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-[#0c0f14]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
