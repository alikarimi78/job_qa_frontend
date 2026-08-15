import { useState } from "react";
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
// anywhere, and only the two levels above a unit decide between units. It is also the
// whole of what «ویرایش» means for an account — a username is the credential you log
// in with, so there is no endpoint that changes one, and the pencil is hidden for
// anyone who cannot move the row instead of opening onto nothing.
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
  onMove,
  onMoveOrganization,
  onDelete,
}) {
  // One dialog at a time: {kind: view|password|self-password|move|delete|block, account}
  const [dialog, setDialog] = useState(null);
  const [destination, setDestination] = useState("");
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;
  const account = dialog?.account ?? null;
  // «ویرایش» is one dialog over two endpoints: an org_admin changes organization, and
  // everyone else changes unit. Which one is read off the row's own scope column rather
  // than off its role — that column *is* the role's scope (`ck_users_scope`).
  const movingOrganization = account?.organization_id != null;

  function open(kind, target) {
    // Seeded with where the row already is; the last fallback is for a legacy `user`
    // row, which is the one kind of account that may sit in no unit at all.
    if (kind === "move") {
      setDestination(String(target.organization_id ?? target.unit_id ?? units[0]?.id ?? ""));
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
                title="تغییر رمز خودم"
                disabled={busy}
                onClick={() => open("self-password", row)}
              >
                {KeyGlyph}
              </IconButton>
            )}
            {(canMove(me, row, unitsById) || canMoveOrganization(me, row, unitsById)) && (
              <IconButton
                tone="edit"
                title={`ویرایش حساب ${row.username}`}
                disabled={busy}
                onClick={() => open("move", row)}
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
        empty="هنوز حسابی در دسترس شما ثبت نشده است."
      />

      <DetailsDialog
        open={is("view")}
        title="مشاهده حساب"
        onClose={close}
        rows={
          account
            ? [
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
        hint={`رمز جدید برای «${account?.username ?? ""}». رمز فعلی پرسیده نمی‌شود — این کار برای حسابی است که نمی‌تواند آن را بگوید.`}
        busy={busy}
        onClose={close}
        onSubmit={(password, done) => onResetPassword(account, password, done)}
      />

      <SelfPasswordDialog
        open={is("self-password")}
        title="تغییر رمز خودم"
        hint="رمز فعلی پرسیده می‌شود، چون اینجا چیزی جز نشست باز شما ثابت نمی‌کند که صاحب حساب هستید."
        busy={busy}
        onClose={close}
        onSubmit={(values, done) => onChangeOwnPassword(values, done)}
      />

      {/* «ویرایش حساب» is where the account sits and nothing else: a role is not edited
          (it decides which scope column the row carries) and a username is the
          credential. Which container that is follows the row — an org_admin belongs to
          an organization, everyone below it to a unit. */}
      <Modal
        open={is("move")}
        title="ویرایش حساب"
        hint={
          movingOrganization
            ? `«${account?.username ?? ""}» به سازمان دیگری منتقل می‌شود؛ نقش آن عوض نمی‌شود و واحدهای سازمان قبلی با آن جابه‌جا نمی‌شوند.`
            : `«${account?.username ?? ""}» به واحد جدید منتقل می‌شود؛ نقش آن عوض نمی‌شود و هیچ‌چیز دیگری با آن جابه‌جا نمی‌شود.`
        }
        onClose={busy ? undefined : close}
        size="md"
        footer={
          <>
            <Button
              variant="submit"
              size="lg"
              className="max-w-md"
              buttonProps={{ type: "submit", form: "account-move-form", disabled: busy }}
            >
              ثبت تغییر
            </Button>
            <Button variant="outline" size="lg" buttonProps={{ onClick: close, disabled: busy }}>
              بستن
            </Button>
          </>
        }
      >
        <form
          id="account-move-form"
          onSubmit={(event) => {
            event.preventDefault();
            const target = Number(destination);
            if (movingOrganization) onMoveOrganization(account, target, close);
            else onMove(account, target, close);
          }}
          className="flex flex-col gap-1.5"
        >
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
          {/* The seat may already be taken, and this does not try to predict it — the
              page asks and shows the 409, which names the admin sitting there. */}
          {(movingOrganization || account?.role === "unit_admin") && (
            <span className="text-xs text-slate-400">
              {movingOrganization
                ? "یک ادمین سازمان فقط به سازمانی می‌رود که ادمین نداشته باشد."
                : "یک ادمین واحد فقط به واحدی می‌رود که ادمین نداشته باشد."}
            </span>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={is("block")}
        title="مسدودکردن حساب"
        message={`ورود «${account?.username ?? ""}» از همین لحظه رد می‌شود، حتی اگر توکن معتبری در دست داشته باشد. چیزی حذف نمی‌شود و هر وقت بخواهید می‌توانید رفع مسدودی کنید.`}
        confirmLabel="مسدود شود"
        busy={busy}
        onClose={close}
        onConfirm={() => onBlock(account, close)}
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف حساب"
        message={`آیا از حذف «${account?.username ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. پیشنهادهای شغلی این حساب در دیتاست باقی می‌مانند و فقط نام صاحبشان را از دست می‌دهند.`}
        busy={busy}
        onClose={close}
        onConfirm={() => onDelete(account, close)}
      />
    </>
  );
}
