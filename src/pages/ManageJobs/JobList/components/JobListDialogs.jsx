/** The dialogs of the job list: edit a job, view a public job, and confirm deleting a job. */
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import JobEditDialog from "@components/job/JobEditDialog";
import { organizationName } from "@utils/organizations";
import JobViewDialog from "./JobViewDialog";

const REBUILD_NOTE = "با ذخیره، تغییرات بلافاصله اعمال و بازسازی امبدینگ‌ها آغاز می‌شود.";

function editHint(job, organizationsById) {
  if (job.organization_id == null) {
    return `این رکورد هم‌اکنون در پایگاه دادهٔ مشترک تمامی سازمان‌ها موجود است. ${REBUILD_NOTE}`;
  }
  const name = organizationName(organizationsById, job.organization_id);
  return `این رکورد تنها در نتایج تحلیل سازمان «${name}» دیده می‌شود. ${REBUILD_NOTE}`;
}

export default function JobListDialogs({ jobList }) {
  const { editingJob, viewingJob, jobToDelete } = jobList;

  return (
    <>
      {editingJob && (
        <JobEditDialog
          job={editingJob}
          hint={editHint(editingJob, jobList.organizationsById)}
          owners={jobList.organizations}
          allowPublic={jobList.isSuperAdmin}
          busy={jobList.isSaving}
          onClose={jobList.stopEditing}
          onSubmit={jobList.saveJob}
        />
      )}

      {viewingJob && <JobViewDialog job={viewingJob} onClose={jobList.stopViewing} />}

      <ConfirmDialog
        open={jobToDelete !== null}
        title="حذف شغل"
        message={`آیا از حذف «${jobToDelete?.job_title ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. شغل از پایگاه داده حذف و بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود؛ تا پایان بازسازی، تحلیل با نسخه پیشین پاسخ می‌دهد.`}
        busy={jobList.isDeleting}
        onClose={jobList.cancelDelete}
        onConfirm={jobList.confirmDelete}
      />
    </>
  );
}
