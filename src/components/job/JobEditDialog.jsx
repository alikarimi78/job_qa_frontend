/** Large dialog holding the job editor for an existing record (a stored job or a suggestion under review), with save and cancel in its footer. */
import FormDialog from "@components/dialogs/FormDialog";
import JobForm from "./JobForm/JobForm";

const FORM_ID = "job-edit-form";

export default function JobEditDialog({ job, hint, owners, allowPublic, busy, onClose, onSubmit }) {
  return (
    <FormDialog
      open
      title={`ویرایش «${job.job_title}»`}
      hint={hint}
      size="lg"
      formId={FORM_ID}
      submitLabel="ذخیره تغییرات"
      closeLabel="انصراف"
      busy={busy}
      onClose={onClose}
    >
      <JobForm
        key={job.id}
        formId={FORM_ID}
        initial={job}
        owners={owners}
        allowPublic={allowPublic}
        onSubmit={onSubmit}
      />
    </FormDialog>
  );
}
