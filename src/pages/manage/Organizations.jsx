import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import { CredentialsForm, DeleteConfirm, NameForm } from "@components/manage/Forms";
import {
  useAccountsQuery,
  useCreateOrgAdminMutation,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useOrganizationsQuery,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// The top of the tenancy, and only a super_admin's business — the route is gated on
// that, and the API refuses it anyway.
//
// An organization's admin is created from the row it belongs to rather than from a
// form asking which organization: the row already is the answer, and the API accepts
// exactly one admin per organization, so the row disappears as an option once filled.
export default function Organizations() {
  const [confirming, setConfirming] = useState(null);
  const [addingAdminTo, setAddingAdminTo] = useState(null);

  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: units = [] } = useUnitsQuery();
  const { data: accounts = [] } = useAccountsQuery();

  const [createOrganization, { isLoading: creating }] = useCreateOrganizationMutation();
  const [deleteOrganization, { isLoading: deleting }] = useDeleteOrganizationMutation();
  const [createOrgAdmin, { isLoading: addingAdmin }] = useCreateOrgAdminMutation();
  const busy = creating || deleting || addingAdmin;

  const adminOf = (id) =>
    accounts.find((a) => a.role === "org_admin" && a.organization_id === id);
  const unitCountOf = (id) => units.filter((u) => u.organization_id === id).length;

  return (
    <>
      <Card title="ساخت سازمان" hint="سازمان بالاترین سطح است؛ واحدها و ادمین سازمان زیر آن ساخته می‌شوند">
        <NameForm
          label="ثبت سازمان"
          fieldLabel="نام سازمان"
          placeholder="مثلاً: ستاد مرکزی"
          busy={busy}
          onSubmit={(name, reset) =>
            runAction(() => createOrganization(name), `سازمان «${name}» ساخته شد.`, reset)
          }
        />
      </Card>

      <Card
        title="سازمان‌ها"
        hint="حذف سازمان فقط وقتی ممکن است که هیچ واحد و هیچ حسابی در آن نمانده باشد"
        actions={<Badge tone="neutral">{faNumber(orgs.length)} سازمان</Badge>}
      >
        {orgs.length === 0 && <p className="text-sm text-slate-500">هنوز سازمانی ساخته نشده است.</p>}

        <div className="flex flex-col">
          {orgs.map((org) => {
            const admin = adminOf(org.id);
            const open = addingAdminTo === org.id;

            return (
              <div key={org.id} className="py-4 border-t border-slate-200 first:border-t-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-3 flex-wrap">
                    <strong className="text-sm text-slate-800">{org.name}</strong>
                    <span className="text-xs text-slate-500">
                      {faNumber(unitCountOf(org.id))} واحد
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
                          onClick: () => setAddingAdminTo(open ? null : org.id),
                        }}
                      >
                        {open ? "بستن" : "تعریف ادمین سازمان"}
                      </Button>
                    )}
                    <DeleteConfirm
                      item={org}
                      noun="سازمان"
                      asking={confirming === org.id}
                      busy={busy}
                      onAsk={() => setConfirming(org.id)}
                      onCancel={() => setConfirming(null)}
                      onConfirm={() =>
                        runAction(
                          () => deleteOrganization(org.id),
                          `سازمان «${org.name}» حذف شد.`,
                          () => setConfirming(null)
                        )
                      }
                    />
                  </span>
                </div>

                {open && !admin && (
                  <div className="mt-4 px-4 py-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-4 leading-7">
                      ادمین سازمان «{org.name}» — واحدهای این سازمان و ادمین هر واحد را او
                      می‌سازد. هر سازمان فقط یک ادمین دارد.
                    </p>
                    <CredentialsForm
                      label="ثبت ادمین سازمان"
                      busy={busy}
                      onSubmit={(body, reset) =>
                        runAction(
                          () => createOrgAdmin({ ...body, organization_id: org.id }),
                          `ادمین سازمان «${org.name}» ساخته شد.`,
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
