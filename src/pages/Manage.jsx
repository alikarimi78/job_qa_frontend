import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Badge from "@components/ui/Badge";
import Loader from "@components/ui/Loader";
import AccountsTable from "@components/AccountsTable";
import { ROLE_LABELS } from "@routes/roles";
import { useCurrentUserQuery } from "@services/authApi";
import {
  useAccountsQuery,
  useBlockAccountMutation,
  useCreateOrgAdminMutation,
  useCreateOrganizationMutation,
  useCreateSuperAdminMutation,
  useCreateUnitAdminMutation,
  useCreateUnitMutation,
  useCreateUserMutation,
  useDeleteAccountMutation,
  useDeleteOrganizationMutation,
  useDeleteUnitMutation,
  useMoveAccountMutation,
  useOrganizationsQuery,
  useResetPasswordMutation,
  useUnblockAccountMutation,
  useUnitsQuery,
} from "@services/accountsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// One page for the whole provisioning chain; which sections appear depends on the
// caller's role, exactly as the API's permissions do:
//   super_admin  organizations -> their admins -> units -> unit admins -> users
//   org_admin    units of their own organization -> unit admins
//   unit_admin   the users of their own unit
// Every list the page shows is already scoped by the server, so nothing here filters
// for privacy — the selections below are only about what to look at.

function CredentialsForm({ label, busy, onSubmit }) {
  const methods = useForm({ defaultValues: { username: "", password: "" } });

  return (
    <FormProvider {...methods}>
      <form
        className="flex items-start gap-2 flex-wrap"
        onSubmit={methods.handleSubmit((values) => onSubmit(values, () => methods.reset()))}
      >
        <Input
          name="username"
          placeholder="نام کاربری"
          className="w-48"
          registerProps={{
            required: "نام کاربری لازم است",
            minLength: { value: 3, message: "حداقل ۳ نویسه" },
          }}
        />
        <Input
          name="password"
          type="password"
          placeholder="رمز عبور (حداقل ۸ نویسه)"
          className="w-56"
          registerProps={{
            required: "رمز عبور لازم است",
            minLength: { value: 8, message: "حداقل ۸ نویسه" },
          }}
        />
        <Button variant="primary" className="h-11" buttonProps={{ type: "submit", disabled: busy }}>
          {label}
        </Button>
      </form>
    </FormProvider>
  );
}

function NameForm({ label, placeholder, busy, onSubmit }) {
  const methods = useForm({ defaultValues: { name: "" } });

  return (
    <FormProvider {...methods}>
      <form
        className="flex items-start gap-2 flex-wrap"
        onSubmit={methods.handleSubmit(({ name }) => onSubmit(name, () => methods.reset()))}
      >
        <Input
          name="name"
          placeholder={placeholder}
          className="w-64"
          registerProps={{
            required: "نام لازم است",
            minLength: { value: 2, message: "حداقل ۲ نویسه" },
          }}
        />
        <Button variant="primary" className="h-11" buttonProps={{ type: "submit", disabled: busy }}>
          {label}
        </Button>
      </form>
    </FormProvider>
  );
}

