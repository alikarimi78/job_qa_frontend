import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import JobForm from "@components/JobForm";
import Modal from "@components/ui/Modal";
import { CloseButton, DialogFooter } from "@components/manage/Forms";
import { splitItems } from "@components/ui/ItemsInput";
import {
  useApproveSuggestionMutation,
  useRebuildMutation,
  useRebuildStatusQuery,
  useRejectSuggestionMutation,
  useSuggestionsQuery,
  useUpdateSuggestionMutation,
} from "@services/adminApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// The moderation queue, and nothing else. «افزودن مستقیم شغل» — the same ten-column
// form posted to `POST /admin/jobs`, which inserts as `approved` without a review —
// used to sit under it and was removed at the customer's request: a super_admin can
// already fill in «پیشنهاد شغل» and approve the row here, so the second form was the
// same record entered twice with nothing to choose between them. The endpoint is still
// on the server and `adminApi.createJob` still describes it; what is gone is the
// second way in.

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

// The dialog's <form>, named once so the footer's button and the form itself agree.
const EDIT_FORM_ID = "suggestion-edit-form";

export default function Admin() {
  // The row whose read-only panel is open, at most one at a time. Editing is no longer
  // one of its modes — it is a dialog now (`editing`, below), which is why these are two
  // pieces of state rather than the `{ id, mode }` pair they used to be.
  const [open, setOpen] = useState(null);
  // The id being corrected. The row itself is looked up in `pending` rather than copied
  // here, so a queue that refetches under the dialog cannot leave it editing a stale one.
  const [editing, setEditing] = useState(null);

  const { data: pending = [], isLoading } = useSuggestionsQuery("pending");
  const [approve] = useApproveSuggestionMutation();
  const [reject] = useRejectSuggestionMutation();
  const [updateSuggestion, { isLoading: saving }] = useUpdateSuggestionMutation();
  const [startRebuild, { isLoading: starting }] = useRebuildMutation();

  // The rebuild runs on a daemon thread and the old engine keeps serving throughout,
  // so the only way to know it finished is to ask — and only while it is running.
  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const running = rebuild?.running ?? false;

  const toggle = (id) => setOpen((was) => (was === id ? null : id));

  // Only ever the row the dialog was opened on, and only while it is still pending: a
  // suggestion decided in another tab simply takes its dialog with it.
  const editingRow = editing === null ? null : pending.find((it) => it.id === editing);

  async function review(id, action, title) {
    try {
      await (action === "approve" ? approve(id) : reject(id)).unwrap();
      if (open === id) setOpen(null);
      if (editing === id) setEditing(null);
      showMessage.success(
        action === "approve"
          ? `«${title}» تایید شد؛ بازسازی امبدینگ‌ها آغاز شد و وضعیت آن در همین صفحه نمایش داده می‌شود.`
          : `«${title}» رد شد.`
      );
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  // The reviewer's own correction of a suggestion, before deciding on it. It is the same
  // form the suggester filled in, so a wrong column is fixed here instead of the record
  // being rejected and the person asked to send it again.
  //
  // The dialog is closed only on success — a 409 («این پیشنهاد پیش‌تر بررسی شده») leaves
  // it open with the corrections still in it — and the row's details are opened in its
  // place, so what was saved is what the reviewer decides on next.
  async function saveEdit(id, body) {
    try {
      await updateSuggestion({ id, ...body }).unwrap();
      setEditing(null);
      setOpen(id);
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
                    buttonProps={{ onClick: () => setEditing(it.id) }}
                  >
                    ویرایش
                  </Button>
                  <Button variant="outline" buttonProps={{ onClick: () => toggle(it.id) }}>
                    {open === it.id ? "بستن" : "جزئیات"}
                  </Button>
                </div>
              </div>

              {open === it.id && (
                <div className="mb-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  {DETAIL_ROWS.map(([key, label, list]) => (
                    <FieldRow key={key} label={label} value={it[key]} list={list} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* The correction happens in a dialog rather than in a panel under the row: the ten
          columns are a page of their own, and unfolded in place they pushed the rest of
          the queue far enough down that the reviewer lost sight of what they were
          reviewing. The dialog is mounted only while a row is being edited, so `JobForm`
          seeds its boxes from that record on every open — the `key` says the same thing
          for the case where one editor is opened directly from another. */}
      {editingRow && (
        <Modal
          open
          title={`ویرایش «${editingRow.job_title}»`}
          hint="اصلاح پیشنهاد پیش از تصمیم‌گیری. با ذخیره، رکورد همچنان در صف بررسی باقی می‌ماند؛ افزودن آن به پایگاه داده مستلزم انتخاب گزینه «تایید» است."
          size="lg"
          onClose={saving ? undefined : () => setEditing(null)}
          footer={
            <>
              <DialogFooter
                formId={EDIT_FORM_ID}
                label="ذخیره تغییرات"
                busy={saving}
              />
              <CloseButton
                onClose={() => setEditing(null)}
                busy={saving}
                label="انصراف"
              />
            </>
          }
        >
          <JobForm
            key={editingRow.id}
            formId={EDIT_FORM_ID}
            initial={editingRow}
            onSubmit={(body) => saveEdit(editingRow.id, body)}
          />
        </Modal>
      )}
    </>
  );
}
