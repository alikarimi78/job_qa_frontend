import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Modal from "@components/ui/Modal";
import { Spinner } from "@components/ui/Loader";


export function DialogFooter({ formId, label, busy, disabled, tone = "submit" }) {
  return (
    <Button
      variant={tone}
      size="lg"
      className="max-w-md"
      buttonProps={{ type: "submit", form: formId, disabled: disabled || busy }}
    >
      {busy ? (
        <>
          <Spinner />
          در حال ثبت...
        </>
      ) : (
        label
      )}
    </Button>
  );
}

export function CloseButton({ onClose, busy, label = "بستن" }) {
  return (
    <Button variant="outline" size="lg" buttonProps={{ onClick: onClose, disabled: busy }}>
      {label}
    </Button>
  );
}


const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const LOGO_MAX_BYTES = 512 * 1024;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const PHONE_ALLOWED = /^[0-9۰-۹٠-٩+\-() ]+$/;
const countDigits = (value) => (value.match(/[0-9۰-۹٠-٩]/g) ?? []).length;

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;
const PASSWORD_RULES = {
  minLength: { value: 8, message: "حداقل ۸ نویسه" },
  pattern: {
    value: PASSWORD_PATTERN,
    message: "رمز باید شامل حرف بزرگ، حرف کوچک و نویسه ویژه (مانند @) باشد",
  },
};
const PASSWORD_HINT = "حداقل ۸ نویسه، شامل حرف بزرگ و کوچک و نویسه ویژه (مانند @)";

const Required = ({ children }) => (
  <>
    {children} <span className="text-red-500">*</span>
  </>
);

