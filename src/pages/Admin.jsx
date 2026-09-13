import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import JobForm from "@components/JobForm";
import Modal from "@components/ui/Modal";
import Select from "@components/ui/Select";
import { CloseButton, DialogFooter } from "@components/manage/Forms";
import { splitItems } from "@components/ui/ItemsInput";
import { useCurrentUserQuery } from "@services/authApi";
import { useOrganizationsQuery } from "@services/accountsApi";
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

const EDIT_FORM_ID = "suggestion-edit-form";

// «همه» for a super_admin, «عمومی» for the records that belong to no organization, and
// one entry per organization. An org_admin is handed their own organization's queue by
// the server whatever they ask for, so they are shown no filter at all.
const PUBLIC = "public";

export default function Admin() {
  const [open, setOpen] = useState(null);
  const [editing, setEditing] = useState(null);
  const [scope, setScope] = useState("");

  const { data: me } = useCurrentUserQuery();
  const { data: orgs = [] } = useOrganizationsQuery();
  const isSuper = me?.role === "super_admin";

  const { data: pending = [], isLoading } = useSuggestionsQuery({
    jobStatus: "pending",
    organizationId: isSuper && scope && scope !== PUBLIC ? Number(scope) : undefined,
    publicOnly: isSuper && scope === PUBLIC,
  });
  const [approve] = useApproveSuggestionMutation();
  const [reject] = useRejectSuggestionMutation();
  const [updateSuggestion, { isLoading: saving }] = useUpdateSuggestionMutation();
  const [startRebuild, { isLoading: starting }] = useRebuildMutation();

  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const running = rebuild?.running ?? false;

  const toggle = (id) => setOpen((was) => (was === id ? null : id));

  const orgsById = Object.fromEntries(orgs.map((org) => [org.id, org]));
  const scopeOf = (item) =>
    item.organization_id == null
      ? ["عمومی", "neutral"]
      : [`اختصاصی — ${orgsById[item.organization_id]?.name ?? item.organization_id}`,
         "accent"];

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
        hint="پیشنهاد عمومی تاییدشده به پایگاه داده مشترک تمامی سازمان‌ها افزوده می‌شود و پیشنهاد اختصاصی تنها در جست‌وجوی همان سازمان دیده می‌شود"
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
          {isSuper && (
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
          )}
        </div>

        {isSuper && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <label className="text-sm text-slate-600">دامنه:</label>
            <Select
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              className="min-w-44"
            >
              <option value="">همه</option>
              <option value={PUBLIC}>عمومی</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </div>
        )}

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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      پیشنهاد #{it.id.toLocaleString("fa-IR")}
                    </span>
                    <Badge tone={scopeOf(it)[1]}>{scopeOf(it)[0]}</Badge>
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
            owners={orgs}
            allowPublic={isSuper}
            onSubmit={(body) => saveEdit(editingRow.id, body)}
          />
        </Modal>
      )}
    </>
  );
}
