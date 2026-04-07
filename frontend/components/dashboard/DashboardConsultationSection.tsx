"use client";

import { LegalDeskZyraHub } from "@/components/legal-desk/LegalDeskZyraHub";
import { useDashboardShell } from "./DashboardShellContext";

export function DashboardConsultationSection() {
  const { reviewMode } = useDashboardShell();

  return <LegalDeskZyraHub reviewMode={reviewMode} />;
}
