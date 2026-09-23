/** Dialog that creates an account: name, username and password, plus whatever extra fields (role, organization) the caller puts above them. */
import { FormProvider, useForm } from "react-hook-form";
import FormDialog from "@components/dialogs/FormDialog";
import Input from "@components/ui/Input";
import { PASSWORD_HINT, PASSWORD_RULES } from "@constants/formRules";
import useFormResetOnOpen from "@hooks/useFormResetOnOpen";
import PersonNameFields from "./PersonNameFields";

const FORM_ID = "credentials-dialog-form";
const BLANK_VALUES = { first_name: "", last_name: "", username: "", password: "" };
const TWO_COLUMN_GRID = "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4";

export default function AccountCredentialsDialog({
  open,
  title,
  hint,
  submitLabel,
  busy,
  disabled,
  onClose,
  onSubmit,
  children,
}) {
  const methods = useForm({ defaultValues: BLANK_VALUES });
  useFormResetOnOpen(methods, open, () => BLANK_VALUES);

  return (
    <FormDialog
      open={open}
      title={title}
      hint={hint}
      formId={FORM_ID}
      submitLabel={submitLabel}
      busy={busy}
      disabled={disabled}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          id={FORM_ID}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="flex flex-col gap-4"
        >
          {children}
          <div className={TWO_COLUMN_GRID}>
            <PersonNameFields />
          </div>
          <div className={TWO_COLUMN_GRID}>
            <Input
              name="username"
              label="نام کاربری"
              placeholder="نام کاربری"
              rules={{
                required: "نام کاربری لازم است",
                minLength: { value: 3, message: "حداقل ۳ نویسه" },
              }}
            />
            <Input
              name="password"
              type="password"
              label="رمز عبور"
              placeholder="رمز عبور"
              hint={PASSWORD_HINT}
              rules={{ required: "رمز عبور لازم است", ...PASSWORD_RULES }}
            />
          </div>
        </form>
      </FormProvider>
    </FormDialog>
  );
}
