/** "Overview" card: organizations (global view only), accounts, jobs in the database and suggestions waiting for review. */
import {
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  LayoutGridIcon,
  UsersIcon,
} from "@components/icons";
import { ACCENT_THEMES, PRIMARY_THEME } from "@constants/accentThemes";
import { faNumber } from "@utils/numbers";
import { showsOrganizationCount } from "../../utils/dashboardData";
import StatTile from "../charts/StatTile";
import StatsCard from "../StatsCard";
import StatTileGrid from "../StatTileGrid";
import { cardHeading } from "../cardHeading";

const blockedAccountsHint = (stats) =>
  stats.accounts_blocked > 0 ? `${faNumber(stats.accounts_blocked)} کاربر مسدود` : "همه فعال";

export default function OverviewSection({ organizations, isSuperAdmin }) {
  return (
    <StatsCard
      title="نمای کلی"
      organizations={organizations}
      {...cardHeading(PRIMARY_THEME, LayoutGridIcon)}
    >
      {(stats) => (
        <StatTileGrid>
          {showsOrganizationCount(stats) && (
            <StatTile
              label="سازمان‌ها"
              value={stats.organizations}
              icon={BuildingIcon}
              theme={ACCENT_THEMES.sky}
            />
          )}
          <StatTile
            label="کاربران"
            value={stats.accounts}
            icon={UsersIcon}
            theme={ACCENT_THEMES.violet}
            hint={blockedAccountsHint(stats)}
          />
          <StatTile
            label="مشاغل پایگاه داده"
            value={stats.jobs.corpus_records}
            icon={BriefcaseIcon}
            theme={ACCENT_THEMES.emerald}
            hint="رکوردهای تاییدشده‌ای که تحلیل بر اساس آن‌ها انجام می‌شود"
          />
          <StatTile
            label="در انتظار بررسی"
            value={stats.jobs.pending}
            icon={ClockIcon}
            tone={stats.jobs.pending > 0 ? "warning" : "muted"}
            hint={isSuperAdmin ? "صف بررسی شما" : "از کاربران زیرمجموعه شما"}
          />
        </StatTileGrid>
      )}
    </StatsCard>
  );
}
