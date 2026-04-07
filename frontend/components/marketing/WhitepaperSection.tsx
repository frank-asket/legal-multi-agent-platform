import Link from "next/link";
import { FileText } from "lucide-react";
import { apiDocsUrl } from "@/lib/api";

export function WhitepaperSection() {
  return (
    <section className="border-t border-slate-200 bg-white py-14 sm:py-16" id="whitepaper">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-[#fafbfc] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0c0f14] shadow-sm">
              <FileText className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#0c0f14]">Product &amp; architecture overview</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Share a one-pager with security and procurement: how the multi-agent desk ingests documents, runs the
                workflow, and returns cited answers. Full OpenAPI details live in the technical reference.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0">
            <a
              href={apiDocsUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-[#0c0f14] transition hover:border-slate-400"
            >
              Open API reference
            </a>
            <Link
              href="/sign-up"
              className="text-center text-xs font-medium text-slate-500 underline-offset-4 hover:text-[#0c0f14] hover:underline"
            >
              Request PDF overview from sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
