import { Footer } from "@/components/Footer";
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
      <div className="min-h-screen bg-[#eef0f3]">
        <DashboardSidebar />
        <div className="lg:pl-60">
          <DashboardHeader />
          <DashboardOverview />
          <DashboardConsultationSection />
          <DashboardLegalDisclaimer />
          <Footer />
        </div>
        <DashboardChatbot />
      </div>
    </DashboardShellProvider>
  );
}
