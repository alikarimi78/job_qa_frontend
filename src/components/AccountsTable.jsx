import { useState } from "react";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
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
// anywhere, and only the two levels above a unit decide between units.
function canMove(me, target, unitsById) {
  return (
    canManage(me, target, unitsById) &&
    target.unit_id != null &&
    (me.role === "super_admin" || me.role === "org_admin")
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
  orgsById,
  busy,
  onBlock,
  onUnblock,
  onResetPassword,
  onMove,
  onDelete,
}) {
  // At most one inline panel is open at a time: {id, kind: password|move|delete}
  const [panel, setPanel] = useState(null);
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState("");

  function open(account, kind) {
    setPassword("");
    setDestination(String(account.unit_id ?? units[0]?.id ?? ""));
    setPanel(panel?.id === account.id && panel.kind === kind ? null : { id: account.id, kind });
  }
  const isOpen = (account, kind) => panel?.id === account.id && panel.kind === kind;
  const close = () => setPanel(null);

  function where(account) {
    if (account.unit_id != null) {
      const unit = unitsById[account.unit_id];
      const org = unit ? orgsById[unit.organization_id] : null;
      return unit ? `${unit.name}${org ? ` — ${org.name}` : ""}` : `واحد ${account.unit_id}`;
    }
    if (account.organization_id != null) {
      return orgsById[account.organization_id]?.name ?? `سازمان ${account.organization_id}`;
    }
    return "—";
  }

  function unitLabel(unit) {
    const org = orgsById[unit.organization_id];
    return org ? `${unit.name} — ${org.name}` : unit.name;
  }

  if (accounts.length === 0) {
    return <p className="text-sm text-slate-500">هنوز حسابی در دسترس شما ثبت نشده است.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["نام کاربری", "نقش", "جایگاه", "وضعیت", ""].map((head, i) => (
              <th
                key={i}
                className="text-start text-xs font-medium text-slate-500 px-2 py-2
                           border-b border-slate-200 whitespace-nowrap"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const manageable = canManage(me, account, unitsById);
            const movable = canMove(me, account, unitsById);
            const isMe = me?.id === account.id;

            return (
              <tr key={account.id} className="align-top">
                <td className="px-2 py-3 border-b border-slate-200">
                  <span className={account.is_active ? "text-slate-800" : "text-slate-400 line-through"}>
                    {account.username}
                  </span>
                  {isMe && <span className="text-xs text-slate-400"> (شما)</span>}
                </td>
                <td className="px-2 py-3 border-b border-slate-200">
                  <Badge tone={ROLE_TONE[account.role] ?? "neutral"}>
                    {ROLE_LABELS[account.role] ?? account.role}
                  </Badge>
                </td>
                <td className="px-2 py-3 border-b border-slate-200 text-xs text-slate-500">
                  {where(account)}
                </td>
                <td className="px-2 py-3 border-b border-slate-200">
                  {account.is_active ? (
                    <Badge tone="success">فعال</Badge>
                  ) : (
                    <Badge tone="danger">مسدود</Badge>
                  )}
                </td>
                <td className="px-2 py-3 border-b border-slate-200 text-end">
                  {manageable && (
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {account.is_active ? (
                        <Button
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          buttonProps={{ disabled: busy, onClick: () => onBlock(account) }}
                        >
                          مسدود کن
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          className="h-8 px-3 text-xs"
                          buttonProps={{ disabled: busy, onClick: () => onUnblock(account) }}
                        >
                          رفع مسدودی
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        buttonProps={{ disabled: busy, onClick: () => open(account, "password") }}
                      >
                        تغییر رمز
                      </Button>
                      {movable && (
                        <Button
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          buttonProps={{ disabled: busy, onClick: () => open(account, "move") }}
                        >
                          انتقال
                        </Button>
                      )}
                      <Button
                        variant="danger-outline"
                        className="h-8 px-3 text-xs"
                        buttonProps={{ disabled: busy, onClick: () => open(account, "delete") }}
                      >
                        حذف
                      </Button>
                    </div>
                  )}

                  {isOpen(account, "password") && (
                    <form
                      className="flex items-center justify-end gap-2 flex-wrap mt-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onResetPassword(account, password, close);
                      }}
                    >
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        placeholder="رمز تازه (حداقل ۸ نویسه)"
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 px-3 w-56 rounded-xl bg-white text-sm border border-slate-200
                                   outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      />
                      <Button
                        variant="primary"
                        className="h-9 px-4 text-xs"
                        buttonProps={{ type: "submit", disabled: busy }}
                      >
                        ثبت
                      </Button>
                    </form>
                  )}

                  {isOpen(account, "move") && (
                    <form
                      className="flex items-center justify-end gap-2 flex-wrap mt-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onMove(account, Number(destination), close);
                      }}
                    >
                      <Select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-9 max-w-60"
                        selectProps={{ required: true }}
                      >
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unitLabel(unit)}
                          </option>
                        ))}
                      </Select>
                      <Button
                        variant="primary"
                        className="h-9 px-4 text-xs"
                        buttonProps={{ type: "submit", disabled: busy }}
                      >
                        انتقال بده
                      </Button>
                    </form>
                  )}

                  {isOpen(account, "delete") && (
                    <div className="flex items-center justify-end gap-2 flex-wrap mt-2">
                      <span className="text-xs text-slate-500">
                        «{account.username}» برای همیشه حذف شود؟ برگشت‌پذیر نیست.
                      </span>
                      <Button
                        variant="danger"
                        className="h-9 px-4 text-xs"
                        buttonProps={{ disabled: busy, onClick: () => onDelete(account, close) }}
                      >
                        حذف کن
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 px-4 text-xs"
                        buttonProps={{ disabled: busy, onClick: close }}
                      >
                        انصراف
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
