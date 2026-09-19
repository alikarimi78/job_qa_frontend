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
  OrganizationDialog,
} from "@components/manage/Forms";
import {
  useAccountsQuery,
  useCreateOrgAdminMutation,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useOrganizationLogoQuery,
  useOrganizationsQuery,
  useUpdateOrganizationMutation,
} from "@services/accountsApi";
import { runAction } from "@utils/action";
import { faDigits, faNumber } from "@utils/jalali";

const Cell = ({ children }) => (
  <span className="text-sm text-slate-600 fa-nums">{children}</span>
);

export default function Organizations() {
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);
  const is = (kind) => dialog?.kind === kind;

  const { data: orgs = [] } = useOrganizationsQuery();
  const { data: accounts = [] } = useAccountsQuery();

  const [createOrganization, { isLoading: creating }] = useCreateOrganizationMutation();
  const [updateOrganization, { isLoading: saving }] = useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: deleting }] = useDeleteOrganizationMutation();
  const [createOrgAdmin, { isLoading: addingAdmin }] = useCreateOrgAdminMutation();

  const adminOf = (id) =>
    accounts.find((a) => a.role === "org_admin" && a.organization_id === id);
  const accountCountOf = (id) =>
    accounts.filter((a) => a.organization_id === id).length;

  const target = dialog?.org ?? null;
  const targetAdmin = target ? adminOf(target.id) : null;

  const showsLogo = is("edit") || is("view");
  const { data: logoData } = useOrganizationLogoQuery(target?.id, {
    skip: !showsLogo || !target?.has_logo,
  });
  const targetLogo = showsLogo && target?.has_logo ? logoData?.logo ?? null : null;

  const columns = [
    {
      key: "name",
      header: "عنوان سازمان",
      cell: (org) => <strong className="text-sm text-slate-800">{org.name}</strong>,
    },
    {
      key: "code",
      header: "کد سازمانی",
      cell: (org) => <Cell>{org.code ? faDigits(org.code) : "—"}</Cell>,
    },
    {
      key: "phone",
      header: "تلفن سازمان",
      cell: (org) => <Cell>{org.phone ? faDigits(org.phone) : "—"}</Cell>,
    },
    {
      key: "accounts",
      header: "تعداد کاربر",
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
        hint="سازمان بالاترین سطح است؛ ادمین سازمان و کاربران آن ذیل سازمان ایجاد می‌شوند"
        status={<Badge tone="neutral">{faNumber(orgs.length)} سازمان</Badge>}
        action={{ label: "افزودن سازمان جدید", onClick: () => setDialog({ kind: "create" }) }}
      />

      <Card>
        <DataTable
          columns={columns}
          rows={orgs}
          empty="تاکنون سازمانی ایجاد نشده است."
        />
      </Card>

      <OrganizationDialog
        open={is("create")}
        title="افزودن سازمان"
        submitLabel="افزودن سازمان"
        busy={creating}
        onClose={close}
        onSubmit={(body, done) =>
          runAction(
            () => createOrganization(body),
            `سازمان «${body.name}» ایجاد شد.`,
            done
          )
        }
      />

      <OrganizationDialog
        open={is("edit")}
        title="ویرایش سازمان"
        hint="مشخصات سازمان تغییر می‌کند؛ کاربران ذیل آن بدون تغییر باقی می‌مانند."
        submitLabel="ویرایش سازمان"
        organization={target}
        initialLogo={targetLogo}
        busy={saving}
        onClose={close}
        onSubmit={(body, done) =>
          runAction(
            () => updateOrganization({ id: target.id, ...body }),
            `مشخصات سازمان «${body.name}» ثبت شد.`,
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
                { label: "شناسه سازمان", value: target.code ? faDigits(target.code) : "—" },
                { label: "آدرس سازمان", value: target.address || "—" },
                { label: "شماره تماس", value: target.phone ? faDigits(target.phone) : "—" },
                {
                  label: "پست الکترونیکی",
                  value: target.email ? <span dir="ltr">{target.email}</span> : "—",
                },
                {
                  label: "لوگوی سازمان",
                  value: !target.has_logo ? (
                    "—"
                  ) : targetLogo ? (
                    <img
                      src={targetLogo}
                      alt={`لوگوی ${target.name}`}
                      className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200"
                    />
                  ) : (
                    "دارد"
                  ),
                },
                {
                  label: "ادمین سازمان",
                  value: targetAdmin ? (
                    <Badge tone="success">{targetAdmin.username}</Badge>
                  ) : (
                    <Badge tone="warning">ادمین ندارد</Badge>
                  ),
                },
                { label: "تعداد کاربر", value: faNumber(accountCountOf(target.id)) },
                {
                  label: "شغل اختصاصی",
                  value: faNumber(target.job_count ?? 0),
                },
              ]
            : []
        }
      />

      <ConfirmDialog
        open={is("delete")}
        title="حذف سازمان"
        message={
          `آیا از حذف سازمان «${target?.name ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. ` +
          `حذف تنها وقتی ممکن است که هیچ کاربری — ادمین آن هم — در سازمان نمانده باشد.` +
          (target?.job_count
            ? ` همچنین ${faNumber(target.job_count)} شغل اختصاصی این سازمان به همراه آن حذف می‌شود؛` +
              ` شغلی که باید بماند را پیش از حذف، در «مدیریت مشاغل» عمومی نمایید.`
            : "")
        }
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
        hint={`ادمین سازمان «${target?.name ?? ""}» — ایجاد کاربران این سازمان بر عهده اوست. هر سازمان تنها یک ادمین دارد.`}
        submitLabel="ثبت ادمین سازمان"
        busy={addingAdmin}
        onClose={close}
        onSubmit={(body, done) =>
          runAction(
            () => createOrgAdmin({ ...body, organization_id: target.id }),
            `ادمین سازمان «${target.name}» ایجاد شد.`,
            done
          )
        }
      />
    </>
  );
}
