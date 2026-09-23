/** Buttons of a job row: edit and delete for jobs the admin may change, otherwise only view. */
import { EyeIcon, PencilIcon, TrashIcon } from "@components/icons";
import IconButton from "@components/ui/IconButton";
import RowActions from "@components/ui/RowActions";

export default function JobRowActions({ job, canEdit, onEdit, onDelete, onView }) {
  if (!canEdit) {
    return (
      <RowActions>
        <IconButton tone="view" title={`مشاهده «${job.job_title}»`} onClick={() => onView(job)}>
          <EyeIcon />
        </IconButton>
      </RowActions>
    );
  }

  return (
    <RowActions>
      <IconButton tone="edit" title={`ویرایش «${job.job_title}»`} onClick={() => onEdit(job)}>
        <PencilIcon />
      </IconButton>
      <IconButton tone="danger" title={`حذف «${job.job_title}»`} onClick={() => onDelete(job)}>
        <TrashIcon />
      </IconButton>
    </RowActions>
  );
}
