import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import { CredentialsForm } from "@components/manage/Forms";
import { ROLE_LABELS } from "@routes/roles";
import {
  useAccountsQuery,
  useCreateUserMutation,
  useOrganizationsQuery,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Ordinary users, made by the unit_admin who runs their unit — or by a super_admin
// standing in, who has to say which unit.
//
// An org_admin is deliberately absent from this page, exactly as it is from the API:
// it creates the units and their admins, and those admins staff their own unit.
export default function Users() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [unitId, setUnitId] = useState("");

  const { data: units = [] } = useUnitsQuery();
  const { data: orgs = [] } = useOrganizationsQuery(undefined, { skip: !isSuper });
  const { data: accounts = [] } = useAccountsQuery();
  const [createUser, { isLoading: busy }] = useCreateUserMutation();

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const targetUnitId = isSuper ? (unitId === "" ? null : Number(unitId)) : me.unit_id;
  const targetUnit = units.find((u) => u.id === targetUnitId) ?? null;

  const roster = targetUnitId == null ? [] : accounts.filter((a) => a.unit_id === targetUnitId);

  function unitLabel(unit) {
    const org = orgsById[unit.organization_id];
    return org ? `${unit.name} — ${org.name}` : unit.name;
  }

  return (
    <>
      <Card
        title="ساخت کاربر"
        hint="کاربر عادی جستجو می‌کند و شغل پیشنهاد می‌دهد؛ هیچ حسابی نمی‌سازد"
      >
        {isSuper && (
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <label className="text-sm text-slate-600">واحد:</label>
            <Select value={unitId} onChange={(e) => setUnitId(e.target.value)} className="min-w-60">
              <option value="">— انتخاب کنید —</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unitLabel(unit)}
                </option>
              ))}
            </Select>
          </div>
        )}

        {targetUnitId == null ? (
          <p className="text-sm text-slate-500">
            برای ساخت کاربر، ابتدا واحد او را انتخاب کنید.
          </p>
        ) : (
          <CredentialsForm
            label="ثبت کاربر"
            busy={busy}
            hint={`کاربر تازه در واحد «${targetUnit?.name ?? me.unit?.name ?? ""}» ساخته می‌شود.`}
            onSubmit={(body, reset) =>
              runAction(
                () => createUser(isSuper ? { ...body, unit_id: targetUnitId } : body),
                "کاربر ساخته شد.",
                reset
              )
            }
          />
        )}
      </Card>

      {targetUnitId != null && (
        <Card
          title={`اعضای واحد ${targetUnit?.name ?? me.unit?.name ?? ""}`}
          hint="مسدودکردن، تغییر رمز، انتقال و حذف در بخش «حساب‌ها» انجام می‌شود"
          actions={<Badge tone="neutral">{faNumber(roster.length)} حساب</Badge>}
        >
          {roster.length === 0 ? (
            <p className="text-sm text-slate-500">هنوز حسابی در این واحد ثبت نشده است.</p>
          ) : (
            <div className="flex flex-col">
              {roster.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between gap-3 flex-wrap py-3
                             border-t border-slate-200 first:border-t-0"
                >
                  <span
                    className={`text-sm ${
                      account.is_active ? "text-slate-800" : "text-slate-400 line-through"
                    }`}
                  >
                    {account.username}
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge tone={account.role === "unit_admin" ? "accent" : "neutral"}>
                      {ROLE_LABELS[account.role] ?? account.role}
                    </Badge>
                    {!account.is_active && <Badge tone="danger">مسدود</Badge>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
