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
import { ROLE_LABELS } from "@routes/roles";
import { useOrganizationsQuery } from "@services/accountsApi";
import { useStatsQuery } from "@services/statsApi";
import { bucketByMonth, faNumber, lastPersianMonths } from "@utils/jalali";
import { errorMessage } from "@utils/errors";

export default function Dashboard() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [range, setRange] = useState(12);
  // Every number on the page is the filter's: the accounts, the series and the job
  // records alike. An org_admin is narrowed to their own organization by the server and
  // is shown no filter.
  const [orgFilter, setOrgFilter] = useState("");
  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: stats, isLoading, error } = useStatsQuery(
    orgFilter ? Number(orgFilter) : undefined
  );

  const months = useMemo(() => lastPersianMonths(range), [range]);

  const growth = useMemo(() => {
    if (!stats) return [];
    const all = [
      { key: "accounts", label: "کاربران جدید", series: stats.accounts_series },
      { key: "organizations", label: "سازمان‌های جدید", series: stats.organizations_series },
    ];
    const shown = isSuper && !orgFilter ? all : all.slice(0, 1);
    return shown.map((item) => ({
      key: item.key,
      label: item.label,
      values: bucketByMonth(item.series, months),
    }));
  }, [stats, months, isSuper, orgFilter]);

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

  const orgRows = stats.jobs_by_organization.map((row) => ({
    name: row.name,
    value: row.count,
  }));

  return (
    <>
      <PageToolbar title="پیشخوان مدیریت" hint={scopeNote}>
        {isSuper && (
          <Select
            value={orgFilter}
            onChange={(event) => setOrgFilter(event.target.value)}
            className="h-11 min-w-44"
          >
            <option value="">همه سازمان‌ها</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        )}
      </PageToolbar>

      <Card title="نمای کلی">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          {isSuper && !orgFilter && (
            <StatTile label="سازمان‌ها" value={stats.organizations} />
          )}
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
            hint="رکوردهای تاییدشده‌ای که تحلیل بر اساس آن‌ها انجام می‌شود"
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
        hint="تعداد رکوردهای جدید در هر ماه"
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
        hint="پیشنهادهای زیر متعلق به دامنه شماست؛ مشاغل عمومی میان تمامی سازمان‌ها مشترک است و مشاغل اختصاصی تنها در نتایج تحلیل سازمان خودشان دیده می‌شود"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-6">
          <StatTile label="تایید شده" value={stats.jobs.approved} />
          <StatTile label="در انتظار" value={stats.jobs.pending} tone="warning" />
          <StatTile label="رد شده" value={stats.jobs.rejected} tone="muted" />
          <StatTile
            label="مشاغل عمومی"
            value={stats.jobs.public_records}
            hint="در دسترس تمامی سازمان‌ها"
          />
          <StatTile
            label="مشاغل اختصاصی"
            value={stats.jobs.organization_records}
            hint={stats.scope === "global" ? "مجموع همه سازمان‌ها" : "ویژه سازمان شما"}
          />
        </div>

        {stats.jobs.engine_records == null ? (
          <p className="text-sm text-slate-500 leading-7">
            موتور تحلیل هنوز بارگذاری نشده است، بنابراین تعداد رکوردهای آموزش‌دیده در دسترس نیست.
          </p>
        ) : (
          <Meter
            label="رکوردهای واردشده در موتور تحلیل"
            value={stats.jobs.engine_records}
            total={stats.jobs.corpus_records}
            note="موتور تحلیل با تمامی رکوردهای تاییدشده ساخته شده است."
          />
        )}
      </Card>

      {orgRows.length > 0 && (
        <Card
          title="مشاغل اختصاصی به تفکیک سازمان"
          hint="رکوردهای تاییدشده‌ای که تنها در نتایج تحلیل همان سازمان دیده می‌شوند"
        >
          <CategoryBars rows={orgRows} valueLabel="شغل" />
        </Card>
      )}

      <Card title="پیشنهادهای شغلی در هر ماه" hint="بر پایه تاریخ ثبت پیشنهاد">
        <MonthlyBars months={months} series={suggestions} height={220} />
      </Card>
    </>
  );
}
