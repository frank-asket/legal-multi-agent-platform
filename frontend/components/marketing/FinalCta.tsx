import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="border-t border-slate-200 bg-[#0c0f14] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-5 md:px-6">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          Start drafting and reviewing with clearer source links
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
          Open a workspace account for your team, or try the public desk on the sample agreement — no login required for the demo block.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-[#0c0f14] transition hover:bg-slate-100"
          >
            Get started
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="#consultation"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
          >
            Live demo
          </a>
        </div>
      </div>
    </section>
  );
}
