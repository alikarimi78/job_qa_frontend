import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Loader from "@components/ui/Loader";
import PageToolbar from "@components/ui/PageToolbar";
import CategoryBars from "@components/charts/CategoryBars";
import MonthlyBars from "@components/charts/MonthlyBars";
import { Meter, StatTile } from "@components/charts/StatTile";
import { ROLE_LABELS } from "@routes/roles";
import { useStatsQuery } from "@services/statsApi";
import { bucketByMonth, faNumber, lastPersianMonths } from "@utils/jalali";
import { errorMessage } from "@utils/errors";

// The dashboard reads one endpoint. `/stats` is scoped by the server exactly as
// `/accounts` is, so nothing on this page filters by role for privacy — the role only
// decides which of these panels is worth showing at all. A unit_admin has one unit and
// no organizations, so the two panels about them are simply absent rather than drawn
// as a chart of one bar.
export default function Dashboard() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";
  const isUnitAdmin = me.role === "unit_admin";

  const [range, setRange] = useState(12);
  const { data: stats, isLoading, error } = useStatsQuery();

  const months = useMemo(() => lastPersianMonths(range), [range]);

  const growth = useMemo(() => {
    if (!stats) return [];
    // Fixed order, so a series keeps its colour whichever of them this role sees.
    const all = [
      { key: "accounts", label: "حساب‌های جدید", series: stats.accounts_series },
      { key: "units", label: "واحدهای جدید", series: stats.units_series },
      { key: "organizations", label: "سازمان‌های جدید", series: stats.organizations_series },
    ];
    const shown = isUnitAdmin ? all.slice(0, 1) : isSuper ? all : all.slice(0, 2);
    return shown.map((item) => ({
      key: item.key,
      label: item.label,
      values: bucketByMonth(item.series, months),
    }));
  }, [stats, months, isSuper, isUnitAdmin]);

  const suggestions = useMemo(() => {
    if (!stats) return [];
    return [
      {
        key: "suggestions",
        label: "پیشنهادهای شغلی",
        values: bucketByMonth(stats.suggestions_series, months),
      },
    ];
  }, [stats, months]);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Card>
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage(error)}
        </div>
      </Card>
    );
  }

  // Below a super_admin, the two roles above a unit cannot appear in the caller's own
  // scope at all — `visible_users` leaves the caller's row out, so an org_admin's own
  // chart would report «ادمین سازمان: ۰» about itself. Only the roles that can actually
  // be counted here are plotted.
  const countableRoles = isSuper
    ? ["super_admin", "org_admin", "unit_admin", "user"]
    : ["unit_admin", "user"];
  const roleRows = stats.accounts_by_role
    .filter((row) => countableRoles.includes(row.role))
    .map((row) => ({ name: ROLE_LABELS[row.role] ?? row.role, value: row.count }));

  const unitRows = stats.accounts_per_unit.map((row) => ({
    name: row.name,
    value: row.accounts,
  }));

  const scopeNote =
    stats.scope === "global"
      ? "همه سازمان‌ها"
      : stats.scope_name
        ? `محدود به ${stats.scope_name}`
        : "محدود به دامنه شما";

  return (
    <>
      {/* The same strip the other three sections open with — this one has nothing to
          add, so it carries only where you are and how far the numbers reach. */}
      <PageToolbar title="داشبورد مدیریت" hint={scopeNote} />

      <Card title="یک نگاه">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          {isSuper && <StatTile label="سازمان‌ها" value={stats.organizations} />}
          {!isUnitAdmin && <StatTile label="واحدها" value={stats.units} />}
          <StatTile
            label="حساب‌ها"
            value={stats.accounts}
            hint={
              stats.accounts_blocked > 0
                ? `${faNumber(stats.accounts_blocked)} حساب مسدود`
                : "همه فعال"
            }
          />
          <StatTile
            label="مشاغل دیتاست"
            value={stats.jobs.corpus_records}
            hint="رکوردهای تأییدشده‌ای که جستجو روی آن‌ها انجام می‌شود"
          />
          <StatTile
            label="در انتظار بررسی"
            value={stats.jobs.pending}
            tone={stats.jobs.pending > 0 ? "warning" : "muted"}
            hint={isSuper ? "صف بررسی شما" : "از حساب‌های زیرمجموعه شما"}
          />
        </div>
      </Card>

      <Card
        title="رشد ماهانه"
        hint="تعداد رکوردهای جدید در هر ماه شمسی — ماه‌ها از راست به چپ"
        actions={
          <div className="flex items-center gap-2">
            {[6, 12].map((count) => (
              <Button
                key={count}
                variant={range === count ? "primary" : "outline"}
                size="sm"
                buttonProps={{ onClick: () => setRange(count) }}
              >
                {faNumber(count)} ماه
              </Button>
            ))}
          </div>
        }
      >
        <MonthlyBars months={months} series={growth} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="حساب‌ها به تفکیک نقش" hint={scopeNote}>
          <CategoryBars rows={roleRows} valueLabel="حساب" />
        </Card>

        {!isUnitAdmin && (
          <Card title="حساب‌های هر واحد" hint="واحدهای بدون حساب هم نشان داده می‌شوند">
            <CategoryBars rows={unitRows} valueLabel="حساب" minHeight={160} />
          </Card>
        )}

        {isUnitAdmin && (
          <Card title="وضعیت حساب‌های واحد">
            <CategoryBars
              rows={[
                { name: "فعال", value: stats.accounts_active },
                { name: "مسدود", value: stats.accounts_blocked },
              ]}
              valueLabel="حساب"
            />
          </Card>
        )}
      </div>

      <Card
        title="دیتاست مشاغل"
        hint="پیشنهادهای زیر، پیشنهادهای حساب‌های زیرمجموعه شماست؛ اندازه دیتاست مشترک همه سازمان‌هاست"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-6">
          <StatTile label="تأییدشده" value={stats.jobs.approved} />
          <StatTile label="در انتظار" value={stats.jobs.pending} tone="warning" />
          <StatTile label="رد شده" value={stats.jobs.rejected} tone="muted" />
        </div>

        {stats.jobs.engine_records == null ? (
          <p className="text-sm text-slate-500 leading-7">
            موتور جستجو هنوز بارگذاری نشده است، بنابراین تعداد رکوردهای آموزش‌دیده در دسترس نیست.
          </p>
        ) : (
          <Meter
            label="رکوردهای واردشده در موتور جستجو"
            value={stats.jobs.engine_records}
            total={stats.jobs.corpus_records}
            note="موتور جستجو با همه رکوردهای تأییدشده ساخته شده است."
          />
        )}
      </Card>

      <Card title="پیشنهادهای شغلی در هر ماه" hint="بر پایه تاریخ ثبت پیشنهاد">
        <MonthlyBars months={months} series={suggestions} height={220} />
      </Card>
    </>
  );
}
