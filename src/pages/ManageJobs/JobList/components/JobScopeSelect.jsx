/** Scope filter of the job list: a super admin picks all, public or one organization; an organization admin picks all jobs or only their organization's own. */
import OrganizationSelect from "@components/OrganizationSelect";
import Select from "@components/ui/Select";
import { SCOPE_ALL } from "@constants/organizationScope";

const SELECT_CLASS = "h-11 min-w-44";

export default function JobScopeSelect({ jobList }) {
  if (jobList.isSuperAdmin) {
    return (
      <OrganizationSelect
        value={jobList.scopeFilter}
        onChange={jobList.changeScope}
        organizations={jobList.organizations}
        allLabel="همه دامنه‌ها"
        publicLabel="عمومی"
        className={SELECT_CLASS}
      />
    );
  }

  return (
    <Select
      value={jobList.scopeFilter}
      onChange={(event) => jobList.changeScope(event.target.value)}
      className={SELECT_CLASS}
    >
      <option value={SCOPE_ALL}>همه مشاغل</option>
      <option value={jobList.currentUser.organization_id}>مشاغل اختصاصی سازمان شما</option>
    </Select>
  );
}
