import { DashboardChatbot } from "@/components/chat/DashboardChatbot";
import { DashboardConsultationSection } from "@/components/dashboard/DashboardConsultationSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLegalDisclaimer } from "@/components/dashboard/DashboardLegalDisclaimer";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardShellProvider } from "@/components/dashboard/DashboardShellContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardPage() {
  return (
    <DashboardShellProvider>
      <div className="min-h-screen bg-black text-white">
        <DashboardSidebar />
        <div className="lg:pl-60">
          <DashboardHeader />
          <DashboardOverview />
          <DashboardConsultationSection />
          <DashboardLegalDisclaimer />
          <footer className="border-t border-white/10 py-6 text-center text-[11px] text-white/35">
            © {new Date().getFullYear()} Legal Intel · workspace environment
          </footer>
        </div>
        <DashboardChatbot />
      </div>
    </DashboardShellProvider>
  );
}
