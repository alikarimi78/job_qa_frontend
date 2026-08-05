import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import AccountsTable from "@components/AccountsTable";
import { CredentialsForm } from "@components/manage/Forms";
import {
  useAccountsQuery,
  useBlockAccountMutation,
  useCreateSuperAdminMutation,
  useDeleteAccountMutation,
  useMoveAccountMutation,
  useOrganizationsQuery,
  useResetPasswordMutation,
  useUnblockAccountMutation,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Every account the caller may act on, in one table — the roster, as against the four
// pages that create things. The row actions are the same question creation asks: you
// may act on the accounts you could have created, and never on your own.
//
// The filters are about what to look at, not about privacy: the server has already
// scoped the list, so an org_admin's «همه سازمان‌ها» is only ever its own.
export default function Accounts() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";
  const isUnitAdmin = me.role === "unit_admin";

  const [orgFilter, setOrgFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

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
  const [createSuperAdmin, { isLoading: b6 }] = useCreateSuperAdminMutation();
  const busy = b1 || b2 || b3 || b4 || b5 || b6;

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

  return (
    <>
      <Card
        title="حساب‌ها"
        hint="مسدودکردن چیزی را حذف نمی‌کند؛ فقط ورود آن حساب رد می‌شود — بی‌درنگ، حتی اگر توکن معتبری در دست داشته باشد. حذف برگشت‌پذیر نیست، ولی پیشنهادهای شغلی آن حساب در دیتاست باقی می‌مانند."
        actions={<Badge tone="neutral">{faNumber(listed.length)} حساب</Badge>}
      >
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
          orgsById={orgsById}
          busy={busy}
          onBlock={(a) => runAction(() => blockAccount(a.id), `حساب «${a.username}» مسدود شد.`)}
          onUnblock={(a) =>
            runAction(() => unblockAccount(a.id), `حساب «${a.username}» رفع مسدودی شد.`)
          }
          onResetPassword={(a, password, reset) =>
            runAction(
              () => resetPassword({ id: a.id, password }),
              `رمز «${a.username}» تغییر کرد.`,
              reset
            )
          }
          onMove={(a, destination, reset) =>
            runAction(
              () => moveAccount({ id: a.id, unitId: destination }),
              `«${a.username}» به واحد «${unitsById[destination]?.name ?? destination}» منتقل شد.`,
              reset
            )
          }
          onDelete={(a, reset) =>
            runAction(() => deleteAccount(a.id), `حساب «${a.username}» حذف شد.`, reset)
          }
        />
      </Card>

      {isSuper && (
        <Card
          title="سوپر ادمین‌ها"
          hint="سوپر ادمین به همه سازمان‌ها دسترسی دارد و تنها نقشی است که پیشنهادهای شغلی را تأیید می‌کند. فقط یک سوپر ادمین می‌تواند سوپر ادمین تازه بسازد."
        >
          <CredentialsForm
            label="ثبت سوپر ادمین"
            busy={busy}
            onSubmit={(body, reset) =>
              runAction(() => createSuperAdmin(body), "سوپر ادمین ساخته شد.", reset)
            }
          />
        </Card>
      )}
    </>
  );
}
