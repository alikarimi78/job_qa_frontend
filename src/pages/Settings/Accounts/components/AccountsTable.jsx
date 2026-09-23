/** Table of accounts: full name, username (struck through when blocked), role, organization, status, last sign-in and the allowed row actions. */
import DataTable from "@components/ui/DataTable";
import { faDateTime } from "@utils/jalali";
import { canManageAccount } from "../accountPermissions";
import { RoleBadge, StatusBadge } from "./AccountBadges";
import AccountRowActions from "./AccountRowActions";

function UsernameCell({ account, isSelf }) {
  return (
    <>
      <span className={account.is_active ? "text-slate-800" : "text-slate-400 line-through"}>
        {account.username}
      </span>
      {isSelf && <span className="text-xs text-slate-400"> (شما)</span>}
    </>
  );
}

export default function AccountsTable({ accountsPage }) {
  const { currentUser } = accountsPage;
  const isSelf = (account) => currentUser?.id === account.id;

  const columns = [
    {
      key: "person",
      header: "نام و نام خانوادگی",
      cell: (account) => (
        <span className={account.full_name ? "text-slate-800" : "text-slate-400"}>
          {account.full_name || "—"}
        </span>
      ),
    },
    {
      key: "username",
      header: "نام کاربری",
      cell: (account) => <UsernameCell account={account} isSelf={isSelf(account)} />,
    },
    {
      key: "role",
      header: "نقش",
      cell: (account) => <RoleBadge role={account.role} />,
    },
    {
      key: "organization",
      header: "جایگاه",
      className: "text-xs text-slate-500",
      cell: (account) => accountsPage.organizationLabelOf(account),
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (account) => <StatusBadge isActive={account.is_active} />,
    },
    {
      key: "last_login",
      header: "آخرین ورود",
      className: "text-xs text-slate-500 whitespace-nowrap fa-nums",
      cell: (account) => faDateTime(account.last_login),
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (account) => (
        <AccountRowActions
          account={account}
          canManage={canManageAccount(currentUser, account)}
          isSelf={isSelf(account)}
          isBusy={accountsPage.isBusy}
          onOpen={accountsPage.openDialog}
          onUnblock={accountsPage.unblock}
        />
      ),
    },
  ];

  const emptyMessage = accountsPage.isFiltering
    ? `کاربری با نام کاربری «${accountsPage.searchTerm.trim()}» یافت نشد.`
    : "تاکنون کاربری در دسترس شما ثبت نشده است.";

  return <DataTable columns={columns} rows={accountsPage.visibleAccounts} empty={emptyMessage} />;
}
