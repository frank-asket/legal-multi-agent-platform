import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { SubscriptionSection } from "@/components/SubscriptionSection";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-[#0c0f14]"
          >
            LEGAL INTEL
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 underline-offset-4 hover:text-[#0c0f14] hover:underline"
            >
              Workspace
            </Link>
            <Link
              href="/dashboard#consultation"
              className="text-sm text-slate-600 underline-offset-4 hover:text-[#0c0f14] hover:underline"
            >
              Legal desk
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-[#0c0f14]">Your account</h1>
        <SubscriptionSection />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <UserProfile
            appearance={{
              elements: {
                formButtonPrimary: "bg-[#0c0f14] hover:bg-slate-800",
                navbarButton: "text-[#0c0f14]",
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
