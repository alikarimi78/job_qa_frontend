import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import DataTable, { RowActions } from "@components/ui/DataTable";
import PageToolbar from "@components/ui/PageToolbar";
import IconButton, {
  EyeGlyph,
  PencilGlyph,
  TrashGlyph,
  UserPlusGlyph,
} from "@components/ui/IconButton";
import {
  ConfirmDialog,
  CredentialsDialog,
  DetailsDialog,
  NameDialog,
} from "@components/manage/Forms";
import {
  useAccountsQuery,
  useCreateUnitAdminMutation,
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useOrganizationsQuery,
  useRenameUnitMutation,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// Units, for the two roles that decide whether one exists. An org_admin works inside
// its own organization and is never asked which — the API would refuse another one
// anyway. A super_admin has no organization of its own to default to, so it picks one,
// and until it does there is nothing to create a unit in.
//
// A unit_admin does not reach this page: they staff a unit, they do not decide whether
// it exists — and, since `PATCH /units/{id}` draws the same line, they do not rename
// one either.
//
// Same shape as the organizations page: toolbar → dialog, table, round row actions.
export default function Units() {
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [orgId, setOrgId] = useState("");
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;

  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: units = [] } = useUnitsQuery();
  const { data: accounts = [] } = useAccountsQuery();

  const [createUnit, { isLoading: creating }] = useCreateUnitMutation();
  const [renameUnit, { isLoading: renaming }] = useRenameUnitMutation();
  const [deleteUnit, { isLoading: deleting }] = useDeleteUnitMutation();
  const [createUnitAdmin, { isLoading: addingAdmin }] = useCreateUnitAdminMutation();

  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const selectedOrgId = isSuper ? (orgId === "" ? null : Number(orgId)) : me.organization_id;
  // The server already scopes the list to the caller; the filter is only about which
  // slice of their own units to look at.
  const listed =
    isSuper && selectedOrgId != null
      ? units.filter((u) => u.organization_id === selectedOrgId)
      : units;

  const adminOf = (unitId) => accounts.find((a) => a.role === "unit_admin" && a.unit_id === unitId);
  const accountsIn = (unitId) => accounts.filter((a) => a.unit_id === unitId).length;
  const orgNameOf = (unit) => orgsById[unit.organization_id]?.name ?? "—";

  const target = dialog?.unit ?? null;
  const targetAdmin = target ? adminOf(target.id) : null;

  // A super_admin has to say which organization the new unit goes in, and the picker
  // above the table is that answer — so the button is disabled until one is chosen
  // rather than opening a dialog that cannot be submitted.
  const canCreate = !isSuper || selectedOrgId != null;

  const columns = [
    {
      key: "name",
      header: "عنوان واحد",
      cell: (unit) => <strong className="text-sm text-slate-800">{unit.name}</strong>,
    },
    // With no organization picked a super admin sees every unit at once, and then
    // which organization each belongs to is the column that tells them apart.
    ...(isSuper
      ? [
          {
            key: "organization",
            header: "سازمان",
            cell: (unit) => <span className="text-sm text-slate-600">{orgNameOf(unit)}</span>,
          },
        ]
      : []),
    {
      key: "accounts",
      header: "تعداد حساب",
      cell: (unit) => (
        <span className="text-sm text-slate-600 fa-nums">{faNumber(accountsIn(unit.id))}</span>
      ),
    },
    {
      key: "admin",
      header: "ادمین واحد",
      cell: (unit) => {
        const admin = adminOf(unit.id);
        return admin ? (
          <Badge tone="success">{admin.username}</Badge>
        ) : (
          <Badge tone="warning">ادمین ندارد</Badge>
        );
      },
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (unit) => (
        <RowActions>
          {!adminOf(unit.id) && (
            <IconButton
              tone="neutral"
              title={`تعریف ادمین برای ${unit.name}`}
              onClick={() => setDialog({ kind: "admin", unit })}
            >
              {UserPlusGlyph}
            </IconButton>
          )}
          <IconButton
            tone="edit"
            title={`ویرایش واحد ${unit.name}`}
            onClick={() => setDialog({ kind: "edit", unit })}
          >
            {PencilGlyph}
          </IconButton>
          <IconButton
            tone="view"
            title={`مشاهده واحد ${unit.name}`}
            onClick={() => setDialog({ kind: "view", unit })}
          >
            {EyeGlyph}
          </IconButton>
          <IconButton
            tone="danger"
            title={`حذف واحد ${unit.name}`}
            onClick={() => setDialog({ kind: "delete", unit })}
          >
            {TrashGlyph}
          </IconButton>
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageToolbar
        title="مدیریت واحدها"
        hint={
          isSuper
            ? "واحد جدید در سازمانی ساخته می‌شود که در فیلتر زیر انتخاب کرده‌اید"
            : `واحدهای سازمان ${me.organization?.name ?? "شما"}`
        }
        action={{
          label: "افزودن واحد جدید",
          disabled: !canCreate,
          onClick: () => setDialog({ kind: "create" }),
        }}
      >
        <Badge tone="neutral">{faNumber(listed.length)} واحد</Badge>
      </PageToolbar>

      <Card>
        {isSuper && (
          <div className="flex items-center gap-2 flex-wrap mb-5 pb-5 border-b border-slate-200">
            <label className="text-sm text-slate-600">سازمان:</label>
            <Select value={orgId} onChange={(e) => setOrgId(e.target.value)} className="min-w-52">
              <option value="">همه سازمان‌ها</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
            {selectedOrgId == null && (
              <span className="text-xs text-slate-400">
                برای ساخت واحد جدید، ابتدا سازمان آن را انتخاب کنید.
              </span>
            )}
          </div>
        )}

        <DataTable columns={columns} rows={listed} empty="واحدی برای نمایش وجود ندارد." />
      </Card>

      <NameDialog
        open={is("create")}
        title="افزودن واحد"
        hint={
          isSuper
            ? `واحد جدید در سازمان «${orgsById[selectedOrgId]?.name ?? ""}» ساخته می‌شود.`
            : undefined
        }
        fieldLabel="نام واحد"
        placeholder="مثلاً: واحد آموزش"
        submitLabel="افزودن واحد"
        busy={creating}
        onClose={close}
        onSubmit={(name, done) =>
          runAction(
            () => createUnit(isSuper ? { name, organization_id: selectedOrgId } : { name }),
            `واحد «${name}» ساخته شد.`,
            done
          )
        }
      />

      <NameDialog
        open={is("edit")}
        title="ویرایش واحد"
        hint="واحد در همان سازمانی می‌ماند که هست؛ فقط نامش عوض می‌شود و حساب‌های داخل آن دست‌نخورده می‌مانند."
        fieldLabel="نام واحد"
        placeholder="نام جدید"
        defaultValue={target?.name ?? ""}
        submitLabel="ثبت تغییر"
        busy={renaming}
        onClose={close}
        onSubmit={(name, done) =>
          runAction(
            () => renameUnit({ id: target.id, name }),
            `نام واحد به «${name}» تغییر کرد.`,
            done
          )
        }
      />

      <DetailsDialog
        open={is("view")}
        title="مشاهده واحد"
        onClose={close}
        rows={
          target
            ? [
                { label: "نام واحد", value: target.name },
                { label: "سازمان", value: orgNameOf(target) },
                {
                  label: "ادمین واحد",
                  value: targetAdmin ? (
                    <Badge tone="success">{targetAdmin.username}</Badge>
                  ) : (
                    <Badge tone="warning">ادمین ندارد</Badge>
                  ),
                },
                { label: "تعداد حساب", value: faNumber(accountsIn(target.id)) },
              ]
            : []
        }
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف واحد"
        message={`آیا از حذف واحد «${target?.name ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. حذف تنها وقتی ممکن است که هیچ حسابی — ادمین آن هم — در واحد نمانده باشد.`}
        busy={deleting}
        onClose={close}
        onConfirm={() =>
          runAction(() => deleteUnit(target.id), `واحد «${target.name}» حذف شد.`, close)
        }
      />

      <CredentialsDialog
        open={is("admin")}
        title="تعریف ادمین واحد"
        hint={`ادمین واحد «${target?.name ?? ""}» — کاربران عادی این واحد را او می‌سازد. هر واحد فقط یک ادمین دارد.`}
        submitLabel="ثبت ادمین واحد"
        busy={addingAdmin}
        onClose={close}
        onSubmit={(body, done) =>
          runAction(
            () => createUnitAdmin({ ...body, unit_id: target.id }),
            `ادمین واحد «${target.name}» ساخته شد.`,
            done
          )
        }
      />
    </>
  );
}
