/** Outline "close" (or "cancel") button for a dialog's footer, disabled while the dialog's request runs. */
import Button from "@components/ui/Button";

export default function DialogCloseButton({ onClose, busy, label = "بستن" }) {
  return (
    <Button variant="outline" size="lg" onClick={onClose} disabled={busy}>
      {label}
    </Button>
  );
}
