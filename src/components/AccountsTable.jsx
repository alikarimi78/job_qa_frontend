import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Badge from "@components/ui/Badge";
import Button from "@components/ui/Button";
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
  ConfirmDialog,
  DetailsDialog,
  PasswordDialog,
  PersonNameFields,
  SelfPasswordDialog,
} from "@components/manage/Forms";
import { ROLE_LABELS } from "@routes/roles";

export { ROLE_LABELS };

// Mirrors the backend's rule (src/accounts.py:assert_can_manage_account) so the table
// only offers buttons that would succeed. The server enforces it either way — this is
// about not showing an action that will come back 403.
function canManage(me, target) {
  if (!me || me.id === target.id) return false;
  if (me.role === "super_admin") return true;
  if (me.role === "org_admin") {
    return target.role === "user" && target.organization_id === me.organization_id;
  }
  return false;
}

// Moving is narrower than the rest, and it is the same move for every row now that an
// org_admin and an ordinary user both sit in an organization directly: only a
// super_admin makes one, because an org_admin has no second organization to move anyone
// into. It used to be the whole of what «ویرایش» meant for a row; a row now also
// carries the person's name, which anyone who can manage it may correct — so the pencil
// opens on the name, and the destination is the part of the dialog that comes and goes.
function canMoveOrganization(me, target) {
  return (
    canManage(me, target) &&
    me.role === "super_admin" &&
    target.organization_id != null
  );
}

const ROLE_TONE = {
  super_admin: "danger",
  org_admin: "warning",
  user: "neutral",
};

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
}) {
  // One dialog at a time: {kind: view|password|self-password|edit|delete|block, account}
  const [dialog, setDialog] = useState(null);
  const [destination, setDestination] = useState("");
  // The name half of the edit dialog. The destination stays plain state below — `ui/Select`
  // is a controlled input by design, and one form of two shapes would be worse than this.
  const editForm = useForm({ defaultValues: { first_name: "", last_name: "" } });
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;
  const account = dialog?.account ?? null;
  // Whether the dialog offers a destination at all: an org_admin may correct the name of
  // a user in their organization but may not move them, and nobody moves their own row.
  const movable = !!account && canMoveOrganization(me, account);

  function open(kind, target) {
    // Seeded with what the row already holds — this is an edit, not a re-entry. The last
    // fallback is for a super_admin, which sits in no organization, and for a legacy row
    // that has no name either.
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
      // Null for an account created before the columns existed (migration 0007); the
      // pencil is how it gets filled in.
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
      cell: (row) => (
        <Badge tone={ROLE_TONE[row.role] ?? "neutral"}>{ROLE_LABELS[row.role] ?? row.role}</Badge>
      ),
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
      cell: (row) =>
        row.is_active ? <Badge tone="success">فعال</Badge> : <Badge tone="danger">مسدود</Badge>,
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
                {/* The glyph is the action, not the state: an active account offers a
                    closing padlock, a blocked one an open padlock. */}
                {row.is_active ? LockGlyph : UnlockGlyph}
              </IconButton>
            )}
            {/* Someone else's password is set outright; the caller's own is changed
                against the current one, through the endpoint that asks for it. That
                second case is the only way a super_admin ever changes their password —
                nobody may act on their own row here, and nobody sits above them. */}
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
            {/* Shown for every row the caller may act on, and for their own: the name
                is editable in both cases (`/accounts/{id}/name` and `/auth/name`), while
                the destination inside the dialog appears only when a move is allowed. */}
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
      <DataTable
        columns={columns}
        rows={accounts}
        empty="تاکنون کاربری در دسترس شما ثبت نشده است."
      />

      <DetailsDialog
        open={is("view")}
        title="مشاهده کاربر"
        onClose={close}
        rows={
          account
            ? [
                { label: "نام و نام خانوادگی", value: account.full_name || "—" },
                { label: "نام کاربری", value: account.username },
                {
                  label: "نقش",
                  value: (
                    <Badge tone={ROLE_TONE[account.role] ?? "neutral"}>
                      {ROLE_LABELS[account.role] ?? account.role}
                    </Badge>
                  ),
                },
                { label: "جایگاه", value: where(account) },
                {
                  label: "وضعیت",
                  value: account.is_active ? (
                    <Badge tone="success">فعال</Badge>
                  ) : (
                    <Badge tone="danger">مسدود</Badge>
                  ),
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
        onSubmit={(values, done) => onChangeOwnPassword(values, done)}
      />

      {/* «ویرایش کاربر» is the person's name, plus which organization the account sits
          in when the caller may move it. Neither the role nor the username is edited:
          the role decides which scope column the row carries, and the username is the
          credential you log in with. */}
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
            <Button
              variant="submit"
              size="lg"
              className="max-w-md"
              buttonProps={{ type: "submit", form: "account-edit-form", disabled: busy }}
            >
              ثبت تغییر
            </Button>
            <Button variant="outline" size="lg" buttonProps={{ onClick: close, disabled: busy }}>
              بستن
            </Button>
          </>
        }
      >
        <FormProvider {...editForm}>
          <form
            id="account-edit-form"
            onSubmit={editForm.handleSubmit((values) => {
              // Only what actually changed is sent: the page turns each part into its own
              // request, and re-submitting the organization an account already sits in
              // would be a move for nothing (and, for an admin, a 409 against its own seat).
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
                {/* The seat may already be taken, and this does not try to predict it —
                    the page asks and shows the 409, which names the admin sitting there. */}
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
