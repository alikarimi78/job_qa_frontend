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

export default function AccountsTable({ accounts, me, unitsById, orgsById,
                                        onBlock, onUnblock, onResetPassword, busy }) {
  const [resettingId, setResettingId] = useState(null);
  const [password, setPassword] = useState("");

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
                      <button disabled={busy} onClick={() => {
                        setResettingId(resettingId === account.id ? null : account.id);
                        setPassword("");
                      }}>تغییر رمز</button>
                    </div>
                  )}
                  {resettingId === account.id && (
                    <form
                      className="row"
                      style={{ marginTop: 8, justifyContent: "flex-end" }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        onResetPassword(account, password, () => {
                          setResettingId(null);
                          setPassword("");
                        });
                      }}
                    >
                      <input type="password" required minLength={8} value={password}
                             placeholder="رمز تازه (حداقل ۸ نویسه)" style={{ maxWidth: 220 }}
                             onChange={(e) => setPassword(e.target.value)} />
                      <button className="primary" disabled={busy}>ثبت</button>
                    </form>
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
