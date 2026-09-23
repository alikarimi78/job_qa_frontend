/** Table of organizations: name, code, phone, number of accounts, admin, and row actions. */
import DataTable from "@components/ui/DataTable";
import { faDigits, faNumber } from "@utils/numbers";
import AdminBadge from "./AdminBadge";
import OrganizationRowActions from "./OrganizationRowActions";

function NumericCell({ children }) {
  return <span className="text-sm text-slate-600 fa-nums">{children}</span>;
}

const digitsOrDash = (value) => (value ? faDigits(value) : "—");

export default function OrganizationsTable({ organizationsPage }) {
  const { adminOf, accountCountOf, dialogs } = organizationsPage;

  const columns = [
    {
      key: "name",
      header: "عنوان سازمان",
      cell: (organization) => <strong className="text-sm text-slate-800">{organization.name}</strong>,
    },
    {
      key: "code",
      header: "کد سازمانی",
      cell: (organization) => <NumericCell>{digitsOrDash(organization.code)}</NumericCell>,
    },
    {
      key: "phone",
      header: "تلفن سازمان",
      cell: (organization) => <NumericCell>{digitsOrDash(organization.phone)}</NumericCell>,
    },
    {
      key: "accounts",
      header: "تعداد کاربر",
      cell: (organization) => <NumericCell>{faNumber(accountCountOf(organization.id))}</NumericCell>,
    },
    {
      key: "admin",
      header: "ادمین سازمان",
      cell: (organization) => <AdminBadge admin={adminOf(organization.id)} />,
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (organization) => (
        <OrganizationRowActions
          organization={organization}
          hasAdmin={Boolean(adminOf(organization.id))}
          onOpen={dialogs.open}
        />
      ),
    },
  ];

  const emptyMessage = organizationsPage.isFiltering
    ? `سازمانی با نام «${organizationsPage.searchTerm.trim()}» یافت نشد.`
    : "تاکنون سازمانی ایجاد نشده است.";

  return (
    <DataTable columns={columns} rows={organizationsPage.visibleOrganizations} empty={emptyMessage} />
  );
}
