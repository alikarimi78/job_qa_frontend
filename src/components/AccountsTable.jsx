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

// Mirrors the backend's rule (app/accounts.py:assert_can_manage_account) so the table
// only offers buttons that would succeed. The server enforces it either way — this is
// about not showing an action that will come back 403.
function canManage(me, target, unitsById) {
  if (!me || me.id === target.id) return false;
  if (me.role === "super_admin") return true;
  if (me.role === "org_admin") {
    const unit = target.unit_id != null ? unitsById[target.unit_id] : null;
    return !!unit && unit.organization_id === me.organization_id;
  }
  if (me.role === "unit_admin") {
    return target.role === "user" && target.unit_id === me.unit_id;
  }
  return false;
}

// Moving is narrower than the rest: only an account that lives in a unit can go
// anywhere, and only the two levels above a unit decide between units. It used to be
// the whole of what «ویرایش» meant for an account; an account now also carries the
// person's name, which anyone who can manage the row may correct — so the pencil opens
// on the name, and the destination is the part of the dialog that comes and goes.
function canMove(me, target, unitsById) {
  return (
    canManage(me, target, unitsById) &&
    target.unit_id != null &&
    (me.role === "super_admin" || me.role === "org_admin")
  );
}

// The same «ویرایش», for the one role that does not sit in a unit: an org_admin belongs
// to its organization directly, so its move is `POST /accounts/{id}/organization` and
// its pencil would otherwise never appear. Super_admin only, matching the endpoint —
// an org_admin cannot manage a peer (a peer has no unit through which it would be
// inside their organization) and has no second organization to move one into.
function canMoveOrganization(me, target, unitsById) {
  return (
    canManage(me, target, unitsById) &&
    me.role === "super_admin" &&
    target.organization_id != null
  );
}

const ROLE_TONE = {
  super_admin: "danger",
  org_admin: "warning",
  unit_admin: "accent",
  user: "neutral",
};

