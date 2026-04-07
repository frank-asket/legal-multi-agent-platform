import Link from "next/link";

export function DashboardLegalDisclaimer() {
  return (
    <div className="mx-auto max-w-[1600px] border-t border-zinc-800 bg-black px-4 py-4 sm:px-5 md:px-8">
      <p className="text-center text-[11px] leading-relaxed text-zinc-500">
        <strong className="font-semibold text-zinc-200">AI analysis, not legal advice.</strong> Outputs support
        professional review only. For regulated or high-stakes matters, engage qualified counsel.{" "}
        <Link
          href="#consultation"
          className="font-medium text-white underline-offset-2 hover:text-zinc-300 hover:underline"
        >
          Escalate to counsel review
        </Link>
      </p>
    </div>
  );
}
