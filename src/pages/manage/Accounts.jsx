import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import PageToolbar from "@components/ui/PageToolbar";
import AccountsTable from "@components/AccountsTable";
import { CredentialsDialog } from "@components/manage/Forms";
import { ROLE_LABELS } from "@routes/roles";
import {
  useAccountsQuery,
  useBlockAccountMutation,
  useCreateOrgAdminMutation,
  useCreateSuperAdminMutation,
  useCreateUnitAdminMutation,
  useCreateUserMutation,
  useDeleteAccountMutation,
  useMoveAccountMutation,
  useMoveAccountOrganizationMutation,
  useOrganizationsQuery,
  useResetPasswordMutation,
  useUnblockAccountMutation,
  useUnitsQuery,
} from "@services/accountsApi";
import { useChangeOwnPasswordMutation } from "@services/authApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Every account the caller may act on, in one table — and, since the separate
// «کاربران» page was folded in here, the one place any account is created. The four
// creation endpoints differ only in which scope they need, so they are one dialog with
// a role picker rather than four forms on four pages.
//
// The filters are about what to look at, not about privacy: the server has already
// scoped the list, so an org_admin's «همه سازمان‌ها» is only ever its own.

// Which roles each role may create — the provisioning chain of app/routers/accounts.py,
// read as a table. An org_admin deliberately cannot create ordinary users: it creates
// the units and their admins, and those admins staff their own unit.
const CREATABLE = {
  super_admin: ["super_admin", "org_admin", "unit_admin", "user"],
  org_admin: ["unit_admin"],
  unit_admin: ["user"],
};

// What each new role has to be given besides a username and a password. A super_admin
// belongs to nothing, so it needs neither.
const SCOPE_OF = {
  super_admin: null,
  org_admin: "organization",
  unit_admin: "unit",
  user: "unit",
};

