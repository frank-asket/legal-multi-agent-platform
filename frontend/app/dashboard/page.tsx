import { ContactCard } from "@/components/ContactCard";
import { Footer } from "@/components/Footer";
import { InquiryConsole } from "@/components/InquiryConsole";
import { QuickStartStrip } from "@/components/QuickStartStrip";
import { DashboardChatbot } from "@/components/chat/DashboardChatbot";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardUserMenu } from "@/components/dashboard/DashboardUserMenu";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#eef0f3]">
      <DashboardSidebar />
      <DashboardUserMenu />
      <div className="lg:pl-60">
        <DashboardOverview />

        <section
          className="mx-auto max-w-[1400px] border-t border-slate-200/80 bg-white px-4 py-14 sm:px-5 md:px-8"
          id="consultation"
          aria-label="Multi-agent consultation"
        >
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Agent console
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0c0f14]">
              Collaborative legal intelligence
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Run objectives against your documents: librarian, researcher, counsel, and auditor agents with interactive verification.
            </p>
          </div>
          <QuickStartStrip />
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 lg:items-start">
            <div className="order-2 lg:order-none">
              <ContactCard />
            </div>
            <div className="order-1 lg:order-none">
              <InquiryConsole />
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <DashboardChatbot />
    </div>
  );
}
