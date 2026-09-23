/** Read-only dialog showing a public job to an organization admin, who may not change it. */
import DialogCloseButton from "@components/dialogs/DialogCloseButton";
import JobRecordFields from "@components/job/JobRecordFields";
import Modal from "@components/ui/Modal";

export default function JobViewDialog({ job, onClose }) {
  return (
    <Modal
      open
      title={`مشاهده «${job.job_title}»`}
      hint="این شغل در پایگاه داده مشترک تمامی سازمان‌ها ثبت شده است و ویرایش یا حذف آن تنها از سوی مدیر سامانه امکان‌پذیر است."
      size="lg"
      onClose={onClose}
      footer={<DialogCloseButton onClose={onClose} />}
    >
      <JobRecordFields record={job} />
    </Modal>
  );
}
