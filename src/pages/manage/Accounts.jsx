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
  useCreateUserMutation,
  useDeleteAccountMutation,
  useMoveAccountOrganizationMutation,
  useOrganizationsQuery,
  useRenameAccountMutation,
  useResetPasswordMutation,
  useUnblockAccountMutation,
} from "@services/accountsApi";
import { useChangeOwnNameMutation, useChangeOwnPasswordMutation } from "@services/authApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Every user the caller may act on, in one table — and the one place any of them is
// created. The three creation endpoints differ only in which scope they need, so they
// are one dialog with a role picker rather than three forms on three pages.
//
// The filter is about what to look at, not about privacy: the server has already scoped
// the list, so an org_admin's «همه سازمان‌ها» is only ever its own.

// Which roles each role may create — the provisioning chain of src/routers/accounts.py,
// read as a table. An org_admin staffs its own organization and nothing else.
const CREATABLE = {
  super_admin: ["super_admin", "org_admin", "user"],
  org_admin: ["user"],
};

// What each new role has to be given besides a username and a password. A super_admin
// belongs to nothing, so it needs neither.
const SCOPE_OF = {
  super_admin: null,
  org_admin: "organization",
  user: "organization",
};

export default function Accounts() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [orgFilter, setOrgFilter] = useState("");

  const [adding, setAdding] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newScopeId, setNewScopeId] = useState("");

  const { data: accounts = [] } = useAccountsQuery();
  const { data: orgs = [] } = useOrganizationsQuery();

  const [blockAccount, { isLoading: b1 }] = useBlockAccountMutation();
  const [unblockAccount, { isLoading: b2 }] = useUnblockAccountMutation();
  const [resetPassword, { isLoading: b3 }] = useResetPasswordMutation();
  const [deleteAccount, { isLoading: b5 }] = useDeleteAccountMutation();
  const [moveAccountOrganization, { isLoading: b6 }] = useMoveAccountOrganizationMutation();
  const [changeOwnPassword, { isLoading: b7 }] = useChangeOwnPasswordMutation();
  const [renameAccount, { isLoading: b8 }] = useRenameAccountMutation();
  const [changeOwnName, { isLoading: b9 }] = useChangeOwnNameMutation();
  const [createSuperAdmin, { isLoading: c1 }] = useCreateSuperAdminMutation();
  const [createOrgAdmin, { isLoading: c2 }] = useCreateOrgAdminMutation();
  const [createUser, { isLoading: c4 }] = useCreateUserMutation();
  const busy = b1 || b2 || b3 || b5 || b6 || b7 || b8 || b9;
  const creating = c1 || c2 || c4;

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));

  const organizationId = orgFilter === "" ? null : Number(orgFilter);
  const listed = accounts.filter(
    (account) => organizationId == null || account.organization_id === organizationId
  );

  const creatableRoles = CREATABLE[me.role] ?? [];
  const scopeNeeded = newRole ? SCOPE_OF[newRole] : null;

  // Organizations that already have an admin are left out of the picker rather than
  // offered and refused with a 409. An ordinary user has no such rule — an organization
  // takes one admin and any number of users.
  const scopeOptions = useMemo(() => {
    if (scopeNeeded !== "organization") return [];
    const taken = new Set(
      accounts.filter((a) => a.role === "org_admin").map((a) => a.organization_id)
    );
    return orgs
      .filter((org) => newRole !== "org_admin" || !taken.has(org.id))
      .map((org) => ({ id: org.id, label: org.name }));
  }, [scopeNeeded, newRole, accounts, orgs]);

  // The caller's own organization is the answer when the endpoint lets them leave it
  // out — an org_admin making a user.
  const scopeIsImplicit = scopeNeeded === "organization" && !isSuper;

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
      user: () => createUser(scopeIsImplicit ? body : { ...body, organization_id: scopeId }),
    };
    return runAction(
      calls[newRole],
      `کاربر «${body.username}» با نقش ${ROLE_LABELS[newRole]} ایجاد شد.`,
      done
    );
  }

  // «ویرایش کاربر» is one dialog over as many as two endpoints — the name, and the move
  // the dialog only offers when the caller may make one. They are separate requests
  // because they are separate decisions on the server; the dialog closes when both have
  // gone through, and stays open on the first failure with the server's own message.
  async function saveAccount(a, { first_name, last_name, organizationId }, done) {
    const renamed =
      first_name !== (a.first_name ?? "") || last_name !== (a.last_name ?? "");
    // An account fixes its own name through `/auth/name`; nobody may act on their own
    // row through `/accounts/{id}/*`, which is the rule this one endpoint exists beside.
    const rename = () =>
      a.id === me.id
        ? changeOwnName({ first_name, last_name })
        : renameAccount({ id: a.id, first_name, last_name });

    if (renamed && !(await runAction(rename, `نام «${a.username}» ثبت شد.`))) return;

    if (organizationId != null) {
      const moved = await runAction(
        () => moveAccountOrganization({ id: a.id, organizationId }),
        `«${a.username}» به سازمان «${orgsById[organizationId]?.name ?? organizationId}» منتقل شد.`
      );
      if (!moved) return;
    } else if (!renamed) {
      // Nothing was touched: close quietly rather than report a change that never happened.
      done?.();
      return;
    }

    done?.();
  }

  const canSubmitNew =
    !!newRole && (scopeNeeded === null || scopeIsImplicit || newScopeId !== "");

  return (
    <>
      <PageToolbar
        title="مدیریت کاربران"
        hint="برای محدودسازی دسترسی کاربران، می‌توانید آنان را مسدود نمایید."
        action={
          creatableRoles.length
            ? { label: "افزودن کاربر جدید", onClick: openAddDialog }
            : undefined
        }
      >
        <Badge tone="neutral">{faNumber(listed.length)} کاربر</Badge>
      </PageToolbar>

      <Card>
        {isSuper && (
          <div className="flex items-end gap-3 flex-wrap mb-5 pb-5 border-b border-slate-200">
            <span className="flex items-center gap-2">
              <label className="text-sm text-slate-600">سازمان:</label>
              <Select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
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
          </div>
        )}

        <AccountsTable
          accounts={listed}
          me={me}
          orgs={orgs}
          orgsById={orgsById}
          busy={busy}
          onBlock={(a, done) =>
            runAction(() => blockAccount(a.id), `کاربر «${a.username}» مسدود شد.`, done)
          }
          onUnblock={(a) =>
            runAction(() => unblockAccount(a.id), `کاربر «${a.username}» رفع مسدودی شد.`)
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
          onSaveAccount={saveAccount}
          onDelete={(a, done) =>
            runAction(() => deleteAccount(a.id), `کاربر «${a.username}» حذف شد.`, done)
          }
        />
      </Card>

      <CredentialsDialog
        open={adding}
        title="افزودن کاربر"
        hint="نقش تعیین می‌کند کاربر در کدام سطح قرار می‌گیرد و چه کاربرانی ایجاد می‌کند. در این فهرست تنها نقش‌هایی نمایش داده می‌شود که مجاز به ایجاد آن‌ها هستید."
        submitLabel="افزودن کاربر"
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
              <label className="text-sm font-medium text-slate-700">سازمان</label>
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
                    : "تاکنون سازمانی ایجاد نشده است."}
                </span>
              )}
            </div>
          )}

          {scopeIsImplicit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">سازمان</label>
              <div className="h-11 px-4 flex items-center rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500">
                {me.organization?.name ?? "سازمان شما"}
              </div>
            </div>
          )}
        </div>
      </CredentialsDialog>
    </>
  );
}
