/** Green submit button for a dialog's footer; it submits the form with the given id (the form lives in the dialog body) and shows a spinner while busy. */
import Button from "@components/ui/Button";
import BusyLabel from "@components/ui/BusyLabel";

export default function DialogSubmitButton({ formId, label, busy, disabled }) {
  return (
    <Button
      variant="submit"
      size="lg"
      className="max-w-md"
      type="submit"
      form={formId}
      disabled={disabled || busy}
    >
      <BusyLabel isBusy={busy} busyText="در حال ثبت...">
        {label}
      </BusyLabel>
    </Button>
  );
}
