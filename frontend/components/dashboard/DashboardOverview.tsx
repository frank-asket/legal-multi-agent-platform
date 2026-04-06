import { DashboardMetrics } from "./DashboardMetrics";

/**
 * Dashboard home content: live API status, local run history, pipeline summary.
 * (Former placeholder case/task/transaction widgets removed in favor of PRD-aligned signals.)
 */
export function DashboardOverview() {
  return <DashboardMetrics />;
}
