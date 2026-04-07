import { Database, LineChart, ListChecks, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    title: "Grounded matter intake",
    description:
      "Register instruments once, then ask in plain language. Answers quote the file so counsel can scan risks without rereading everything.",
    icon: Database,
    graphic: "table" as const,
  },
  {
    title: "Monitoring & analytics",
    description:
      "Track runs, faithfulness signals, and clause flags over time — useful for audit trails and repeat playbooks across a portfolio.",
    icon: LineChart,
    graphic: "chart" as const,
  },
  {
    title: "Clause intelligence",
    description:
      "Structured checklists surface obligations, carve-outs, and cross-references so negotiation and compliance stay aligned with the text.",
    icon: ListChecks,
    graphic: "checklist" as const,
  },
  {
    title: "Collaborative desk",
    description:
      "Share threads, preserve session references, and pair AI-assisted drafting with lawyer review — without mixing casual chat and matter work.",
    icon: MessageSquare,
    graphic: "chat" as const,
  },
] as const;

function MiniGraphic({ kind }: { kind: (typeof FEATURES)[number]["graphic"] }) {
  if (kind === "table") {
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="h-2 w-1/2 rounded bg-slate-200" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded border border-slate-200 bg-white" />
          <div className="h-8 rounded border border-slate-200 bg-white" />
          <div className="h-8 rounded border border-slate-200 bg-white" />
        </div>
        <div className="h-2 w-3/4 rounded bg-slate-100" />
      </div>
    );
  }
  if (kind === "chart") {
    return (
      <div className="flex h-[120px] items-end justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 pb-4 pt-6">
        <div className="h-8 w-6 rounded-t bg-[#0c0f14]/25" />
        <div className="h-14 w-6 rounded-t bg-[#0c0f14]/45" />
        <div className="h-11 w-6 rounded-t bg-[#0c0f14]/35" />
        <div className="h-20 w-6 rounded-t bg-[#0c0f14]/70" />
        <div className="h-6 w-6 rounded-t bg-[#0c0f14]/20" />
      </div>
    );
  }
  if (kind === "checklist") {
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border-2 border-[#0c0f14]/40" />
            <div className="h-2 flex-1 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="ml-8 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">
        User prompt
      </div>
      <div className="rounded-lg border border-slate-200 bg-[#0c0f14] px-3 py-2 text-[10px] text-white/90">
        Desk — cited answer
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20" id="features">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold leading-tight text-[#0c0f14] sm:text-4xl">
            Get serious review work done in one surface
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            The platform combines retrieval, multi-stage reasoning, and presentation patterns tuned for legal readers —
            not generic consumer chat.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {FEATURES.map(({ title, description, icon: Icon, graphic }) => (
            <article
              key={title}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#fafbfc] shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="border-b border-slate-200/80 bg-white/80 p-5">
                <MiniGraphic kind={graphic} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0c0f14] shadow-sm">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#0c0f14]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
