import { useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";
import AccountsTable, { ROLE_LABELS } from "../components/AccountsTable.jsx";

// One page for the whole provisioning chain; which sections appear depends on the
// caller's role, exactly as the API's permissions do:
//   super_admin  organizations -> their admins -> units -> unit admins -> users
//   org_admin    units of their own organization -> unit admins
//   unit_admin   the users of their own unit
// Every list the page shows is already scoped by the server, so nothing here filters
// for privacy — the selections below are only about what to look at.

function CredentialsForm({ label, busy, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="row"
      style={{ flexWrap: "wrap" }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ username, password }, () => { setUsername(""); setPassword(""); });
      }}
    >
      <input placeholder="نام کاربری" value={username} required minLength={3}
             onChange={(e) => setUsername(e.target.value)} style={{ maxWidth: 200 }} />
      <input placeholder="رمز عبور (حداقل ۸ نویسه)" type="password" value={password}
             required minLength={8} onChange={(e) => setPassword(e.target.value)}
             style={{ maxWidth: 220 }} />
      <button className="primary" disabled={busy}>{label}</button>
    </form>
  );
}

function NameForm({ label, placeholder, busy, onSubmit }) {
  const [name, setName] = useState("");
  return (
    <form
      className="row"
      onSubmit={(e) => { e.preventDefault(); onSubmit(name, () => setName("")); }}
    >
      <input placeholder={placeholder} value={name} required minLength={2}
             onChange={(e) => setName(e.target.value)} style={{ maxWidth: 260 }} />
      <button className="primary" disabled={busy}>{label}</button>
    </form>
  );
}

