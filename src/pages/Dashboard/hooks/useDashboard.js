/** Page-wide state of the dashboard: whether the viewer is a super admin (who may filter each card by organization), the organizations to filter by, and the chosen month range for the monthly charts. */
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ROLES } from "@constants/roles";
import { useOrganizationsQuery } from "@services/accountsApi";
import { lastPersianMonths } from "@utils/jalali";
import { DEFAULT_MONTH_RANGE } from "../constants";

export default function useDashboard() {
  const currentUser = useOutletContext();
  const isSuperAdmin = currentUser.role === ROLES.superAdmin;
  const [monthRange, setMonthRange] = useState(DEFAULT_MONTH_RANGE);
  const { data: organizations = [] } = useOrganizationsQuery(undefined, { skip: !isSuperAdmin });
  const months = useMemo(() => lastPersianMonths(monthRange), [monthRange]);

  return {
    isSuperAdmin,
    filterOrganizations: isSuperAdmin ? organizations : null,
    monthRange,
    setMonthRange,
    months,
  };
}
