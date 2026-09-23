/** Red "are you sure?" dialog for destructive actions such as deleting or blocking. */
import Button from "@components/ui/Button";
import BusyLabel from "@components/ui/BusyLabel";
import Modal from "@components/ui/Modal";
import DialogCloseButton from "./DialogCloseButton";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "بله، حذف شود",
  busy,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={busy ? undefined : onClose}
      size="sm"
      tone="danger"
      footer={
        <>
          <Button variant="danger" size="lg" onClick={onConfirm} disabled={busy}>
            <BusyLabel isBusy={busy} busyText="در حال حذف...">
              {confirmLabel}
            </BusyLabel>
          </Button>
          <DialogCloseButton onClose={onClose} busy={busy} label="انصراف" />
        </>
      }
    >
      <p className="text-sm text-slate-600 leading-7">{message}</p>
    </Modal>
  );
}
