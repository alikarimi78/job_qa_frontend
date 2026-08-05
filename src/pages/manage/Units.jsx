import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import { CredentialsForm, DeleteConfirm, NameForm } from "@components/manage/Forms";
import {
  useAccountsQuery,
  useCreateUnitAdminMutation,
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useOrganizationsQuery,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Units, for the two roles that decide whether one exists. An org_admin works inside
// its own organization and is never asked which — the API would refuse another one
// anyway. A super_admin has no organization of its own to default to, so it picks one
// here, and until it does there is nothing to create a unit in.
//
// A unit_admin does not reach this page: they staff a unit, they do not decide whether
// it exists. That is the same line the API draws.
export default function Units() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [orgId, setOrgId] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [addingAdminTo, setAddingAdminTo] = useState(null);

  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: units = [] } = useUnitsQuery();
  const { data: accounts = [] } = useAccountsQuery();

  const [createUnit, { isLoading: creating }] = useCreateUnitMutation();
  const [deleteUnit, { isLoading: deleting }] = useDeleteUnitMutation();
  const [createUnitAdmin, { isLoading: addingAdmin }] = useCreateUnitAdminMutation();
  const busy = creating || deleting || addingAdmin;

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const selectedOrgId = isSuper ? (orgId === "" ? null : Number(orgId)) : me.organization_id;
  // The server already scopes the list to the caller; the filter is only about which
  // slice of their own units to look at.
  const listed = isSuper && selectedOrgId != null
    ? units.filter((u) => u.organization_id === selectedOrgId)
    : units;

  const adminOf = (unitId) => accounts.find((a) => a.role === "unit_admin" && a.unit_id === unitId);
  const accountsIn = (unitId) => accounts.filter((a) => a.unit_id === unitId).length;

  return (
    <>
      <Card
        title="ساخت واحد"
        hint={
          isSuper
            ? "واحد تازه در سازمانی که انتخاب می‌کنید ساخته می‌شود"
            : `واحدهای سازمان ${me.organization?.name ?? "شما"}`
        }
      >
        {isSuper && (
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <label className="text-sm text-slate-600">سازمان:</label>
            <Select value={orgId} onChange={(e) => setOrgId(e.target.value)} className="min-w-52">
              <option value="">— انتخاب کنید —</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {isSuper && selectedOrgId == null ? (
          <p className="text-sm text-slate-500">
            برای ساخت واحد، ابتدا سازمان آن را انتخاب کنید.
          </p>
        ) : (
          <NameForm
            label="ثبت واحد"
            fieldLabel="نام واحد"
            placeholder="مثلاً: واحد آموزش"
            busy={busy}
            onSubmit={(name, reset) =>
              runAction(
                () => createUnit(isSuper ? { name, organization_id: selectedOrgId } : { name }),
                `واحد «${name}» ساخته شد.`,
                reset
              )
            }
          />
        )}
      </Card>

      <Card
        title="واحدها"
        hint="حذف واحد فقط وقتی ممکن است که هیچ حسابی — ادمین آن هم — در واحد نمانده باشد"
        actions={<Badge tone="neutral">{faNumber(listed.length)} واحد</Badge>}
      >
        {listed.length === 0 && (
          <p className="text-sm text-slate-500">واحدی برای نمایش وجود ندارد.</p>
        )}

        <div className="flex flex-col">
          {listed.map((unit) => {
            const admin = adminOf(unit.id);
            const open = addingAdminTo === unit.id;

            return (
              <div key={unit.id} className="py-4 border-t border-slate-200 first:border-t-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-3 flex-wrap">
                    <strong className="text-sm text-slate-800">{unit.name}</strong>
                    {/* With no organization picked a super admin sees every unit at
                        once — say which organization each one belongs to. */}
                    {isSuper && selectedOrgId == null && orgsById[unit.organization_id] && (
                      <span className="text-xs text-slate-500">
                        {orgsById[unit.organization_id].name}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {faNumber(accountsIn(unit.id))} حساب
                    </span>
                    {admin ? (
                      <Badge tone="success">ادمین: {admin.username}</Badge>
                    ) : (
                      <Badge tone="warning">ادمین ندارد</Badge>
                    )}
                  </span>

                  <span className="flex items-center gap-2 flex-wrap">
                    {!admin && (
                      <Button
                        variant="outline"
                        size="sm"
                        buttonProps={{
                          disabled: busy,
                          onClick: () => setAddingAdminTo(open ? null : unit.id),
                        }}
                      >
                        {open ? "بستن" : "تعریف ادمین واحد"}
                      </Button>
                    )}
                    <DeleteConfirm
                      item={unit}
                      noun="واحد"
                      asking={confirming === unit.id}
                      busy={busy}
                      onAsk={() => setConfirming(unit.id)}
                      onCancel={() => setConfirming(null)}
                      onConfirm={() =>
                        runAction(
                          () => deleteUnit(unit.id),
                          `واحد «${unit.name}» حذف شد.`,
                          () => setConfirming(null)
                        )
                      }
                    />
                  </span>
                </div>

                {open && !admin && (
                  <div className="mt-4 px-4 py-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-4 leading-7">
                      ادمین واحد «{unit.name}» — کاربران عادی این واحد را او می‌سازد. هر واحد
                      فقط یک ادمین دارد.
                    </p>
                    <CredentialsForm
                      label="ثبت ادمین واحد"
                      busy={busy}
                      onSubmit={(body, reset) =>
                        runAction(
                          () => createUnitAdmin({ ...body, unit_id: unit.id }),
                          `ادمین واحد «${unit.name}» ساخته شد.`,
                          () => {
                            reset();
                            setAddingAdminTo(null);
                          }
                        )
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
