import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Loader from "@components/ui/Loader";
import Select from "@components/ui/Select";
import PageToolbar from "@components/ui/PageToolbar";
import CategoryBars from "@components/charts/CategoryBars";
import MonthlyBars from "@components/charts/MonthlyBars";
import { Meter, StatTile } from "@components/charts/StatTile";
import { HUES } from "@components/charts/theme";
import { IconBadge, THEMES } from "@components/fieldVisuals";
import { icon } from "@components/ui/icon";
import { ROLE_LABELS } from "@routes/roles";
import { useOrganizationsQuery } from "@services/accountsApi";
import { useStatsQuery } from "@services/statsApi";
import { bucketByMonth, faNumber, lastPersianMonths } from "@utils/jalali";
import { errorMessage } from "@utils/errors";

const BRAND = {
  badge: "from-blue-600 to-indigo-600 shadow-indigo-600/25",
  header: "from-blue-50",
};

const Glyphs = {
  overview: icon(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  growth: icon(
    <>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </>
  ),
  users: icon(
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  userCheck: icon(
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 11l2 2 4-4" />
    </>
  ),
  building: icon(
    <>
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
      <path d="M19 21V11a2 2 0 00-2-2h-2" />
      <path d="M9 7h2M9 11h2M9 15h2" />
    </>
  ),
  briefcase: icon(
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
    </>
  ),
  database: icon(
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  clock: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </>
  ),
  cross: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>
  ),
  globe: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>
  ),
  idea: icon(
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </>
  ),
};

const TILE_GRID = {
  3: "grid-cols-1 @min-[36.75rem]:grid-cols-3",
  4: "grid-cols-1 @min-[24.25rem]:grid-cols-2 @min-[49.25rem]:grid-cols-4",
  5: "grid-cols-1 @min-[24.25rem]:grid-cols-2 @min-[36.75rem]:grid-cols-3 @min-[61.75rem]:grid-cols-5",
};

const Tiles = ({ children, className = "" }) => {
  const count = [children].flat().filter(Boolean).length;
  return (
    <div className={`@container ${className}`}>
      <div className={`grid gap-3 ${TILE_GRID[count] ?? TILE_GRID[4]}`}>{children}</div>
    </div>
  );
};

const heading = (theme, glyph) => ({
  icon: <IconBadge theme={theme} glyph={glyph} size="panel" />,
  tint: theme.header,
});

function StatsCard({ orgs, actions, children, ...card }) {
  const [org, setOrg] = useState("");
  const { data: stats, error, isFetching } = useStatsQuery(org ? Number(org) : undefined);
  const select = orgs && (
    <Select value={org} onChange={(event) => setOrg(event.target.value)} className="min-w-44">
      <option value="">همه سازمان‌ها</option>
      {orgs.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );

  return (
    <Card {...card} actions={(actions || select) && <>{actions}{select}</>}>
      {error ? (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage(error)}
        </div>
      ) : !stats ? (
        <Loader />
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
          {children(stats)}
        </div>
      )}
    </Card>
  );
}

function GrowthChart({ stats, months }) {
  const series = useMemo(() => {
    const all = [
      { key: "accounts", label: "کاربران جدید", series: stats.accounts_series, hue: HUES.violet },
      { key: "organizations", label: "سازمان‌های جدید", series: stats.organizations_series, hue: HUES.sky },
    ];
    const shown = stats.scope === "global" ? all : all.slice(0, 1);
    return shown.map(({ series, ...item }) => ({ ...item, values: bucketByMonth(series, months) }));
  }, [stats, months]);
  return <MonthlyBars months={months} series={series} />;
}

function SuggestionsChart({ stats, months }) {
  const series = useMemo(
    () => [{
      key: "suggestions",
      label: "پیشنهادهای شغلی",
      hue: HUES.emerald,
      values: bucketByMonth(stats.suggestions_series, months),
    }],
    [stats, months]
  );
  return <MonthlyBars months={months} series={series} height={220} />;
}

function OrganizationJobs() {
  const { data: stats } = useStatsQuery(undefined);
  const rows = (stats?.jobs_by_organization ?? []).map((row) => ({ name: row.name, value: row.count }));
  if (!rows.length) return null;
  return (
    <Card
      title="مشاغل اختصاصی به تفکیک سازمان"
      hint="رکوردهای تاییدشده‌ای که تنها در نتایج تحلیل همان سازمان دیده می‌شوند"
      {...heading(THEMES.sky, Glyphs.building)}
    >
      <CategoryBars rows={rows} valueLabel="شغل" hue={HUES.sky} />
    </Card>
  );
}

const roleRows = (stats, isSuper) => {
  const countable = !isSuper ? ["user"] : stats.scope === "global" ? ["super_admin", "org_admin", "user"] : ["org_admin", "user"];
  return stats.accounts_by_role
    .filter((row) => countable.includes(row.role))
    .map((row) => ({ name: ROLE_LABELS[row.role] ?? row.role, value: row.count }));
};

