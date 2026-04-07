"use client";

import { InsightsPanel } from "./InsightsPanel";
import { WorkspaceDashboard } from "./WorkspaceDashboard";

/** Command-center workspace + contextual insights rail (screenshot-style layout). */
export function DashboardOverview() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-2 sm:px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:items-start">
      <WorkspaceDashboard />
      <InsightsPanel variant="dark" />
    </div>
  );
}