export default function Manage() {
  const [me, setMe] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [units, setUnits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [meRes, orgRes, unitRes, accRes] = await Promise.all([
        api.get("/auth/me"),
        // A unit_admin has no access to /orgs; an empty list is the honest answer for them
        api.get("/orgs").catch(() => ({ data: [] })),
        api.get("/units").catch(() => ({ data: [] })),
        api.get("/accounts"),
      ]);
      setMe(meRes.data);
      setOrgs(orgRes.data);
      setUnits(unitRes.data);
      setAccounts(accRes.data);
      if (meRes.data.role === "org_admin") setOrgId(meRes.data.organization_id);
      if (meRes.data.role === "unit_admin") setUnitId(meRes.data.unit_id);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => { load(); }, []);

  // Every mutation goes through here: one place to report the failure and refresh
  async function act(request, message, reset) {
    setBusy(true); setError(""); setNotice("");
    try {
      await request();
      setNotice(message);
      reset?.();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!me) {
    return <div className="card">{error ? <div className="error">{error}</div> : "..."}</div>;
  }

  const isSuper = me.role === "super_admin";
  const isOrgAdmin = me.role === "org_admin";
  const isUnitAdmin = me.role === "unit_admin";

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const unitsById = Object.fromEntries(units.map((u) => [u.id, u]));
  const visibleUnits = orgId == null ? units : units.filter((u) => u.organization_id === orgId);
  const selectedUnit = unitId != null ? unitsById[unitId] : null;

  const orgAdminOf = (id) => accounts.find((a) => a.role === "org_admin" && a.organization_id === id);
  const unitAdminOf = (id) => accounts.find((a) => a.role === "unit_admin" && a.unit_id === id);

  // The table follows the selection so a large deployment stays readable
  const listed = accounts.filter((a) => {
    if (unitId != null) return a.unit_id === unitId;
    if (orgId != null) {
      return a.organization_id === orgId
        || (a.unit_id != null && unitsById[a.unit_id]?.organization_id === orgId);
    }
    return true;
  });

  return (
    <>
      <div className="card">
        <h1>مدیریت حساب‌ها</h1>
        <p className="hint">
          شما {ROLE_LABELS[me.role]} هستید
          {me.organization ? ` — ${me.organization.name}` : ""}
          {me.unit ? ` / ${me.unit.name}` : ""}.
        </p>
        {error && <div className="error">{error}</div>}
        {notice && <div className="notice">{notice}</div>}
      </div>

      {isSuper && (
        <div className="card">
          <h1>سازمان‌ها</h1>
          <p className="hint">سازمان را بسازید و برای هرکدام یک ادمین سازمان تعریف کنید</p>
          <NameForm label="ساخت سازمان" placeholder="نام سازمان" busy={busy}
                    onSubmit={(name, reset) =>
                      act(() => api.post("/orgs", { name }), `سازمان «${name}» ساخته شد.`, reset)} />
          {orgs.map((org) => {
            const admin = orgAdminOf(org.id);
            return (
              <div key={org.id} className="list-item" style={{ flexWrap: "wrap", gap: 8 }}>
                <span>
                  <button className={orgId === org.id ? "primary" : ""}
                          onClick={() => { setOrgId(orgId === org.id ? null : org.id); setUnitId(null); }}>
                    {org.name}
                  </button>
                  <span className="meta" style={{ marginInlineStart: 8 }}>
                    {admin ? `ادمین: ${admin.username}` : "ادمین ندارد"}
                  </span>
                </span>
                {!admin && (
                  <CredentialsForm label="ساخت ادمین سازمان" busy={busy}
                    onSubmit={(body, reset) =>
                      act(() => api.post("/accounts/org-admins", { ...body, organization_id: org.id }),
                          `ادمین سازمان «${org.name}» ساخته شد.`, reset)} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {(isSuper || isOrgAdmin) && (
        <div className="card">
          <h1>واحدها</h1>
          {isSuper && orgId == null ? (
            <p className="hint">برای ساخت واحد، ابتدا یک سازمان را از فهرست بالا انتخاب کنید.</p>
          ) : (
            <>
              <p className="hint">
                واحدهای {orgsById[orgId]?.name ?? "سازمان شما"} — برای هر واحد یک ادمین واحد
              </p>
              <NameForm label="ساخت واحد" placeholder="نام واحد" busy={busy}
                        onSubmit={(name, reset) =>
                          act(() => api.post("/units", isSuper ? { name, organization_id: orgId }
                                                               : { name }),
                              `واحد «${name}» ساخته شد.`, reset)} />
            </>
          )}
          {visibleUnits.map((unit) => {
            const admin = unitAdminOf(unit.id);
            return (
              <div key={unit.id} className="list-item" style={{ flexWrap: "wrap", gap: 8 }}>
                <span>
                  <button className={unitId === unit.id ? "primary" : ""}
                          onClick={() => setUnitId(unitId === unit.id ? null : unit.id)}>
                    {unit.name}
                  </button>
                  <span className="meta" style={{ marginInlineStart: 8 }}>
                    {/* With no organization picked, a super admin sees every unit at
                        once — say which organization each one belongs to. */}
                    {isSuper && orgId == null && orgsById[unit.organization_id]
                      ? `${orgsById[unit.organization_id].name} · ` : ""}
                    {admin ? `ادمین: ${admin.username}` : "ادمین ندارد"}
                  </span>
                </span>
                {!admin && (
                  <CredentialsForm label="ساخت ادمین واحد" busy={busy}
                    onSubmit={(body, reset) =>
                      act(() => api.post("/accounts/unit-admins", { ...body, unit_id: unit.id }),
                          `ادمین واحد «${unit.name}» ساخته شد.`, reset)} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {(isSuper || isUnitAdmin) && (
        <div className="card">
          <h1>کاربران</h1>
          {isUnitAdmin ? (
            <p className="hint">کاربران واحد {me.unit?.name} را اینجا تعریف کنید</p>
          ) : selectedUnit ? (
            <p className="hint">کاربر تازه در واحد «{selectedUnit.name}» ساخته می‌شود</p>
          ) : (
            <p className="hint">برای ساخت کاربر، ابتدا یک واحد را از فهرست بالا انتخاب کنید.</p>
          )}
          {(isUnitAdmin || selectedUnit) && (
            <CredentialsForm label="ساخت کاربر" busy={busy}
              onSubmit={(body, reset) =>
                act(() => api.post("/accounts/users",
                                   isUnitAdmin ? body : { ...body, unit_id: selectedUnit.id }),
                    "کاربر ساخته شد.", reset)} />
          )}
        </div>
      )}

      {isSuper && (
        <div className="card">
          <h1>سوپر ادمین‌ها</h1>
          <p className="hint">فقط یک سوپر ادمین می‌تواند سوپر ادمین تازه بسازد</p>
          <CredentialsForm label="ساخت سوپر ادمین" busy={busy}
            onSubmit={(body, reset) =>
              act(() => api.post("/accounts/super-admins", body), "سوپر ادمین ساخته شد.", reset)} />
        </div>
      )}

      <div className="card">
        <h1>حساب‌ها</h1>
        <p className="hint">
          مسدودکردن حساب چیزی را حذف نمی‌کند؛ فقط ورود آن حساب رد می‌شود — بی‌درنگ، حتی اگر
          توکن معتبری در دست داشته باشد. حذف برگشت‌پذیر نیست، ولی پیشنهادهای شغلی آن حساب
          در دیتاست باقی می‌مانند.
          {unitId != null || orgId != null ? " (محدود به انتخاب بالا)" : ""}
        </p>
        <AccountsTable
          accounts={listed} me={me} units={units} unitsById={unitsById} orgsById={orgsById}
          busy={busy}
          onBlock={(a) => act(() => api.post(`/accounts/${a.id}/block`),
                              `حساب «${a.username}» مسدود شد.`)}
          onUnblock={(a) => act(() => api.post(`/accounts/${a.id}/unblock`),
                                `حساب «${a.username}» رفع مسدودی شد.`)}
          onResetPassword={(a, password, reset) =>
            act(() => api.post(`/accounts/${a.id}/password`, { password }),
                `رمز «${a.username}» تغییر کرد.`, reset)}
          onMove={(a, unitId, reset) =>
            act(() => api.post(`/accounts/${a.id}/unit`, { unit_id: unitId }),
                `«${a.username}» به واحد «${unitsById[unitId]?.name ?? unitId}» منتقل شد.`, reset)}
          onDelete={(a, reset) =>
            act(() => api.delete(`/accounts/${a.id}`),
                `حساب «${a.username}» حذف شد.`, reset)}
        />
      </div>
    </>
  );
}
