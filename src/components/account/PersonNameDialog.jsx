/** Dialog for changing a person's first and last name, pre-filled with their current name each time it opens. */
import { FormProvider, useForm } from "react-hook-form";
import FormDialog from "@components/dialogs/FormDialog";
import useFormResetOnOpen from "@hooks/useFormResetOnOpen";
import PersonNameFields from "./PersonNameFields";

const FORM_ID = "person-name-dialog-form";

const nameValues = (person) => ({
  first_name: person?.first_name ?? "",
  last_name: person?.last_name ?? "",
});

export default function PersonNameDialog({ open, title, hint, initial, busy, onClose, onSubmit }) {
  const methods = useForm({ defaultValues: nameValues(null) });
  useFormResetOnOpen(methods, open, () => nameValues(initial), [
    initial?.first_name,
    initial?.last_name,
  ]);

  return (
    <FormDialog
      open={open}
      title={title}
      hint={hint}
      formId={FORM_ID}
      submitLabel="ثبت نام"
      busy={busy}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          id={FORM_ID}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
        >
          <PersonNameFields />
        </form>
      </FormProvider>
    </FormDialog>
  );
}
