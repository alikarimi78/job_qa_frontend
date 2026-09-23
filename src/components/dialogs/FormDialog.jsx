/** Modal whose body is a form and whose footer holds that form's submit and close buttons; it cannot be dismissed while the request runs. */
import Modal from "@components/ui/Modal";
import DialogCloseButton from "./DialogCloseButton";
import DialogSubmitButton from "./DialogSubmitButton";

export default function FormDialog({
  open,
  title,
  hint,
  size = "md",
  formId,
  submitLabel,
  closeLabel,
  busy,
  disabled,
  onClose,
  children,
}) {
  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size={size}
      footer={
        <>
          <DialogSubmitButton formId={formId} label={submitLabel} busy={busy} disabled={disabled} />
          <DialogCloseButton onClose={onClose} busy={busy} label={closeLabel} />
        </>
      }
    >
      {children}
    </Modal>
  );
}
