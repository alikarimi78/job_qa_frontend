/** Two side-by-side cards about accounts: how many hold each role, and how many are active or blocked. */
import { UserCheckIcon, UsersIcon } from "@components/icons";
import { ACCENT_THEMES } from "@constants/accentThemes";
import { accountStatusRows, accountsByRoleRows } from "../../utils/dashboardData";
import CategoryBars from "../charts/CategoryBars";
import { CHART_COLORS } from "../charts/chartTheme";
import StatsCard from "../StatsCard";
import { cardHeading } from "../cardHeading";

export default function AccountsSection({ organizations, isSuperAdmin }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <StatsCard
        title="کاربران به تفکیک نقش"
        organizations={organizations}
        {...cardHeading(ACCENT_THEMES.violet, UsersIcon)}
      >
        {(stats) => (
          <CategoryBars
            rows={accountsByRoleRows(stats, isSuperAdmin)}
            valueLabel="کاربر"
            color={CHART_COLORS.violet}
          />
        )}
      </StatsCard>

      <StatsCard
        title="وضعیت کاربران"
        organizations={organizations}
        {...cardHeading(ACCENT_THEMES.violet, UserCheckIcon)}
      >
        {(stats) => <CategoryBars rows={accountStatusRows(stats)} valueLabel="کاربر" />}
      </StatsCard>
    </div>
  );
}
