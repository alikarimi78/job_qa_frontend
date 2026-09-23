/** Turns the stats response into what each dashboard chart draws: monthly series, rows for the bar charts, and the texts that depend on the scope being viewed. */
import { ROLES, roleLabel } from "@constants/roles";
import { bucketByMonth } from "@utils/jalali";
import { faNumber } from "@utils/numbers";
import { CHART_COLORS } from "../components/charts/chartTheme";
import { GLOBAL_SCOPE } from "../constants";

const isGlobal = (stats) => stats.scope === GLOBAL_SCOPE;

export function growthSeries(stats, months) {
  const allSeries = [
    { key: "accounts", label: "کاربران جدید", points: stats.accounts_series, color: CHART_COLORS.violet },
    {
      key: "organizations",
      label: "سازمان‌های جدید",
      points: stats.organizations_series,
      color: CHART_COLORS.sky,
    },
  ];
  const shownSeries = isGlobal(stats) ? allSeries : allSeries.slice(0, 1);
  return shownSeries.map(({ points, ...item }) => ({ ...item, values: bucketByMonth(points, months) }));
}

export const suggestionSeries = (stats, months) => [
  {
    key: "suggestions",
    label: "پیشنهادهای شغلی",
    color: CHART_COLORS.emerald,
    values: bucketByMonth(stats.suggestions_series, months),
  },
];

function countableRoles(stats, isSuperAdmin) {
  if (!isSuperAdmin) return [ROLES.user];
  if (isGlobal(stats)) return [ROLES.superAdmin, ROLES.orgAdmin, ROLES.user];
  return [ROLES.orgAdmin, ROLES.user];
}

export function accountsByRoleRows(stats, isSuperAdmin) {
  const roles = countableRoles(stats, isSuperAdmin);
  return stats.accounts_by_role
    .filter((row) => roles.includes(row.role))
    .map((row) => ({ name: roleLabel(row.role), value: row.count }));
}

export const accountStatusRows = (stats) => [
  { name: "فعال", value: stats.accounts_active, color: CHART_COLORS.emerald },
  { name: "مسدود", value: stats.accounts_blocked, color: CHART_COLORS.rose },
];

export const organizationJobRows = (stats) =>
  (stats?.jobs_by_organization ?? []).map((row) => ({ name: row.name, value: row.count }));

export function organizationRecordsHint(stats, isSuperAdmin) {
  if (isGlobal(stats)) return "مجموع همه سازمان‌ها";
  return isSuperAdmin ? `ویژه ${stats.scope_name}` : "ویژه سازمان شما";
}

export function engineMeterNote(stats) {
  const remaining = Math.max(0, stats.jobs.corpus_records - stats.jobs.engine_records);
  if (remaining === 0) return "موتور تحلیل با تمامی رکوردهای تاییدشده ساخته شده است.";
  return `${faNumber(remaining)} رکورد تایید شده هنوز وارد موتور تحلیل نشده است؛ بازسازی پس از هر تایید به‌صورت خودکار انجام می‌شود و وضعیت آن در صفحه بررسی پیشنهادها قابل مشاهده است.`;
}

export const showsOrganizationCount = isGlobal;
