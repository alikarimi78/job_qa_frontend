import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import Modal from "@components/ui/Modal";
import DataTable, { RowActions } from "@components/ui/DataTable";
import IconButton, {
  EyeGlyph,
  KeyGlyph,
  LockGlyph,
  PencilGlyph,
  TrashGlyph,
  UnlockGlyph,
} from "@components/ui/IconButton";
import {
  CloseButton,
  ConfirmDialog,
  DetailsDialog,
  DialogFooter,
  PasswordDialog,
  PersonNameFields,
  SelfPasswordDialog,
} from "@components/manage/Forms";
import { ROLE_LABELS } from "@routes/roles";
import { faDateTime } from "@utils/jalali";

function canManage(me, target) {
  if (!me || me.id === target.id) return false;
  if (me.role === "super_admin") return true;
  return me.role === "org_admin" && target.role === "user" && target.organization_id === me.organization_id;
}

const canMoveOrganization = (me, target) =>
  canManage(me, target) && me.role === "super_admin" && target.organization_id != null;

const ROLE_TONE = { super_admin: "danger", org_admin: "warning", user: "neutral" };

const roleBadge = (role) => <Badge tone={ROLE_TONE[role] ?? "neutral"}>{ROLE_LABELS[role] ?? role}</Badge>;

const statusBadge = (active) =>
  active ? <Badge tone="success">فعال</Badge> : <Badge tone="danger">مسدود</Badge>;

const personOf = (account) =>
  account ? (account.full_name ? `${account.full_name} (${account.username})` : account.username) : "—";