export default function Dashboard() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [range, setRange] = useState(12);
  const { data: orgs = [] } = useOrganizationsQuery(undefined, { skip: !isSuper });
  const months = useMemo(() => lastPersianMonths(range), [range]);
  const filter = isSuper ? orgs : null;

  return (
    <>
      <PageToolbar title="پیشخوان مدیریت" />

      <StatsCard title="نمای کلی" orgs={filter} {...heading(BRAND, Glyphs.overview)}>
        {(stats) => (
          <Tiles>
            {stats.scope === "global" && (
              <StatTile
                label="سازمان‌ها"
                value={stats.organizations}
                glyph={Glyphs.building}
                theme={THEMES.sky}
              />
            )}
            <StatTile
              label="کاربران"
              value={stats.accounts}
              glyph={Glyphs.users}
              theme={THEMES.violet}
              hint={
                stats.accounts_blocked > 0
                  ? `${faNumber(stats.accounts_blocked)} کاربر مسدود`
                  : "همه فعال"
              }
            />
            <StatTile
              label="مشاغل پایگاه داده"
              value={stats.jobs.corpus_records}
              glyph={Glyphs.briefcase}
              theme={THEMES.emerald}
              hint="رکوردهای تاییدشده‌ای که تحلیل بر اساس آن‌ها انجام می‌شود"
            />
            <StatTile
              label="در انتظار بررسی"
              value={stats.jobs.pending}
              glyph={Glyphs.clock}
              tone={stats.jobs.pending > 0 ? "warning" : "muted"}
              hint={isSuper ? "صف بررسی شما" : "از کاربران زیرمجموعه شما"}
            />
          </Tiles>
        )}
      </StatsCard>

      <StatsCard
        title="رشد ماهانه"
        hint="تعداد رکوردهای جدید در هر ماه"
        orgs={filter}
        {...heading(BRAND, Glyphs.growth)}
        actions={[6, 12].map((count) => (
          <Button
            key={count}
            variant={range === count ? "primary" : "outline"}
            size="sm"
            buttonProps={{ onClick: () => setRange(count) }}
          >
            {faNumber(count)} ماه
          </Button>
        ))}
      >
        {(stats) => <GrowthChart stats={stats} months={months} />}
      </StatsCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StatsCard title="کاربران به تفکیک نقش" orgs={filter} {...heading(THEMES.violet, Glyphs.users)}>
          {(stats) => <CategoryBars rows={roleRows(stats, isSuper)} valueLabel="کاربر" hue={HUES.violet} />}
        </StatsCard>

        <StatsCard title="وضعیت کاربران" orgs={filter} {...heading(THEMES.violet, Glyphs.userCheck)}>
          {(stats) => (
            <CategoryBars
              rows={[
                { name: "فعال", value: stats.accounts_active, hue: HUES.emerald },
                { name: "مسدود", value: stats.accounts_blocked, hue: HUES.rose },
              ]}
              valueLabel="کاربر"
            />
          )}
        </StatsCard>
      </div>

      <StatsCard
        title="پایگاه داده مشاغل"
        hint="پیشنهادهای زیر متعلق به دامنه شماست؛ مشاغل عمومی میان تمامی سازمان‌ها مشترک است و مشاغل اختصاصی تنها در نتایج تحلیل سازمان خودشان دیده می‌شود"
        orgs={filter}
        {...heading(THEMES.emerald, Glyphs.database)}
      >
        {(stats) => (
          <>
            <Tiles className="mb-6">
              <StatTile
                label="تایید شده"
                value={stats.jobs.approved}
                glyph={Glyphs.check}
                theme={THEMES.emerald}
              />
              <StatTile label="در انتظار" value={stats.jobs.pending} tone="warning" glyph={Glyphs.clock} />
              <StatTile label="رد شده" value={stats.jobs.rejected} tone="muted" glyph={Glyphs.cross} />
              <StatTile
                label="مشاغل عمومی"
                value={stats.jobs.public_records}
                glyph={Glyphs.globe}
                theme={THEMES.emerald}
                hint="در دسترس تمامی سازمان‌ها"
              />
              <StatTile
                label="مشاغل اختصاصی"
                value={stats.jobs.organization_records}
                glyph={Glyphs.building}
                theme={THEMES.sky}
                hint={
                  stats.scope === "global"
                    ? "مجموع همه سازمان‌ها"
                    : isSuper
                      ? `ویژه ${stats.scope_name}`
                      : "ویژه سازمان شما"
                }
              />
            </Tiles>

            {stats.jobs.engine_records == null ? (
              <p className="text-sm text-slate-500 leading-7">
                موتور تحلیل هنوز بارگذاری نشده است، بنابراین تعداد رکوردهای آموزش‌دیده در دسترس نیست.
              </p>
            ) : (
              <Meter
                label="رکوردهای واردشده در موتور تحلیل"
                value={stats.jobs.engine_records}
                total={stats.jobs.corpus_records}
                hue={HUES.emerald}
                note="موتور تحلیل با تمامی رکوردهای تاییدشده ساخته شده است."
              />
            )}
          </>
        )}
      </StatsCard>

      <OrganizationJobs />

      <StatsCard
        title="پیشنهادهای شغلی در هر ماه"
        hint="بر پایه تاریخ ثبت پیشنهاد"
        orgs={filter}
        {...heading(THEMES.emerald, Glyphs.idea)}
      >
        {(stats) => <SuggestionsChart stats={stats} months={months} />}
      </StatsCard>
    </>
  );
}
