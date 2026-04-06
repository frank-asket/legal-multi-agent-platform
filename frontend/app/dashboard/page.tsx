import { ContactCard } from "@/components/ContactCard";
import { Footer } from "@/components/Footer";
import { InquiryConsole } from "@/components/InquiryConsole";
import { Navbar } from "@/components/Navbar";
import { QuickStartStrip } from "@/components/QuickStartStrip";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0f14] sm:text-4xl">
              Legal operations dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-slate-600">
              Run the collaborative multi-agent loop: define objectives, upload documents,
              and review grounded analysis from researcher, counsel, and auditor agents—with
              citations you can verify interactively.
            </p>
          </div>
        </div>

        <section
          className="relative bg-white py-14 sm:py-16 md:py-24"
          id="consultation"
          aria-label="Multi-agent consultation"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/80 to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
            <QuickStartStrip />
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 lg:items-start">
              <div className="order-2 lg:order-none">
                <ContactCard />
              </div>
              <div className="order-1 lg:order-none">
                <InquiryConsole />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
