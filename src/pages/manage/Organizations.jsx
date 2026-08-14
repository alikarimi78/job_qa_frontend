import { useState } from "react";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
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
  useCreateOrgAdminMutation,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useOrganizationsQuery,
  useRenameOrganizationMutation,
  useUnitsQuery,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faNumber } from "@utils/jalali";

// The top of the tenancy, and only a super_admin's business — the route is gated on
// that, and the API refuses it anyway.
//
// Built on the pattern the customer's admin_panel.mp4 uses everywhere: a toolbar whose
// one green button opens a dialog, a table under it, and a «عملیات‌ها» column of round
// buttons that each open a dialog of their own. Nothing is edited in place.
//
// An organization's admin is still created from the row it belongs to rather than from
// a form asking which organization: the row already is the answer, and the API accepts
// exactly one admin per organization — so the fourth button appears only while the
// seat is empty.
export default function Organizations() {
  // One dialog at a time: {kind: create|edit|view|delete|admin, org}
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;

  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: units = [] } = useUnitsQuery();
  const { data: accounts = [] } = useAccountsQuery();

  const [createOrganization, { isLoading: creating }] = useCreateOrganizationMutation();
  const [renameOrganization, { isLoading: renaming }] = useRenameOrganizationMutation();
  const [deleteOrganization, { isLoading: deleting }] = useDeleteOrganizationMutation();
  const [createOrgAdmin, { isLoading: addingAdmin }] = useCreateOrgAdminMutation();

  const adminOf = (id) =>
    accounts.find((a) => a.role === "org_admin" && a.organization_id === id);
  const unitCountOf = (id) => units.filter((u) => u.organization_id === id).length;
  const accountCountOf = (id) => {
    const own = new Set(units.filter((u) => u.organization_id === id).map((u) => u.id));
    return accounts.filter(
      (a) => a.organization_id === id || (a.unit_id != null && own.has(a.unit_id))
    ).length;
  };

  const target = dialog?.org ?? null;
  const targetAdmin = target ? adminOf(target.id) : null;

  const columns = [
    {
      key: "name",
      header: "عنوان سازمان",
      cell: (org) => <strong className="text-sm text-slate-800">{org.name}</strong>,
    },
    {
      key: "units",
      header: "تعداد واحد",
      cell: (org) => (
        <span className="text-sm text-slate-600 fa-nums">{faNumber(unitCountOf(org.id))}</span>
      ),
    },
    {
      key: "accounts",
      header: "تعداد حساب",
      cell: (org) => (
        <span className="text-sm text-slate-600 fa-nums">{faNumber(accountCountOf(org.id))}</span>
      ),
    },
    {
      key: "admin",
      header: "ادمین سازمان",
      cell: (org) => {
        const admin = adminOf(org.id);
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
      cell: (org) => (
        <RowActions>
          {!adminOf(org.id) && (
            <IconButton
              tone="neutral"
              title={`تعریف ادمین برای ${org.name}`}
              onClick={() => setDialog({ kind: "admin", org })}
            >
              {UserPlusGlyph}
            </IconButton>
          )}
          <IconButton
            tone="edit"
            title={`ویرایش سازمان ${org.name}`}
            onClick={() => setDialog({ kind: "edit", org })}
          >
            {PencilGlyph}
          </IconButton>
          <IconButton
            tone="view"
            title={`مشاهده سازمان ${org.name}`}
            onClick={() => setDialog({ kind: "view", org })}
          >
            {EyeGlyph}
          </IconButton>
          <IconButton
            tone="danger"
            title={`حذف سازمان ${org.name}`}
            onClick={() => setDialog({ kind: "delete", org })}
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
        title="مدیریت سازمان‌ها"
        hint="سازمان بالاترین سطح است؛ واحدها و ادمین سازمان زیر آن ساخته می‌شوند"
        action={{ label: "افزودن سازمان جدید", onClick: () => setDialog({ kind: "create" }) }}
      >
        <Badge tone="neutral">{faNumber(orgs.length)} سازمان</Badge>
      </PageToolbar>

      <Card>
        <DataTable
          columns={columns}
          rows={orgs}
          empty="هنوز سازمانی ساخته نشده است."
        />
      </Card>

      <NameDialog
        open={is("create")}
        title="افزودن سازمان"
        fieldLabel="نام سازمان"
        placeholder="مثلاً: ستاد مرکزی"
        submitLabel="افزودن سازمان"
        busy={creating}
        onClose={close}
        onSubmit={(name, done) =>
          runAction(() => createOrganization(name), `سازمان «${name}» ساخته شد.`, done)
        }
      />

      <NameDialog
        open={is("edit")}
        title="ویرایش سازمان"
        hint="تنها چیزی که یک سازمان دارد و قابل تغییر است، نام آن است؛ واحدها و حساب‌های زیر آن دست‌نخورده می‌مانند."
        fieldLabel="نام سازمان"
        placeholder="نام تازه"
        defaultValue={target?.name ?? ""}
        submitLabel="ثبت تغییر"
        busy={renaming}
        onClose={close}
        onSubmit={(name, done) =>
          runAction(
            () => renameOrganization({ id: target.id, name }),
            `نام سازمان به «${name}» تغییر کرد.`,
            done
          )
        }
      />

      <DetailsDialog
        open={is("view")}
        title="مشاهده سازمان"
        onClose={close}
        rows={
          target
            ? [
                { label: "نام سازمان", value: target.name },
                {
                  label: "ادمین سازمان",
                  value: targetAdmin ? (
                    <Badge tone="success">{targetAdmin.username}</Badge>
                  ) : (
                    <Badge tone="warning">ادمین ندارد</Badge>
                  ),
                },
                { label: "تعداد واحد", value: faNumber(unitCountOf(target.id)) },
                { label: "تعداد حساب", value: faNumber(accountCountOf(target.id)) },
              ]
            : []
        }
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف سازمان"
        message={`آیا از حذف سازمان «${target?.name ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. حذف تنها وقتی ممکن است که هیچ واحد و هیچ حسابی در آن نمانده باشد.`}
        busy={deleting}
        onClose={close}
        onConfirm={() =>
          runAction(
            () => deleteOrganization(target.id),
            `سازمان «${target.name}» حذف شد.`,
            close
          )
        }
      />

      <CredentialsDialog
        open={is("admin")}
        title="تعریف ادمین سازمان"
        hint={`ادمین سازمان «${target?.name ?? ""}» — واحدهای این سازمان و ادمین هر واحد را او می‌سازد. هر سازمان فقط یک ادمین دارد.`}
        submitLabel="ثبت ادمین سازمان"
        busy={addingAdmin}
        onClose={close}
        onSubmit={(body, done) =>
          runAction(
            () => createOrgAdmin({ ...body, organization_id: target.id }),
            `ادمین سازمان «${target.name}» ساخته شد.`,
            done
          )
        }
      />
    </>
  );
}
