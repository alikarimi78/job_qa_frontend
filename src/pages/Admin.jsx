import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import JobForm from "@components/JobForm";
import { splitItems } from "@components/ui/ItemsInput";
import {
  useApproveSuggestionMutation,
  useCreateJobMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
  useRejectSuggestionMutation,
  useSuggestionsQuery,
  useUpdateSuggestionMutation,
} from "@services/adminApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// The record columns as the queue shows them when a row is opened. `job_title` is
// already the row's heading, so it is not repeated here. The `list` flag is the
// dataset's own split: seven «|»-joined list columns and three prose ones, where a
// comma is punctuation — the same split `JobForm` reads and the reason the values are
// shown as chips rather than as the raw cell with its separators in it.
const DETAIL_ROWS = [
  ["aliases", "نام‌های دیگر", true],
  ["tools", "ابزارها", true],
  ["skills", "مهارت‌ها", true],
  ["knowledge", "دانش تخصصی", true],
  ["abilities", "توانایی‌ها", true],
  ["description", "شرح شغل", false],
  ["responsibilities", "وظایف و مسئولیت‌ها", true],
  ["work_context", "محیط کاری", false],
  ["career_path_next", "مسیر شغلی بعدی", true],
];

function FieldRow({ label, value, list }) {
  const items = list ? splitItems(value) : [];

  return (
    <div className="py-2.5 border-t border-slate-200 first:border-t-0">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-[13px] text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="m-0 mt-1 text-[13px] leading-7 text-slate-700">{value || "—"}</p>
      )}
    </div>
  );
}

export default function Admin() {
  // `{ id, mode }`: one row is open at a time, either read-only or as the form. A single
  // piece of state for both, so opening the editor closes whatever else was open.
  const [open, setOpen] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const { data: pending = [], isLoading } = useSuggestionsQuery("pending");
  const [approve] = useApproveSuggestionMutation();
  const [reject] = useRejectSuggestionMutation();
  const [updateSuggestion, { isLoading: saving }] = useUpdateSuggestionMutation();
  const [createJob, { isLoading: adding }] = useCreateJobMutation();
  const [startRebuild, { isLoading: starting }] = useRebuildMutation();

  // The rebuild runs on a daemon thread and the old engine keeps serving throughout,
  // so the only way to know it finished is to ask — and only while it is running.
  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const running = rebuild?.running ?? false;

  const toggle = (id, mode) =>
    setOpen((was) => (was?.id === id && was.mode === mode ? null : { id, mode }));

  async function review(id, action, title) {
    try {
      await (action === "approve" ? approve(id) : reject(id)).unwrap();
      if (open?.id === id) setOpen(null);
      showMessage.success(
        action === "approve"
          ? `«${title}» تایید شد؛ برای اعمال در جستجو، بازسازی امبدینگ‌ها لازم است.`
          : `«${title}» رد شد.`
      );
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  // The reviewer's own correction of a suggestion, before deciding on it. It is the same
  // form the suggester filled in, so a wrong column is fixed here instead of the record
  // being rejected and the person asked to send it again.
  async function saveEdit(id, body) {
    try {
      await updateSuggestion({ id, ...body }).unwrap();
      setOpen({ id, mode: "view" });
      showMessage.success("تغییرات ذخیره شد؛ پیشنهاد همچنان در انتظار تصمیم شماست.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function rebuildNow() {
    try {
      await startRebuild().unwrap();
      showMessage.info("بازسازی آغاز شد؛ جستجو در این مدت با نسخه پیشین پاسخ می‌دهد.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function addDirect(form, reset) {
    try {
      await createJob(form).unwrap();
      showMessage.success("شغل ثبت شد؛ برای اعمال در جستجو، بازسازی امبدینگ‌ها لازم است.");
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
        hint="پیشنهاد تاییدشده به پایگاه داده مشترک تمامی سازمان‌ها افزوده می‌شود"
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
                ? "در حال اجرا؛ جستجو همچنان با نسخه پیشین پاسخ می‌دهد."
                : rebuild?.last_result
                  ? `آخرین اجرا: ${rebuild.last_result}`
                  : "تا زمانی که بازسازی انجام نشود، رکورد جدید در جستجو نمایش داده نمی‌شود."}
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
                    تایید
                  </Button>
                  <Button
                    variant="danger"
                    buttonProps={{ onClick: () => review(it.id, "reject", it.job_title) }}
                  >
                    رد
                  </Button>
                  <Button
                    variant="outline"
                    buttonProps={{ onClick: () => toggle(it.id, "edit") }}
                  >
                    {open?.id === it.id && open.mode === "edit" ? "بستن ویرایش" : "ویرایش"}
                  </Button>
                  <Button
                    variant="outline"
                    buttonProps={{ onClick: () => toggle(it.id, "view") }}
                  >
                    {open?.id === it.id && open.mode === "view" ? "بستن" : "جزئیات"}
                  </Button>
                </div>
              </div>

              {open?.id === it.id && open.mode === "view" && (
                <div className="mb-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  {DETAIL_ROWS.map(([key, label, list]) => (
                    <FieldRow key={key} label={label} value={it[key]} list={list} />
                  ))}
                </div>
              )}

              {open?.id === it.id && open.mode === "edit" && (
                <div className="mb-3 px-4 py-4 rounded-xl bg-blue-50/60 border border-blue-200">
                  <p className="text-xs text-blue-800 leading-6 mb-4">
                    اصلاح پیشنهاد پیش از تصمیم‌گیری. با ذخیره، رکورد همچنان در صف بررسی باقی
                    می‌ماند؛ افزودن آن به پایگاه داده مستلزم انتخاب گزینه «تایید» است.
                  </p>
                  {/* Keyed on the row, so opening another suggestion's editor seeds the
                      boxes from that record rather than from the one before it. */}
                  <JobForm
                    key={it.id}
                    initial={it}
                    onSubmit={(body) => saveEdit(it.id, body)}
                    submitLabel="ذخیره تغییرات"
                    busy={saving}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="افزودن مستقیم شغل"
        hint="این فرم رکورد را بدون قرار گرفتن در صف بررسی، مستقیماً به‌صورت تاییدشده ثبت می‌کند."
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