export function OrganizationDialog({
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
  const formId = "organization-dialog-form";
  const blank = { name: "", code: "", address: "", phone: "", email: "" };
  const methods = useForm({ defaultValues: blank });

  const [logo, setLogo] = useState(null);
  const [logoError, setLogoError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: organization?.name ?? "",
      code: organization?.code ?? "",
      address: organization?.address ?? "",
      phone: organization?.phone ?? "",
      email: organization?.email ?? "",
    });
    setLogo(null);
    setLogoError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [open, organization]);

  const preview = logo === null ? initialLogo : logo || null;

  const pickFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      setLogoError("فقط PNG، JPG، WEBP یا GIF");
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setLogoError(`حجم لوگو حداکثر ${LOGO_MAX_BYTES / 1024} کیلوبایت است`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(String(reader.result));
      setLogoError("");
    };
    reader.onerror = () => setLogoError("خواندن فایل ممکن نشد");
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setLogo("");
    setLogoError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (values) => {
    const body = {
      name: values.name.trim(),
      code: values.code.trim(),
      address: values.address.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    };
    if (logo !== null) body.logo = logo;
    onSubmit(body, onClose);
  };

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="lg"
      footer={
        <>
          <DialogFooter formId={formId} label={submitLabel} busy={busy} />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
        >
          <Input
            name="name"
            label={<Required>نام سازمان</Required>}
            placeholder="مثلاً: ستاد مرکزی"
            registerProps={{
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
            registerProps={{ maxLength: { value: 64, message: "حداکثر ۶۴ نویسه" } }}
          />
          <Input
            name="address"
            label={<Required>آدرس سازمان</Required>}
            placeholder="نشانی کامل"
            registerProps={{
              required: "آدرس سازمان لازم است",
              maxLength: { value: 512, message: "حداکثر ۵۱۲ نویسه" },
            }}
          />
          <Input
            name="phone"
            label={<Required>شماره تماس</Required>}
            placeholder="مثلاً: ۰۲۱۸۸۷۷۶۶۵۵"
            registerProps={{
              required: "شماره تماس لازم است",
              validate: (value) => {
                const trimmed = value.trim();
                if (!PHONE_ALLOWED.test(trimmed)) return "فقط رقم و + - ( ) و فاصله";
                if (countDigits(trimmed) < 7) return "حداقل ۷ رقم";
                return true;
              },
            }}
          />
          <Input
            name="email"
            label={<Required>پست الکترونیکی</Required>}
            placeholder="info@example.com"
            inputProps={{ dir: "ltr" }}
            registerProps={{
              required: "پست الکترونیکی لازم است",
              pattern: { value: EMAIL_PATTERN, message: "نشانی ایمیل معتبر نیست" },
            }}
          />

          <LogoPicker
            preview={preview}
            error={logoError}
            fileRef={fileRef}
            onPick={pickFile}
            onClear={clearLogo}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}

function LogoPicker({ preview, error, fileRef, onPick, onClear }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">لوگوی سازمان</span>

      <div className="flex items-center gap-3">
        {preview && (
          <img
            src={preview}
            alt="لوگوی انتخاب‌شده"
            className="w-11 h-11 shrink-0 rounded-xl object-contain bg-white border border-slate-200"
          />
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-1 h-11 px-4 rounded-xl text-sm font-medium cursor-pointer
                     text-emerald-800 bg-white border border-emerald-700/40
                     hover:bg-emerald-50 hover:border-emerald-700
                     transition-colors duration-200"
        >
          {preview ? "تغییر لوگو" : "انتخاب لوگو"}
        </button>
        {preview && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 h-11 px-3 rounded-xl text-sm cursor-pointer
                       text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            حذف
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={LOGO_TYPES.join(",")}
        onChange={onPick}
        className="hidden"
      />

      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : (
        <span className="text-xs text-slate-400">
          اختیاری — PNG، JPG، WEBP یا GIF، حداکثر ۵۱۲ کیلوبایت
        </span>
      )}
    </div>
  );
}

export function PersonNameFields() {
  return (
    <>
      <Input
        name="first_name"
        label={<Required>نام</Required>}
        registerProps={{
          required: "نام لازم است",
          maxLength: { value: 64, message: "حداکثر ۶۴ نویسه" },
        }}
      />
      <Input
        name="last_name"
        label={<Required>نام خانوادگی</Required>}
        registerProps={{
          required: "نام خانوادگی لازم است",
          maxLength: { value: 64, message: "حداکثر ۶۴ نویسه" },
        }}
      />
    </>
  );
}

export function PersonNameDialog({ open, title, hint, initial, busy, onClose, onSubmit }) {
  const formId = "person-name-dialog-form";
  const methods = useForm({ defaultValues: { first_name: "", last_name: "" } });

  useEffect(() => {
    if (open) {
      methods.reset({
        first_name: initial?.first_name ?? "",
        last_name: initial?.last_name ?? "",
      });
    }
  }, [open, initial?.first_name, initial?.last_name]);

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="md"
      footer={
        <>
          <DialogFooter formId={formId} label="ثبت نام" busy={busy} />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
        >
          <PersonNameFields />
        </form>
      </FormProvider>
    </Modal>
  );
}

export function CredentialsDialog({
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
  const formId = "credentials-dialog-form";
  const blank = { first_name: "", last_name: "", username: "", password: "" };
  const methods = useForm({ defaultValues: blank });

  useEffect(() => {
    if (open) methods.reset(blank);
  }, [open]);

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="md"
      footer={
        <>
          <DialogFooter
            formId={formId}
            label={submitLabel}
            busy={busy}
            disabled={disabled}
          />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="flex flex-col gap-4"
        >
          {children}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <PersonNameFields />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <Input
              name="username"
              label="نام کاربری"
              placeholder="نام کاربری"
              registerProps={{
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
              registerProps={{ required: "رمز عبور لازم است", ...PASSWORD_RULES }}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

export function PasswordDialog({ open, title, hint, busy, onClose, onSubmit }) {
  const formId = "password-dialog-form";
  const methods = useForm({ defaultValues: { password: "" } });

  useEffect(() => {
    if (open) methods.reset({ password: "" });
  }, [open]);

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="sm"
      footer={
        <>
          <DialogFooter formId={formId} label="ثبت رمز جدید" busy={busy} />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form id={formId} onSubmit={methods.handleSubmit(({ password }) => onSubmit(password, onClose))}>
          <Input
            name="password"
            type="password"
            label="رمز جدید"
            placeholder="رمز جدید"
            hint={PASSWORD_HINT}
            registerProps={{ required: "رمز عبور لازم است", ...PASSWORD_RULES }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}

export function SelfPasswordDialog({ open, title, hint, busy, onClose, onSubmit }) {
  const formId = "self-password-dialog-form";
  const blank = { current_password: "", new_password: "" };
  const methods = useForm({ defaultValues: blank });

  useEffect(() => {
    if (open) methods.reset(blank);
  }, [open]);

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="sm"
      footer={
        <>
          <DialogFooter formId={formId} label="ثبت رمز جدید" busy={busy} />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit((values) => onSubmit(values, onClose))}
          className="flex flex-col gap-4"
        >
          <Input
            name="current_password"
            type="password"
            label="رمز فعلی"
            placeholder="رمز عبوری که هم‌اکنون با آن وارد می‌شوید"
            registerProps={{ required: "رمز فعلی لازم است" }}
          />
          <Input
            name="new_password"
            type="password"
            label="رمز جدید"
            placeholder="رمز جدید"
            hint={PASSWORD_HINT}
            registerProps={{
              required: "رمز جدید لازم است",
              ...PASSWORD_RULES,
              validate: (value, values) =>
                value !== values.current_password || "رمز جدید باید با رمز فعلی متفاوت باشد",
            }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "بله، حذف شود",
  cancelLabel = "انصراف",
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
          <Button
            variant="danger"
            size="lg"
            buttonProps={{ onClick: onConfirm, disabled: busy }}
          >
            {busy ? (
              <>
                <Spinner />
                در حال حذف...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
          <CloseButton onClose={onClose} busy={busy} label={cancelLabel} />
        </>
      }
    >
      <p className="text-sm text-slate-600 leading-7">{message}</p>
    </Modal>
  );
}

export function DetailsDialog({ open, title, hint, rows, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={onClose}
      size="md"
      footer={<CloseButton onClose={onClose} />}
    >
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 flex-wrap py-3
                       border-t border-slate-100 first:border-t-0 first:pt-0"
          >
            <dt className="text-sm text-slate-500">{row.label}</dt>
            <dd className="text-sm font-medium text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
