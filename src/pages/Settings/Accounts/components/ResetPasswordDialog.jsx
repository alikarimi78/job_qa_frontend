/** Dialog in which an admin sets a new password for another account without knowing the current one. */
import { FormProvider, useForm } from "react-hook-form";
import FormDialog from "@components/dialogs/FormDialog";
import Input from "@components/ui/Input";
import { PASSWORD_HINT, PASSWORD_RULES } from "@constants/formRules";
import useFormResetOnOpen from "@hooks/useFormResetOnOpen";

const FORM_ID = "password-dialog-form";
const BLANK_VALUES = { password: "" };

export default function ResetPasswordDialog({ open, username, busy, onClose, onSubmit }) {
  const methods = useForm({ defaultValues: BLANK_VALUES });
  useFormResetOnOpen(methods, open, () => BLANK_VALUES);

  return (
    <FormDialog
      open={open}
      title="تغییر رمز کاربر"
      hint={`تعیین رمز جدید برای «${username}». رمز فعلی پرسیده نمی‌شود؛ این گزینه برای کاربری است که امکان اعلام رمز فعلی خود را ندارد.`}
      size="sm"
      formId={FORM_ID}
      submitLabel="ثبت رمز جدید"
      busy={busy}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          id={FORM_ID}
          onSubmit={methods.handleSubmit(({ password }) => onSubmit(password, onClose))}
        >
          <Input
            name="password"
            type="password"
            label="رمز جدید"
            placeholder="رمز جدید"
            hint={PASSWORD_HINT}
            rules={{ required: "رمز عبور لازم است", ...PASSWORD_RULES }}
          />
        </form>
      </FormProvider>
    </FormDialog>
  );
}
