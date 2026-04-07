import Link from "next/link";

export function DashboardLegalDisclaimer() {
  return (
    <div className="mx-auto max-w-[1600px] border-t border-slate-200/80 bg-slate-50/80 px-4 py-4 sm:px-5 md:px-8">
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        <strong className="font-semibold text-[#0c0f14]">AI analysis, not legal advice.</strong> Outputs support
        professional review only. For regulated or high-stakes matters, engage qualified counsel.{" "}
        <Link href="#consultation" className="font-medium text-[#0c0f14] underline-offset-2 hover:underline">
          Escalate to counsel review
        </Link>
      </p>
    </div>
  );
}
