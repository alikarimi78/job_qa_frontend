/** Rows for the "organization-only jobs per organization" chart, from the unfiltered (global) stats. */
import { useStatsQuery } from "@services/statsApi";
import { organizationJobRows } from "../utils/dashboardData";

export default function useOrganizationJobRows() {
  const { data: stats } = useStatsQuery(undefined);
  return organizationJobRows(stats);
}
