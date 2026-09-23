/** Dialog to create or edit an organization: name, code, address, phone, email and logo. */
import { FormProvider } from "react-hook-form";
import FormDialog from "@components/dialogs/FormDialog";
import Input from "@components/ui/Input";
import RequiredLabel from "@components/ui/RequiredLabel";
import { EMAIL_PATTERN, validatePhone } from "@constants/formRules";
import useOrganizationForm from "../hooks/useOrganizationForm";
import LogoPicker from "./LogoPicker";

const FORM_ID = "organization-dialog-form";

export default function OrganizationDialog({
  open,
  title,
  hint,
  submitLabel,
  organization = null,
  initialLogo = null,
  busy,
  onClose,
  onSubmit,
}) {
  const { methods, submit, logoPicker } = useOrganizationForm({
    open,
    organization,
    initialLogo,
    onSubmit,
    onClose,
  });

  return (
    <FormDialog
      open={open}
      title={title}
      hint={hint}
      size="lg"
      formId={FORM_ID}
      submitLabel={submitLabel}
      busy={busy}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          id={FORM_ID}
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
        >
          <Input
            name="name"
            label={<RequiredLabel>نام سازمان</RequiredLabel>}
            placeholder="مثلاً: ستاد مرکزی"
            rules={{
              required: "نام سازمان لازم است",
              minLength: { value: 2, message: "حداقل ۲ نویسه" },
              maxLength: { value: 128, message: "حداکثر ۱۲۸ نویسه" },
            }}
          />
          <Input
            name="code"
            label="شناسه سازمان"
            placeholder="اختیاری — مثلاً: ۲۱۳"
            hint="شناسه‌ای که خود سازمان با آن شناخته می‌شود"
            rules={{ maxLength: { value: 64, message: "حداکثر ۶۴ نویسه" } }}
          />
          <Input
            name="address"
            label={<RequiredLabel>آدرس سازمان</RequiredLabel>}
            placeholder="نشانی کامل"
            rules={{
              required: "آدرس سازمان لازم است",
              maxLength: { value: 512, message: "حداکثر ۵۱۲ نویسه" },
            }}
          />
          <Input
            name="phone"
            label={<RequiredLabel>شماره تماس</RequiredLabel>}
            placeholder="مثلاً: ۰۲۱۸۸۷۷۶۶۵۵"
            rules={{ required: "شماره تماس لازم است", validate: validatePhone }}
          />
          <Input
            name="email"
            label={<RequiredLabel>پست الکترونیکی</RequiredLabel>}
            placeholder="info@example.com"
            inputProps={{ dir: "ltr" }}
            rules={{
              required: "پست الکترونیکی لازم است",
              pattern: { value: EMAIL_PATTERN, message: "نشانی ایمیل معتبر نیست" },
            }}
          />

          <LogoPicker picker={logoPicker} />
        </form>
      </FormProvider>
    </FormDialog>
  );
}
