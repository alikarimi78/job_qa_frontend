/** Organization management (super admin only): search, list, create, edit, view and delete organizations and define each one's admin. */
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";
import PageToolbar from "@components/ui/PageToolbar";
import SearchInput from "@components/ui/SearchInput";
import { faNumber } from "@utils/numbers";
import OrganizationsDialogs from "./components/OrganizationsDialogs";
import OrganizationsTable from "./components/OrganizationsTable";
import { ORGANIZATION_DIALOGS } from "./constants";
import useOrganizations from "./hooks/useOrganizations";

export default function OrganizationsPage() {
  const organizationsPage = useOrganizations();

  return (
    <>
      <PageToolbar
        title="مدیریت سازمان‌ها"
        hint="سازمان بالاترین سطح است؛ ادمین سازمان و کاربران آن ذیل سازمان ایجاد می‌شوند"
        status={
          <Badge tone="neutral">{faNumber(organizationsPage.visibleOrganizations.length)} سازمان</Badge>
        }
        action={{
          label: "افزودن سازمان جدید",
          onClick: () => organizationsPage.dialogs.open(ORGANIZATION_DIALOGS.create),
        }}
      >
        <SearchInput
          value={organizationsPage.searchTerm}
          onChange={organizationsPage.changeSearchTerm}
          placeholder="جست‌وجو بر اساس نام سازمان"
          maxLength={120}
        />
      </PageToolbar>

      <Card>
        <OrganizationsTable organizationsPage={organizationsPage} />
      </Card>

      <OrganizationsDialogs organizationsPage={organizationsPage} />
    </>
  );
}
