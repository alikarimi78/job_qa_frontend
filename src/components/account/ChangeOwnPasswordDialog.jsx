/** Dialog in which signed-in users change their own password; it asks for the current password and refuses a new one equal to it. */
import { FormProvider, useForm } from "react-hook-form";
import FormDialog from "@components/dialogs/FormDialog";
import Input from "@components/ui/Input";
import { PASSWORD_HINT, PASSWORD_RULES } from "@constants/formRules";
import useFormResetOnOpen from "@hooks/useFormResetOnOpen";

const FORM_ID = "self-password-dialog-form";
const BLANK_VALUES = { current_password: "", new_password: "" };

const differsFromCurrent = (value, values) =>
  value !== values.current_password || "رمز جدید باید با رمز فعلی متفاوت باشد";

export default function ChangeOwnPasswordDialog({ open, title, hint, busy, onClose, onSubmit }) {
  const methods = useForm({ defaultValues: BLANK_VALUES });
  useFormResetOnOpen(methods, open, () => BLANK_VALUES);

  return (
    <FormDialog
      open={open}
      title={title}
      hint={hint}
      size="sm"
      formId={FORM_ID}
      submitLabel="ثبت رمز جدید"
      busy={busy}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          id={FORM_ID}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="flex flex-col gap-4"
        >
          <Input
            name="current_password"
            type="password"
            label="رمز فعلی"
            placeholder="رمز عبوری که هم‌اکنون با آن وارد می‌شوید"
            rules={{ required: "رمز فعلی لازم است" }}
          />
          <Input
            name="new_password"
            type="password"
            label="رمز جدید"
            placeholder="رمز جدید"
            hint={PASSWORD_HINT}
            rules={{ required: "رمز جدید لازم است", ...PASSWORD_RULES, validate: differsFromCurrent }}
          />
        </form>
      </FormProvider>
    </FormDialog>
  );
}
