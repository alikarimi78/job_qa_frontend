import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import JobForm from "@components/JobForm";
import {
  useApproveSuggestionMutation,
  useCreateJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
  useRejectSuggestionMutation,
  useSuggestionsQuery,
} from "@services/adminApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// The record columns as the queue shows them when a row is expanded. `job_title` is
// already the row's heading, so it is not repeated here.
const DETAIL_ROWS = [
  ["aliases", "نام‌های دیگر"],
  ["tools", "ابزارها"],
  ["skills", "مهارت‌ها"],
  ["knowledge", "دانش تخصصی"],
  ["abilities", "توانایی‌ها"],
  ["description", "شرح شغل"],
  ["responsibilities", "وظایف و مسئولیت‌ها"],
  ["work_context", "محیط کاری"],
  ["career_path_next", "مسیر شغلی بعدی"],
];

export default function Admin() {
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const { data: pending = [], isLoading } = useSuggestionsQuery("pending");
  const [approve] = useApproveSuggestionMutation();
  const [reject] = useRejectSuggestionMutation();
  const [createJob, { isLoading: adding }] = useCreateJobMutation();
  const [startRebuild, { isLoading: starting }] = useRebuildMutation();

  // The rebuild runs on a daemon thread and the old engine keeps serving throughout,
  // so the only way to know it finished is to ask — and only while it is running.
  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const running = rebuild?.running ?? false;

  async function review(id, action, title) {
    try {
      await (action === "approve" ? approve(id) : reject(id)).unwrap();
      showMessage.success(
        action === "approve"
          ? `«${title}» تأیید شد. برای اعمال در جستجو، بازسازی امبدینگ لازم است.`
          : `«${title}» رد شد.`
      );
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function rebuildNow() {
    try {
      await startRebuild().unwrap();
      showMessage.info("بازسازی آغاز شد؛ جستجو در این مدت با نسخه قبلی پاسخ می‌دهد.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function addDirect(form, reset) {
    try {
      await createJob(form).unwrap();
      showMessage.success("شغل اضافه شد. برای اعمال در جستجو، بازسازی امبدینگ لازم است.");
      reset();
      setShowAdd(false);
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <>
      <Card
        title="بررسی پیشنهادها"
        hint="پیشنهاد تأییدشده به دیتاست مشترک همه سازمان‌ها اضافه می‌شود"
        actions={
          <Badge tone={pending.length ? "warning" : "neutral"}>
            {pending.length.toLocaleString("fa-IR")} پیشنهاد در انتظار
          </Badge>
        }
      >
        <div className="flex items-center justify-between gap-4 flex-wrap px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
          <div>
            <strong className="text-sm text-slate-800">بازسازی امبدینگ‌ها</strong>
            <p className="text-xs text-slate-500 mt-0.5 leading-6">
              {running
                ? "در حال اجرا... جستجو همچنان با موتور قبلی پاسخ می‌دهد."
                : rebuild?.last_result
                  ? `آخرین اجرا: ${rebuild.last_result}`
                  : "تا وقتی بازسازی نشود، رکورد تازه در جستجو دیده نمی‌شود."}
            </p>
          </div>
          <Button
            variant="secondary"
            buttonProps={{ onClick: rebuildNow, disabled: running || starting }}
          >
            {running || starting ? (
              <>
                <Spinner />
                در حال اجرا...
              </>
            ) : (
              "بازسازی"
            )}
          </Button>
        </div>

        {isLoading && <Loader />}
        {!isLoading && pending.length === 0 && (
          <p className="text-sm text-slate-500">پیشنهاد در انتظاری وجود ندارد.</p>
        )}

        <div className="flex flex-col">
          {pending.map((it) => (
            <div key={it.id} className="border-t border-slate-200 first:border-t-0">
              <div className="flex items-center justify-between gap-3 flex-wrap py-3">
                <div>
                  <strong className="text-sm text-slate-800">{it.job_title}</strong>
                  <div className="text-xs text-slate-400 mt-0.5">
                    پیشنهاد #{it.id.toLocaleString("fa-IR")}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="success"
                    buttonProps={{ onClick: () => review(it.id, "approve", it.job_title) }}
                  >
                    تأیید
                  </Button>
                  <Button
                    variant="danger"
                    buttonProps={{ onClick: () => review(it.id, "reject", it.job_title) }}
                  >
                    رد
                  </Button>
                  <Button
                    variant="outline"
                    buttonProps={{
                      onClick: () => setExpanded(expanded === it.id ? null : it.id),
                    }}
                  >
                    {expanded === it.id ? "بستن" : "جزئیات"}
                  </Button>
                </div>
              </div>

              {expanded === it.id && (
                <div className="mb-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-700 flex flex-col gap-2">
                  {DETAIL_ROWS.map(([key, label]) => (
                    <p key={key} className="m-0 leading-7">
                      <strong className="text-slate-800">{label}: </strong>
                      {it[key] || "—"}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="افزودن مستقیم شغل"
        hint="این فرم رکورد را بدون صف بررسی، مستقیماً تأییدشده ثبت می‌کند. در فیلدهای چندمقداری، موردها را با «|» از هم جدا کنید؛ در «عنوان شغل»، «شرح شغل» و «محیط کاری» که متن پیوسته‌اند از «|» استفاده نکنید."
        actions={
          <Button variant="outline" buttonProps={{ onClick: () => setShowAdd(!showAdd) }}>
            {showAdd ? "بستن" : "باز کردن فرم"}
          </Button>
        }
      >
        {showAdd && <JobForm onSubmit={addDirect} submitLabel="افزودن" busy={adding} />}
      </Card>
    </>
  );
}
