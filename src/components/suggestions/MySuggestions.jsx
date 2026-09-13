import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Loader from "@components/ui/Loader";
import { useCurrentUserQuery } from "@services/authApi";
import { useMySuggestionsQuery } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";

const STATUS = {
  pending: ["در انتظار بررسی", "warning"],
  approved: ["تایید شده", "success"],
  rejected: ["رد شده", "danger"],
};

export default function MySuggestions() {
  const { data: items = [], isLoading, error } = useMySuggestionsQuery();
  const { data: me } = useCurrentUserQuery();

  // The organization is named only when it is the suggester's own, which is the only
  // one they could have chosen.
  const scopeOf = (item) => {
    if (item.organization_id == null) return ["عمومی", "neutral"];
    const mine = me?.organization?.id === item.organization_id;
    return [mine ? `اختصاصی — ${me.organization.name}` : "اختصاصی", "accent"];
  };

  return (
    <Card title="پیشنهادهای من" hint="وضعیت مشاغلی که پیشنهاد داده‌اید">
      {isLoading && <Loader />}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage(error)}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-slate-500">تاکنون پیشنهادی ثبت نکرده‌اید.</p>
      )}

      <div className="flex flex-col">
        {items.map((it) => {
          const [label, tone] = STATUS[it.status] ?? [it.status, "neutral"];
          const [scopeLabel, scopeTone] = scopeOf(it);
          return (
            <div
              key={it.id}
              className="flex items-center justify-between gap-4 py-4 border-t border-slate-200 first:border-t-0"
            >
              <div className="min-w-0">
                <strong className="text-sm text-slate-800">{it.job_title}</strong>
                <p className="text-xs text-slate-500 mt-1 leading-6 line-clamp-2">
                  {it.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge tone={scopeTone}>{scopeLabel}</Badge>
                <Badge tone={tone}>{label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
