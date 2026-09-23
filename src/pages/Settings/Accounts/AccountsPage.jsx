/** Account management: search and filter the accounts the admin may see, add accounts, and block, edit, move, reset or delete them. */
import OrganizationSelect from "@components/OrganizationSelect";
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";
import PageToolbar from "@components/ui/PageToolbar";
import SearchInput from "@components/ui/SearchInput";
import { faNumber } from "@utils/numbers";
import AccountsDialogs from "./components/AccountsDialogs";
import AccountsTable from "./components/AccountsTable";
import NewAccountDialog from "./components/NewAccountDialog";
import useAccounts from "./hooks/useAccounts";

export default function AccountsPage() {
  const accountsPage = useAccounts();
  const { newAccount } = accountsPage;

  return (
    <>
      <PageToolbar
        title="مدیریت کاربران"
        hint="برای محدودسازی دسترسی کاربران، می‌توانید آنان را مسدود نمایید."
        action={
          newAccount.canCreate ? { label: "افزودن کاربر جدید", onClick: newAccount.open } : undefined
        }
        status={<Badge tone="neutral">{faNumber(accountsPage.visibleAccounts.length)} کاربر</Badge>}
      >
        <SearchInput
          value={accountsPage.searchTerm}
          onChange={accountsPage.changeSearchTerm}
          placeholder="جست‌وجو بر اساس نام کاربری"
          maxLength={60}
        />
      </PageToolbar>

      <Card>
        {accountsPage.isSuperAdmin && (
          <div className="flex items-end gap-3 flex-wrap mb-5 pb-5 border-b border-slate-200">
            <span className="flex items-center gap-2">
              <label className="text-sm text-slate-600">سازمان:</label>
              <OrganizationSelect
                value={accountsPage.organizationFilter}
                onChange={accountsPage.setOrganizationFilter}
                organizations={accountsPage.organizations}
              />
            </span>
          </div>
        )}

        <AccountsTable accountsPage={accountsPage} />
      </Card>

      <AccountsDialogs accountsPage={accountsPage} />
      <NewAccountDialog newAccount={newAccount} />
    </>
  );
}