export default function Accounts() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";
  const isUnitAdmin = me.role === "unit_admin";

  const [orgFilter, setOrgFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  const [adding, setAdding] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newScopeId, setNewScopeId] = useState("");

  const { data: accounts = [] } = useAccountsQuery();
  const { data: units = [] } = useUnitsQuery();
  // A unit_admin is not allowed to list organizations; asking anyway would only
  // produce a 403 to swallow.
  const { data: orgs = [] } = useOrganizationsQuery(undefined, { skip: isUnitAdmin });

  const [blockAccount, { isLoading: b1 }] = useBlockAccountMutation();
  const [unblockAccount, { isLoading: b2 }] = useUnblockAccountMutation();
  const [resetPassword, { isLoading: b3 }] = useResetPasswordMutation();
  const [moveAccount, { isLoading: b4 }] = useMoveAccountMutation();
  const [deleteAccount, { isLoading: b5 }] = useDeleteAccountMutation();
  const [moveAccountOrganization, { isLoading: b6 }] = useMoveAccountOrganizationMutation();
  const [changeOwnPassword, { isLoading: b7 }] = useChangeOwnPasswordMutation();
  const [createSuperAdmin, { isLoading: c1 }] = useCreateSuperAdminMutation();
  const [createOrgAdmin, { isLoading: c2 }] = useCreateOrgAdminMutation();
  const [createUnitAdmin, { isLoading: c3 }] = useCreateUnitAdminMutation();
  const [createUser, { isLoading: c4 }] = useCreateUserMutation();
  const busy = b1 || b2 || b3 || b4 || b5 || b6 || b7;
  const creating = c1 || c2 || c3 || c4;

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const unitsById = Object.fromEntries(units.map((u) => [u.id, u]));

  const organizationId = orgFilter === "" ? null : Number(orgFilter);
  const unitId = unitFilter === "" ? null : Number(unitFilter);
  const unitOptions =
    organizationId == null ? units : units.filter((u) => u.organization_id === organizationId);

  const listed = accounts.filter((account) => {
    if (unitId != null) return account.unit_id === unitId;
    if (organizationId != null) {
      return (
        account.organization_id === organizationId ||
        (account.unit_id != null &&
          unitsById[account.unit_id]?.organization_id === organizationId)
      );
    }
    return true;
  });

  const creatableRoles = CREATABLE[me.role] ?? [];
  const scopeNeeded = newRole ? SCOPE_OF[newRole] : null;

  // A unit_admin caller creates users in their own unit and never names it; everyone
  // else has to. Organizations that already have an admin, and units that already have
  // one, are left out of the picker rather than offered and refused with a 409.
  const scopeOptions = useMemo(() => {
    if (scopeNeeded === "organization") {
      const taken = new Set(
        accounts.filter((a) => a.role === "org_admin").map((a) => a.organization_id)
      );
      return orgs.filter((org) => !taken.has(org.id)).map((org) => ({ id: org.id, label: org.name }));
    }
    if (scopeNeeded === "unit") {
      const taken = new Set(accounts.filter((a) => a.role === "unit_admin").map((a) => a.unit_id));
      return units
        .filter((unit) => newRole !== "unit_admin" || !taken.has(unit.id))
        .map((unit) => ({
          id: unit.id,
          label: orgsById[unit.organization_id]
            ? `${unit.name} — ${orgsById[unit.organization_id].name}`
            : unit.name,
        }));
    }
    return [];
  }, [scopeNeeded, newRole, accounts, orgs, units, orgsById]);

  // The caller's own unit is the answer when they have exactly one and the endpoint
  // lets them leave it out — a unit_admin making a user.
  const scopeIsImplicit = scopeNeeded === "unit" && isUnitAdmin;

  function openAddDialog() {
    const only = creatableRoles.length === 1 ? creatableRoles[0] : "";
    setNewRole(only);
    setNewScopeId("");
    setAdding(true);
  }

  function submitNewAccount(body, done) {
    const scopeId = Number(newScopeId);
    const calls = {
      super_admin: () => createSuperAdmin(body),
      org_admin: () => createOrgAdmin({ ...body, organization_id: scopeId }),
      unit_admin: () => createUnitAdmin({ ...body, unit_id: scopeId }),
      user: () => createUser(scopeIsImplicit ? body : { ...body, unit_id: scopeId }),
    };
    return runAction(
      calls[newRole],
      `حساب «${body.username}» با نقش ${ROLE_LABELS[newRole]} ایجاد شد.`,
      done
    );
  }

  const canSubmitNew =
    !!newRole && (scopeNeeded === null || scopeIsImplicit || newScopeId !== "");

  return (
    <>
      <PageToolbar
        title="مدیریت حساب‌ها"
        hint="برای محدودسازی دسترسی کاربران، می‌توانید حساب آنان را مسدود نمایید."
        action={
          creatableRoles.length
            ? { label: "افزودن حساب جدید", onClick: openAddDialog }
            : undefined
        }
      >
        <Badge tone="neutral">{faNumber(listed.length)} حساب</Badge>
      </PageToolbar>

      <Card>
        {!isUnitAdmin && (
          <div className="flex items-end gap-3 flex-wrap mb-5 pb-5 border-b border-slate-200">
            {isSuper && (
              <span className="flex items-center gap-2">
                <label className="text-sm text-slate-600">سازمان:</label>
                <Select
                  value={orgFilter}
                  onChange={(e) => {
                    setOrgFilter(e.target.value);
                    setUnitFilter("");
                  }}
                  className="min-w-44"
                >
                  <option value="">همه</option>
                  {orgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </span>
            )}
            <span className="flex items-center gap-2">
              <label className="text-sm text-slate-600">واحد:</label>
              <Select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="min-w-44"
              >
                <option value="">همه</option>
                {unitOptions.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </Select>
            </span>
          </div>
        )}

        <AccountsTable
          accounts={listed}
          me={me}
          units={units}
          unitsById={unitsById}
          orgs={orgs}
          orgsById={orgsById}
          busy={busy}
          onBlock={(a, done) =>
            runAction(() => blockAccount(a.id), `حساب «${a.username}» مسدود شد.`, done)
          }
          onUnblock={(a) =>
            runAction(() => unblockAccount(a.id), `حساب «${a.username}» رفع مسدودی شد.`)
          }
          onResetPassword={(a, password, done) =>
            runAction(
              () => resetPassword({ id: a.id, password }),
              `رمز «${a.username}» تغییر کرد.`,
              done
            )
          }
          onChangeOwnPassword={(values, done) =>
            runAction(() => changeOwnPassword(values), "رمز شما تغییر کرد.", done)
          }
          onMove={(a, destination, done) =>
            runAction(
              () => moveAccount({ id: a.id, unitId: destination }),
              `«${a.username}» به واحد «${unitsById[destination]?.name ?? destination}» منتقل شد.`,
              done
            )
          }
          onMoveOrganization={(a, destination, done) =>
            runAction(
              () => moveAccountOrganization({ id: a.id, organizationId: destination }),
              `«${a.username}» به سازمان «${orgsById[destination]?.name ?? destination}» منتقل شد.`,
              done
            )
          }
          onDelete={(a, done) =>
            runAction(() => deleteAccount(a.id), `حساب «${a.username}» حذف شد.`, done)
          }
        />
      </Card>

      <CredentialsDialog
        open={adding}
        title="افزودن حساب"
        hint="نقش تعیین می‌کند حساب در کدام سطح قرار می‌گیرد و چه حساب‌هایی ایجاد می‌کند. در این فهرست تنها نقش‌هایی نمایش داده می‌شود که مجاز به ایجاد آن‌ها هستید."
        submitLabel="افزودن حساب"
        busy={creating}
        disabled={!canSubmitNew}
        onClose={() => setAdding(false)}
        onSubmit={submitNewAccount}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">نقش</label>
            <Select
              value={newRole}
              onChange={(e) => {
                setNewRole(e.target.value);
                setNewScopeId("");
              }}
              className="w-full h-11"
            >
              <option value="">— انتخاب نمایید —</option>
              {creatableRoles.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
          </div>

          {scopeNeeded && !scopeIsImplicit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {scopeNeeded === "organization" ? "سازمان" : "واحد"}
              </label>
              <Select
                value={newScopeId}
                onChange={(e) => setNewScopeId(e.target.value)}
                className="w-full h-11"
              >
                <option value="">— انتخاب نمایید —</option>
                {scopeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {scopeOptions.length === 0 && (
                <span className="text-xs text-amber-600">
                  {newRole === "org_admin"
                    ? "تمامی سازمان‌ها دارای ادمین هستند؛ هر سازمان تنها یک ادمین می‌پذیرد."
                    : newRole === "unit_admin"
                      ? "تمامی واحدها دارای ادمین هستند؛ هر واحد تنها یک ادمین می‌پذیرد."
                      : "تاکنون واحدی ایجاد نشده است."}
                </span>
              )}
            </div>
          )}

          {scopeIsImplicit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">واحد</label>
              <div className="h-11 px-4 flex items-center rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500">
                {me.unit?.name ?? "واحد شما"}
              </div>
            </div>
          )}
        </div>
      </CredentialsDialog>
    </>
  );
}
