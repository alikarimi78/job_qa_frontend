import { useState } from "react";

export const ROLE_LABELS = {
  super_admin: "سوپر ادمین",
  org_admin: "ادمین سازمان",
  unit_admin: "ادمین واحد",
  user: "کاربر",
};

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
  return canManage(me, target, unitsById)
    && target.unit_id != null
    && (me.role === "super_admin" || me.role === "org_admin");
}

export default function AccountsTable({ accounts, me, units, unitsById, orgsById, busy,
                                        onBlock, onUnblock, onResetPassword, onMove,
                                        onDelete }) {
  // At most one inline panel is open at a time: {id, kind: password|move|delete}
  const [panel, setPanel] = useState(null);
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState("");

  function open(account, kind) {
    setPassword("");
    setDestination(String(account.unit_id ?? ""));
    setPanel(panel?.id === account.id && panel.kind === kind
      ? null : { id: account.id, kind });
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
    return <p className="meta">هنوز حسابی در دسترس شما ثبت نشده است.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>نام کاربری</th><th>نقش</th><th>جایگاه</th><th>وضعیت</th><th></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const manageable = canManage(me, account, unitsById);
            const movable = canMove(me, account, unitsById);
            const isMe = me?.id === account.id;
            return (
              <tr key={account.id} className={account.is_active ? "" : "row-blocked"}>
                <td>
                  {account.username}
                  {isMe && <span className="meta"> (شما)</span>}
                </td>
                <td><span className="badge accent">{ROLE_LABELS[account.role] ?? account.role}</span></td>
                <td className="meta">{where(account)}</td>
                <td>
                  {account.is_active
                    ? <span className="badge success">فعال</span>
                    : <span className="badge danger">مسدود</span>}
                </td>
                <td>
                  {manageable && (
                    <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                      {account.is_active
                        ? <button className="danger" disabled={busy}
                                  onClick={() => onBlock(account)}>مسدود کن</button>
                        : <button className="success" disabled={busy}
                                  onClick={() => onUnblock(account)}>رفع مسدودی</button>}
                      <button disabled={busy} onClick={() => open(account, "password")}>تغییر رمز</button>
                      {movable && (
                        <button disabled={busy} onClick={() => open(account, "move")}>انتقال</button>
                      )}
                      <button className="danger" disabled={busy}
                              onClick={() => open(account, "delete")}>حذف</button>
                    </div>
                  )}

                  {isOpen(account, "password") && (
                    <form className="row panel" onSubmit={(e) => {
                      e.preventDefault();
                      onResetPassword(account, password, close);
                    }}>
                      <input type="password" required minLength={8} value={password}
                             placeholder="رمز تازه (حداقل ۸ نویسه)" style={{ maxWidth: 220 }}
                             onChange={(e) => setPassword(e.target.value)} />
                      <button className="primary" disabled={busy}>ثبت</button>
                    </form>
                  )}

                  {isOpen(account, "move") && (
                    <form className="row panel" onSubmit={(e) => {
                      e.preventDefault();
                      onMove(account, Number(destination), close);
                    }}>
                      <select value={destination} required style={{ maxWidth: 240 }}
                              onChange={(e) => setDestination(e.target.value)}>
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>{unitLabel(unit)}</option>
                        ))}
                      </select>
                      <button className="primary" disabled={busy}>انتقال بده</button>
                    </form>
                  )}

                  {isOpen(account, "delete") && (
                    <div className="row panel">
                      <span className="meta">
                        «{account.username}» برای همیشه حذف شود؟ برگشت‌پذیر نیست.
                      </span>
                      <button className="danger" disabled={busy}
                              onClick={() => onDelete(account, close)}>حذف کن</button>
                      <button disabled={busy} onClick={close}>انصراف</button>
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
