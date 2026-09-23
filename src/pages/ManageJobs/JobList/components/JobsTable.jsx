/** Table of jobs: title, aliases, public/organization scope, last edit date and row actions. */
import Badge from "@components/ui/Badge";
import DataTable from "@components/ui/DataTable";
import { faDate } from "@utils/jalali";
import { organizationName } from "@utils/organizations";
import { canEditJob } from "../jobPermissions";
import AliasChips from "./AliasChips";
import JobRowActions from "./JobRowActions";

function JobScopeBadge({ job, organizationsById }) {
  if (job.organization_id == null) return <Badge tone="neutral">عمومی</Badge>;
  return <Badge tone="accent">{organizationName(organizationsById, job.organization_id)}</Badge>;
}

export default function JobsTable({ jobList, emptyMessage }) {
  const columns = [
    {
      key: "job_title",
      header: "عنوان شغل",
      cell: (job) => <strong className="text-sm text-slate-800">{job.job_title}</strong>,
    },
    {
      key: "aliases",
      header: "نام‌های دیگر",
      cell: (job) => <AliasChips aliasesCell={job.aliases} />,
    },
    {
      key: "organization",
      header: "دامنه",
      cell: (job) => <JobScopeBadge job={job} organizationsById={jobList.organizationsById} />,
    },
    {
      key: "updated_at",
      header: "آخرین ویرایش",
      cell: (job) => (
        <span className="text-sm text-slate-600 fa-nums">{faDate(job.updated_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (job) => (
        <JobRowActions
          job={job}
          canEdit={canEditJob(jobList.currentUser, job)}
          onEdit={jobList.startEditing}
          onDelete={jobList.askToDelete}
          onView={jobList.startViewing}
        />
      ),
    },
  ];

  return <DataTable columns={columns} rows={jobList.jobsPage.items} empty={emptyMessage} />;
}