export default function AccountsTable({
  accounts,
  me,
  units,
  unitsById,
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
  // «ویرایش» is one dialog over two endpoints: an org_admin changes organization, and
  // everyone else changes unit. Which one is read off the row's own scope column rather
  // than off its role — that column *is* the role's scope (`ck_users_scope`).
  const movingOrganization = account?.organization_id != null;
  // Whether the dialog offers a destination at all: a unit_admin may correct the name of
  // a user in their unit but may not move them, and nobody moves their own row.
  const movable =
    !!account &&
    (canMove(me, account, unitsById) || canMoveOrganization(me, account, unitsById));

  function open(kind, target) {
    // Seeded with what the row already holds — this is an edit, not a re-entry. The last
    // fallback is for a legacy `user` row, the one kind of account that may sit in no
    // unit at all, and for a legacy row that has no name either.
    if (kind === "edit") {
      setDestination(String(target.organization_id ?? target.unit_id ?? units[0]?.id ?? ""));
      editForm.reset({
        first_name: target.first_name ?? "",
        last_name: target.last_name ?? "",
      });
    }
    setDialog({ kind, account: target });
  }

  function where(target) {
    if (target.unit_id != null) {
      const unit = unitsById[target.unit_id];
      const org = unit ? orgsById[unit.organization_id] : null;
      return unit ? `${unit.name}${org ? ` — ${org.name}` : ""}` : `واحد ${target.unit_id}`;
    }
    if (target.organization_id != null) {
      return orgsById[target.organization_id]?.name ?? `سازمان ${target.organization_id}`;
    }
    return "—";
  }

  function unitLabel(unit) {
    const org = orgsById[unit.organization_id];
    return org ? `${unit.name} — ${org.name}` : unit.name;
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
        const manageable = canManage(me, row, unitsById);
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
                title={`ویرایش حساب ${row.username}`}
                disabled={busy}
                onClick={() => open("edit", row)}
              >
                {PencilGlyph}
              </IconButton>
            )}
            <IconButton
              tone="view"
              title={`مشاهده حساب ${row.username}`}
              onClick={() => open("view", row)}
            >
              {EyeGlyph}
            </IconButton>
            {manageable && (
              <IconButton
                tone="danger"
                title={`حذف حساب ${row.username}`}
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
        empty="تاکنون حسابی در دسترس شما ثبت نشده است."
      />

      <DetailsDialog
        open={is("view")}
        title="مشاهده حساب"
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
        title="تغییر رمز حساب"
        hint={`تعیین رمز جدید برای «${account?.username ?? ""}». رمز فعلی پرسیده نمی‌شود؛ این گزینه برای حسابی است که امکان اعلام رمز فعلی خود را ندارد.`}
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

      {/* «ویرایش حساب» is the person's name, plus where the account sits when the caller
          may move it. Neither the role nor the username is edited: the role decides which
          scope column the row carries, and the username is the credential you log in
          with. Which container a move offers follows the row — an org_admin belongs to an
          organization, everyone below it to a unit. */}
      <Modal
        open={is("edit")}
        title="ویرایش حساب"
        hint={
          !movable
            ? `نام «${account?.username ?? ""}» اصلاح می‌شود؛ نام کاربری و نقش تغییر نمی‌کنند.`
            : movingOrganization
              ? `نام و سازمان «${account?.username ?? ""}» ویرایش می‌شود؛ نقش آن عوض نمی‌شود و واحدهای سازمان قبلی با آن جابه‌جا نمی‌شوند.`
              : `نام و واحد «${account?.username ?? ""}» ویرایش می‌شود؛ نقش آن عوض نمی‌شود و هیچ‌چیز دیگری با آن جابه‌جا نمی‌شود.`
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
              // request, and re-submitting the unit an account already sits in would be a
              // move for nothing (and, for an admin, a 409 against its own seat).
              const target = Number(destination);
              const moved =
                movable && String(target) !== String(account.organization_id ?? account.unit_id ?? "");
              onSaveAccount(
                account,
                {
                  ...values,
                  unitId: moved && !movingOrganization ? target : null,
                  organizationId: moved && movingOrganization ? target : null,
                },
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
                <label className="text-sm font-medium text-slate-700">
                  {movingOrganization ? "سازمان" : "واحد"}
                </label>
                <Select
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full h-11"
                  selectProps={{ required: true }}
                >
                  {movingOrganization
                    ? orgs.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))
                    : units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unitLabel(unit)}
                        </option>
                      ))}
                </Select>
                {/* The seat may already be taken, and this does not try to predict it —
                    the page asks and shows the 409, which names the admin sitting there. */}
                {(movingOrganization || account?.role === "unit_admin") && (
                  <span className="text-xs text-slate-400">
                    {movingOrganization
                      ? "انتقال ادمین سازمان تنها به سازمانی امکان‌پذیر است که ادمین نداشته باشد."
                      : "انتقال ادمین واحد تنها به واحدی امکان‌پذیر است که ادمین نداشته باشد."}
                  </span>
                )}
              </div>
            )}
          </form>
        </FormProvider>
      </Modal>

      <ConfirmDialog
        open={is("block")}
        title="مسدودکردن حساب"
        message={`از این پس ورود «${account?.username ?? ""}» پذیرفته نمی‌شود، حتی اگر توکن معتبری در اختیار داشته باشد. هیچ اطلاعاتی حذف نمی‌شود و در هر زمان امکان رفع مسدودی وجود دارد.`}
        confirmLabel="مسدود شود"
        busy={busy}
        onClose={close}
        onConfirm={() => onBlock(account, close)}
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف حساب"
        message={`آیا از حذف «${account?.username ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. پیشنهادهای شغلی این حساب در پایگاه داده باقی می‌مانند و تنها انتساب آن‌ها به صاحب حساب حذف می‌شود.`}
        busy={busy}
        onClose={close}
        onConfirm={() => onDelete(account, close)}
      />
    </>
  );
}