export default function AccountsTable({
  accounts,
  me,
  orgs,
  orgsById,
  busy,
  onBlock,
  onUnblock,
  onResetPassword,
  onChangeOwnPassword,
  onSaveAccount,
  onDelete,
  empty,
}) {
  const [dialog, setDialog] = useState(null);
  const [destination, setDestination] = useState("");
  const editForm = useForm({ defaultValues: { first_name: "", last_name: "" } });
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;
  const account = dialog?.account ?? null;
  const movable = !!account && canMoveOrganization(me, account);

  function open(kind, target) {
    if (kind === "edit") {
      setDestination(String(target.organization_id ?? orgs[0]?.id ?? ""));
      editForm.reset({
        first_name: target.first_name ?? "",
        last_name: target.last_name ?? "",
      });
    }
    setDialog({ kind, account: target });
  }

  function where(target) {
    if (target.organization_id == null) return "—";
    return orgsById[target.organization_id]?.name ?? `سازمان ${target.organization_id}`;
  }

  const columns = [
    {
      key: "person",
      header: "نام و نام خانوادگی",
      cell: (row) => (
        <span className={row.full_name ? "text-slate-800" : "text-slate-400"}>
          {row.full_name || "—"}
        </span>
      ),
    },
    {
      key: "username",
      header: "نام کاربری",
      cell: (row) => (
        <>
          <span className={row.is_active ? "text-slate-800" : "text-slate-400 line-through"}>
            {row.username}
          </span>
          {me?.id === row.id && <span className="text-xs text-slate-400"> (شما)</span>}
        </>
      ),
    },
    {
      key: "role",
      header: "نقش",
      cell: (row) => roleBadge(row.role),
    },
    {
      key: "where",
      header: "جایگاه",
      className: "text-xs text-slate-500",
      cell: (row) => where(row),
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (row) => statusBadge(row.is_active),
    },
    {
      key: "last_login",
      header: "آخرین ورود",
      className: "text-xs text-slate-500 whitespace-nowrap fa-nums",
      cell: (row) => faDateTime(row.last_login),
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (row) => {
        const manageable = canManage(me, row);
        return (
          <RowActions>
            {manageable && (
              <IconButton
                tone="neutral"
                title={row.is_active ? `مسدودکردن ${row.username}` : `رفع مسدودی ${row.username}`}
                disabled={busy}
                onClick={() => (row.is_active ? open("block", row) : onUnblock(row))}
              >
                {row.is_active ? LockGlyph : UnlockGlyph}
              </IconButton>
            )}
            {manageable && (
              <IconButton
                tone="warning"
                title={`تغییر رمز ${row.username}`}
                disabled={busy}
                onClick={() => open("password", row)}
              >
                {KeyGlyph}
              </IconButton>
            )}
            {me?.id === row.id && (
              <IconButton
                tone="warning"
                title="تغییر رمز عبور خود"
                disabled={busy}
                onClick={() => open("self-password", row)}
              >
                {KeyGlyph}
              </IconButton>
            )}
            {(manageable || me?.id === row.id) && (
              <IconButton
                tone="edit"
                title={`ویرایش کاربر ${row.username}`}
                disabled={busy}
                onClick={() => open("edit", row)}
              >
                {PencilGlyph}
              </IconButton>
            )}
            <IconButton
              tone="view"
              title={`مشاهده کاربر ${row.username}`}
              onClick={() => open("view", row)}
            >
              {EyeGlyph}
            </IconButton>
            {manageable && (
              <IconButton
                tone="danger"
                title={`حذف کاربر ${row.username}`}
                disabled={busy}
                onClick={() => open("delete", row)}
              >
                {TrashGlyph}
              </IconButton>
            )}
          </RowActions>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={accounts} empty={empty} />

      <DetailsDialog
        open={is("view")}
        title="مشاهده کاربر"
        onClose={close}
        rows={
          account
            ? [
                { label: "نام و نام خانوادگی", value: account.full_name || "—" },
                { label: "نام کاربری", value: account.username },
                { label: "نقش", value: roleBadge(account.role) },
                { label: "جایگاه", value: where(account) },
                { label: "وضعیت", value: statusBadge(account.is_active) },
                { label: "ایجادکننده", value: personOf(account.creator) },
                { label: "تاریخ ایجاد", value: faDateTime(account.created_at) },
                { label: "آخرین ویرایش", value: faDateTime(account.updated_at) },
                {
                  label: "آخرین ورود",
                  value: account.last_login ? faDateTime(account.last_login) : "تاکنون وارد نشده است",
                },
              ]
            : []
        }
      />

      <PasswordDialog
        open={is("password")}
        title="تغییر رمز کاربر"
        hint={`تعیین رمز جدید برای «${account?.username ?? ""}». رمز فعلی پرسیده نمی‌شود؛ این گزینه برای کاربری است که امکان اعلام رمز فعلی خود را ندارد.`}
        busy={busy}
        onClose={close}
        onSubmit={(password, done) => onResetPassword(account, password, done)}
      />

      <SelfPasswordDialog
        open={is("self-password")}
        title="تغییر رمز عبور خود"
        hint="رمز فعلی پرسیده می‌شود، زیرا در این حالت تنها نشست باز شما گواه مالکیت حساب است."
        busy={busy}
        onClose={close}
        onSubmit={onChangeOwnPassword}
      />

      <Modal
        open={is("edit")}
        title="ویرایش کاربر"
        hint={
          movable
            ? `نام و سازمان «${account?.username ?? ""}» ویرایش می‌شود؛ نقش آن عوض نمی‌شود و هیچ‌چیز دیگری با آن جابه‌جا نمی‌شود.`
            : `نام «${account?.username ?? ""}» اصلاح می‌شود؛ نام کاربری و نقش تغییر نمی‌کنند.`
        }
        onClose={busy ? undefined : close}
        size="md"
        footer={
          <>
            <DialogFooter formId="account-edit-form" label="ثبت تغییر" busy={busy} />
            <CloseButton onClose={close} busy={busy} />
          </>
        }
      >
        <FormProvider {...editForm}>
          <form
            id="account-edit-form"
            onSubmit={editForm.handleSubmit((values) => {
              const target = Number(destination);
              const moved =
                movable && String(target) !== String(account.organization_id ?? "");
              onSaveAccount(
                account,
                { ...values, organizationId: moved ? target : null },
                close
              );
            })}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              <PersonNameFields />
            </div>

            {movable && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">سازمان</label>
                <Select
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full h-11"
                  selectProps={{ required: true }}
                >
                  {orgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
                {account?.role === "org_admin" && (
                  <span className="text-xs text-slate-400">
                    انتقال ادمین سازمان تنها به سازمانی امکان‌پذیر است که ادمین نداشته باشد.
                  </span>
                )}
              </div>
            )}
          </form>
        </FormProvider>
      </Modal>

      <ConfirmDialog
        open={is("block")}
        title="مسدودکردن کاربر"
        message={`از این پس ورود «${account?.username ?? ""}» پذیرفته نمی‌شود، حتی اگر توکن معتبری در اختیار داشته باشد. هیچ اطلاعاتی حذف نمی‌شود و در هر زمان امکان رفع مسدودی وجود دارد.`}
        confirmLabel="مسدود شود"
        busy={busy}
        onClose={close}
        onConfirm={() => onBlock(account, close)}
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف کاربر"
        message={`آیا از حذف «${account?.username ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. پیشنهادهای شغلی این کاربر در پایگاه داده باقی می‌مانند و تنها انتساب آن‌ها به این کاربر حذف می‌شود.`}
        busy={busy}
        onClose={close}
        onConfirm={() => onDelete(account, close)}
      />
    </>
  );
}
