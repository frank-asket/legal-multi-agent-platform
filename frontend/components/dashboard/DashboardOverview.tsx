"use client";

import { DiscoveryHub } from "./DiscoveryHub";
import { InsightsPanel } from "./InsightsPanel";

/** Center-gravity hub: wide discovery column + contextual insights rail. */
export function DashboardOverview() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-2 sm:px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
      <DiscoveryHub />
      <InsightsPanel />
    </div>
  );
}