export default function Manage() {
  const [orgId, setOrgId] = useState(null);
  const [unitId, setUnitId] = useState(null);
  // Which organization/unit is waiting for a delete confirmation: {kind, id}
  const [confirming, setConfirming] = useState(null);

  const { data: me, isLoading: loadingMe, error: meError } = useCurrentUserQuery();
  const isSuper = me?.role === "super_admin";
  const isOrgAdmin = me?.role === "org_admin";
  const isUnitAdmin = me?.role === "unit_admin";

  // A unit_admin is not allowed to list organizations; asking anyway would only
  // produce a 403 to swallow.
  const { data: orgs = [] } = useOrganizationsQuery(undefined, { skip: !me || isUnitAdmin });
  const { data: units = [] } = useUnitsQuery(undefined, { skip: !me });
  const { data: accounts = [] } = useAccountsQuery(undefined, { skip: !me });

  const [createOrganization, { isLoading: b1 }] = useCreateOrganizationMutation();
  const [deleteOrganization, { isLoading: b2 }] = useDeleteOrganizationMutation();
  const [createUnit, { isLoading: b3 }] = useCreateUnitMutation();
  const [deleteUnit, { isLoading: b4 }] = useDeleteUnitMutation();
  const [createOrgAdmin, { isLoading: b5 }] = useCreateOrgAdminMutation();
  const [createUnitAdmin, { isLoading: b6 }] = useCreateUnitAdminMutation();
  const [createUser, { isLoading: b7 }] = useCreateUserMutation();
  const [createSuperAdmin, { isLoading: b8 }] = useCreateSuperAdminMutation();
  const [blockAccount, { isLoading: b9 }] = useBlockAccountMutation();
  const [unblockAccount, { isLoading: b10 }] = useUnblockAccountMutation();
  const [resetPassword, { isLoading: b11 }] = useResetPasswordMutation();
  const [moveAccount, { isLoading: b12 }] = useMoveAccountMutation();
  const [deleteAccount, { isLoading: b13 }] = useDeleteAccountMutation();

  const busy =
    b1 || b2 || b3 || b4 || b5 || b6 || b7 || b8 || b9 || b10 || b11 || b12 || b13;

  // Every mutation goes through here: one place to report the failure. The lists
  // refresh on their own — each mutation invalidates the tags they are cached under.
  async function act(run, message, reset) {
    try {
      await run().unwrap();
      showMessage.success(message);
      reset?.();
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  if (loadingMe) return <Loader />;
  if (meError) {
    return (
      <Card>
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage(meError)}
        </div>
      </Card>
    );
  }

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const unitsById = Object.fromEntries(units.map((u) => [u.id, u]));
  const scopedOrgId = isOrgAdmin ? me.organization_id : orgId;
  const scopedUnitId = isUnitAdmin ? me.unit_id : unitId;
  const visibleUnits =
    scopedOrgId == null ? units : units.filter((u) => u.organization_id === scopedOrgId);
  const selectedUnit = scopedUnitId != null ? unitsById[scopedUnitId] : null;

  const orgAdminOf = (id) => accounts.find((a) => a.role === "org_admin" && a.organization_id === id);
  const unitAdminOf = (id) => accounts.find((a) => a.role === "unit_admin" && a.unit_id === id);

  const asking = (kind, id) => confirming?.kind === kind && confirming?.id === id;

  // The server refuses to delete anything that still holds units or accounts, and says
  // so — the toast carries that message through unchanged.
  function confirmDelete(kind, item, label) {
    if (!asking(kind, item.id)) {
      return (
        <Button
          variant="danger-outline"
          className="h-9 px-4 text-xs"
          buttonProps={{ disabled: busy, onClick: () => setConfirming({ kind, id: item.id }) }}
        >
          حذف
        </Button>
      );
    }
    return (
      <span className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">«{item.name}» حذف شود؟</span>
        <Button
          variant="danger"
          className="h-9 px-4 text-xs"
          buttonProps={{
            disabled: busy,
            onClick: () =>
              act(
                () => (kind === "org" ? deleteOrganization(item.id) : deleteUnit(item.id)),
                `${label} «${item.name}» حذف شد.`,
                () => {
                  setConfirming(null);
                  // Stop pointing at something that is gone
                  if (kind === "org" && orgId === item.id) {
                    setOrgId(null);
                    setUnitId(null);
                  }
                  if (kind === "unit" && unitId === item.id) setUnitId(null);
                }
              ),
          }}
        >
          حذف کن
        </Button>
        <Button
          variant="ghost"
          className="h-9 px-4 text-xs"
          buttonProps={{ disabled: busy, onClick: () => setConfirming(null) }}
        >
          انصراف
        </Button>
      </span>
    );
  }

  // The table follows the selection so a large deployment stays readable
  const listed = accounts.filter((a) => {
    if (scopedUnitId != null) return a.unit_id === scopedUnitId;
    if (scopedOrgId != null) {
      return (
        a.organization_id === scopedOrgId ||
        (a.unit_id != null && unitsById[a.unit_id]?.organization_id === scopedOrgId)
      );
    }
    return true;
  });

  const rowClass =
    "flex items-center justify-between gap-3 flex-wrap py-3 border-t border-slate-200 first:border-t-0";

  return (
    <>
      <Card>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-bold text-slate-800">مدیریت حساب‌ها</h1>
          <Badge tone="accent">{ROLE_LABELS[me.role]}</Badge>
          {me.organization && <Badge tone="neutral">{me.organization.name}</Badge>}
          {me.unit && <Badge tone="neutral">{me.unit.name}</Badge>}
        </div>
      </Card>

      {isSuper && (
        <Card
          title="سازمان‌ها"
          hint="سازمان را بسازید و برای هرکدام یک ادمین سازمان تعریف کنید"
        >
          <NameForm
            label="ساخت سازمان"
            placeholder="نام سازمان"
            busy={busy}
            onSubmit={(name, reset) =>
              act(() => createOrganization(name), `سازمان «${name}» ساخته شد.`, reset)
            }
          />
          <div className="flex flex-col mt-4">
            {orgs.map((org) => {
              const admin = orgAdminOf(org.id);
              return (
                <div key={org.id} className={rowClass}>
                  <span className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant={orgId === org.id ? "primary" : "outline"}
                      className="h-9 px-4 text-xs"
                      buttonProps={{
                        onClick: () => {
                          setOrgId(orgId === org.id ? null : org.id);
                          setUnitId(null);
                        },
                      }}
                    >
                      {org.name}
                    </Button>
                    <span className="text-xs text-slate-500">
                      {admin ? `ادمین: ${admin.username}` : "ادمین ندارد"}
                    </span>
                  </span>
                  {!admin && (
                    <CredentialsForm
                      label="ساخت ادمین سازمان"
                      busy={busy}
                      onSubmit={(body, reset) =>
                        act(
                          () => createOrgAdmin({ ...body, organization_id: org.id }),
                          `ادمین سازمان «${org.name}» ساخته شد.`,
                          reset
                        )
                      }
                    />
                  )}
                  {confirmDelete("org", org, "سازمان")}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {(isSuper || isOrgAdmin) && (
        <Card title="واحدها">
          {isSuper && scopedOrgId == null ? (
            <p className="text-sm text-slate-500">
              برای ساخت واحد، ابتدا یک سازمان را از فهرست بالا انتخاب کنید.
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-3">
                واحدهای {orgsById[scopedOrgId]?.name ?? "سازمان شما"} — برای هر واحد یک ادمین واحد
              </p>
              <NameForm
                label="ساخت واحد"
                placeholder="نام واحد"
                busy={busy}
                onSubmit={(name, reset) =>
                  act(
                    () =>
                      createUnit(isSuper ? { name, organization_id: scopedOrgId } : { name }),
                    `واحد «${name}» ساخته شد.`,
                    reset
                  )
                }
              />
            </>
          )}

          <div className="flex flex-col mt-4">
            {visibleUnits.map((unit) => {
              const admin = unitAdminOf(unit.id);
              return (
                <div key={unit.id} className={rowClass}>
                  <span className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant={unitId === unit.id ? "primary" : "outline"}
                      className="h-9 px-4 text-xs"
                      buttonProps={{ onClick: () => setUnitId(unitId === unit.id ? null : unit.id) }}
                    >
                      {unit.name}
                    </Button>
                    <span className="text-xs text-slate-500">
                      {/* With no organization picked, a super admin sees every unit at
                          once — say which organization each one belongs to. */}
                      {isSuper && scopedOrgId == null && orgsById[unit.organization_id]
                        ? `${orgsById[unit.organization_id].name} · `
                        : ""}
                      {admin ? `ادمین: ${admin.username}` : "ادمین ندارد"}
                    </span>
                  </span>
                  {!admin && (
                    <CredentialsForm
                      label="ساخت ادمین واحد"
                      busy={busy}
                      onSubmit={(body, reset) =>
                        act(
                          () => createUnitAdmin({ ...body, unit_id: unit.id }),
                          `ادمین واحد «${unit.name}» ساخته شد.`,
                          reset
                        )
                      }
                    />
                  )}
                  {confirmDelete("unit", unit, "واحد")}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {(isSuper || isUnitAdmin) && (
        <Card title="کاربران">
          {isUnitAdmin ? (
            <p className="text-sm text-slate-500 mb-3">
              کاربران واحد {me.unit?.name} را اینجا تعریف کنید
            </p>
          ) : selectedUnit ? (
            <p className="text-sm text-slate-500 mb-3">
              کاربر تازه در واحد «{selectedUnit.name}» ساخته می‌شود
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              برای ساخت کاربر، ابتدا یک واحد را از فهرست بالا انتخاب کنید.
            </p>
          )}
          {(isUnitAdmin || selectedUnit) && (
            <CredentialsForm
              label="ساخت کاربر"
              busy={busy}
              onSubmit={(body, reset) =>
                act(
                  () => createUser(isUnitAdmin ? body : { ...body, unit_id: selectedUnit.id }),
                  "کاربر ساخته شد.",
                  reset
                )
              }
            />
          )}
        </Card>
      )}

      {isSuper && (
        <Card title="سوپر ادمین‌ها" hint="فقط یک سوپر ادمین می‌تواند سوپر ادمین تازه بسازد">
          <CredentialsForm
            label="ساخت سوپر ادمین"
            busy={busy}
            onSubmit={(body, reset) =>
              act(() => createSuperAdmin(body), "سوپر ادمین ساخته شد.", reset)
            }
          />
        </Card>
      )}

      <Card
        title="حساب‌ها"
        hint={`مسدودکردن حساب چیزی را حذف نمی‌کند؛ فقط ورود آن حساب رد می‌شود — بی‌درنگ، حتی اگر توکن معتبری در دست داشته باشد. حذف برگشت‌پذیر نیست، ولی پیشنهادهای شغلی آن حساب در دیتاست باقی می‌مانند.${
          scopedUnitId != null || scopedOrgId != null ? " (محدود به انتخاب بالا)" : ""
        }`}
      >
        <AccountsTable
          accounts={listed}
          me={me}
          units={units}
          unitsById={unitsById}
          orgsById={orgsById}
          busy={busy}
          onBlock={(a) =>
            act(() => blockAccount(a.id), `حساب «${a.username}» مسدود شد.`)
          }
          onUnblock={(a) =>
            act(() => unblockAccount(a.id), `حساب «${a.username}» رفع مسدودی شد.`)
          }
          onResetPassword={(a, password, reset) =>
            act(
              () => resetPassword({ id: a.id, password }),
              `رمز «${a.username}» تغییر کرد.`,
              reset
            )
          }
          onMove={(a, destination, reset) =>
            act(
              () => moveAccount({ id: a.id, unitId: destination }),
              `«${a.username}» به واحد «${unitsById[destination]?.name ?? destination}» منتقل شد.`,
              reset
            )
          }
          onDelete={(a, reset) =>
            act(() => deleteAccount(a.id), `حساب «${a.username}» حذف شد.`, reset)
          }
        />
      </Card>
    </>
  );
}
