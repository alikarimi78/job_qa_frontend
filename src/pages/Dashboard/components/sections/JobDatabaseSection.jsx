/** "Job database" card: approved, pending and rejected suggestions, public and organization-only jobs, and how many approved records the analysis engine has taken in. */
import {
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  DatabaseIcon,
  GlobeIcon,
  XCircleIcon,
} from "@components/icons";
import { ACCENT_THEMES } from "@constants/accentThemes";
import { engineMeterNote, organizationRecordsHint } from "../../utils/dashboardData";
import { CHART_COLORS } from "../charts/chartTheme";
import ProgressMeter from "../charts/ProgressMeter";
import StatTile from "../charts/StatTile";
import StatsCard from "../StatsCard";
import StatTileGrid from "../StatTileGrid";
import { cardHeading } from "../cardHeading";

function EngineProgress({ stats }) {
  if (stats.jobs.engine_records == null) {
    return (
      <p className="text-sm text-slate-500 leading-7">
        موتور تحلیل هنوز بارگذاری نشده است، بنابراین تعداد رکوردهای آموزش‌دیده در دسترس نیست.
      </p>
    );
  }
  return (
    <ProgressMeter
      label="رکوردهای واردشده در موتور تحلیل"
      value={stats.jobs.engine_records}
      total={stats.jobs.corpus_records}
      color={CHART_COLORS.emerald}
      note={engineMeterNote(stats)}
    />
  );
}

export default function JobDatabaseSection({ organizations, isSuperAdmin }) {
  return (
    <StatsCard
      title="پایگاه داده مشاغل"
      hint="پیشنهادهای زیر متعلق به دامنه شماست؛ مشاغل عمومی میان تمامی سازمان‌ها مشترک است و مشاغل اختصاصی تنها در نتایج تحلیل سازمان خودشان دیده می‌شود"
      organizations={organizations}
      {...cardHeading(ACCENT_THEMES.emerald, DatabaseIcon)}
    >
      {(stats) => (
        <>
          <StatTileGrid className="mb-6">
            <StatTile
              label="تایید شده"
              value={stats.jobs.approved}
              icon={CheckCircleIcon}
              theme={ACCENT_THEMES.emerald}
            />
            <StatTile label="در انتظار" value={stats.jobs.pending} tone="warning" icon={ClockIcon} />
            <StatTile label="رد شده" value={stats.jobs.rejected} tone="muted" icon={XCircleIcon} />
            <StatTile
              label="مشاغل عمومی"
              value={stats.jobs.public_records}
              icon={GlobeIcon}
              theme={ACCENT_THEMES.emerald}
              hint="در دسترس تمامی سازمان‌ها"
            />
            <StatTile
              label="مشاغل اختصاصی"
              value={stats.jobs.organization_records}
              icon={BuildingIcon}
              theme={ACCENT_THEMES.sky}
              hint={organizationRecordsHint(stats, isSuperAdmin)}
            />
          </StatTileGrid>

          <EngineProgress stats={stats} />
        </>
      )}
    </StatsCard>
  );
}
