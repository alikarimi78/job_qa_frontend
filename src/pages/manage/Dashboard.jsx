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

export default function Dashboard() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [range, setRange] = useState(12);
  const { data: stats, isLoading, error } = useStatsQuery();

  const months = useMemo(() => lastPersianMonths(range), [range]);

  const growth = useMemo(() => {
    if (!stats) return [];
    const all = [
      { key: "accounts", label: "کاربران جدید", series: stats.accounts_series },
      { key: "organizations", label: "سازمان‌های جدید", series: stats.organizations_series },
    ];
    const shown = isSuper ? all : all.slice(0, 1);
    return shown.map((item) => ({
      key: item.key,
      label: item.label,
      values: bucketByMonth(item.series, months),
    }));
  }, [stats, months, isSuper]);

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

  const countableRoles = isSuper ? ["super_admin", "org_admin", "user"] : ["user"];
  const roleRows = stats.accounts_by_role
    .filter((row) => countableRoles.includes(row.role))
    .map((row) => ({ name: ROLE_LABELS[row.role] ?? row.role, value: row.count }));

  const scopeNote =
    stats.scope === "global"
      ? "همه سازمان‌ها"
      : stats.scope_name
        ? `محدود به ${stats.scope_name}`
        : "محدود به دامنه شما";

  return (
    <>
      <PageToolbar title="داشبورد مدیریت" hint={scopeNote} />

      <Card title="نمای کلی">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          {isSuper && <StatTile label="سازمان‌ها" value={stats.organizations} />}
          <StatTile
            label="کاربران"
            value={stats.accounts}
            hint={
              stats.accounts_blocked > 0
                ? `${faNumber(stats.accounts_blocked)} کاربر مسدود`
                : "همه فعال"
            }
          />
          <StatTile
            label="مشاغل پایگاه داده"
            value={stats.jobs.corpus_records}
            hint="رکوردهای تاییدشده‌ای که جستجو بر روی آن‌ها انجام می‌شود"
          />
          <StatTile
            label="در انتظار بررسی"
            value={stats.jobs.pending}
            tone={stats.jobs.pending > 0 ? "warning" : "muted"}
            hint={isSuper ? "صف بررسی شما" : "از کاربران زیرمجموعه شما"}
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
        <Card title="کاربران به تفکیک نقش" hint={scopeNote}>
          <CategoryBars rows={roleRows} valueLabel="کاربر" />
        </Card>

        <Card title="وضعیت کاربران" hint={scopeNote}>
          <CategoryBars
            rows={[
              { name: "فعال", value: stats.accounts_active },
              { name: "مسدود", value: stats.accounts_blocked },
            ]}
            valueLabel="کاربر"
          />
        </Card>
      </div>

      <Card
        title="پایگاه داده مشاغل"
        hint="پیشنهادهای زیر متعلق به کاربران زیرمجموعه شماست؛ حجم پایگاه داده، مشترک میان تمامی سازمان‌هاست"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-6">
          <StatTile label="تایید شده" value={stats.jobs.approved} />
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
            note="موتور جستجو با تمامی رکوردهای تاییدشده ساخته شده است."
          />
        )}
      </Card>

      <Card title="پیشنهادهای شغلی در هر ماه" hint="بر پایه تاریخ ثبت پیشنهاد">
        <MonthlyBars months={months} series={suggestions} height={220} />
      </Card>
    </>
  );
}
