/** Stats for one dashboard card, with the card's own organization filter (empty means all organizations). */
import { useState } from "react";
import { useStatsQuery } from "@services/statsApi";

export default function useOrganizationStats() {
  const [organizationFilter, setOrganizationFilter] = useState("");
  const { data: stats, error, isFetching } = useStatsQuery(
    organizationFilter ? Number(organizationFilter) : undefined
  );

  return { stats, error, isFetching, organizationFilter, setOrganizationFilter };
}
