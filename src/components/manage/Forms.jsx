import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Modal from "@components/ui/Modal";
import { Spinner } from "@components/ui/Loader";

// Every write the management sections make now happens in a dialog — the customer's
// admin_panel.mp4 has no create-form sitting on the page, and neither do we. What used
// to be `NameForm` and `CredentialsForm` (a card with a SubmitBar under it) are the
// same two shapes, moved inside `ui/Modal`.
//
// The submit lives in the footer and reaches its <form> through the HTML `form=`
// attribute. That keeps the app's rule intact rather than working around it: a form
// still ends in a rule across its width with one green button at the start of it, and
// the rule is now the footer's own border. See the note in ui/Modal.
//
// `onSubmit(values, close)` — the dialogs never close themselves. `utils/action.js`
// reports the server's message and calls `close` only when the request actually
// succeeded, so a 409 («این سازمان ادمین دارد») leaves the dialog open with what was
// typed still in it.

// `busy` and `disabled` are deliberately two things: a request in flight shows the
// spinner, a form that cannot be submitted yet (no role chosen, no unit chosen) is
// only greyed out. Folding them into one prop made an untouched dialog claim to be
// «در حال ثبت...» before anything had been sent.
function DialogFooter({ formId, label, busy, disabled, tone = "submit" }) {
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

function CloseButton({ onClose, busy, label = "بستن" }) {
  return (
    <Button variant="outline" size="lg" buttonProps={{ onClick: onClose, disabled: busy }}>
      {label}
    </Button>
  );
}

/**
 * A unit's whole editable surface: its name. Backs both create and rename, because
 * `PATCH /units/{id}` accepts exactly what `POST` does minus the parent, and the parent
 * is never chosen here.
 *
 * Organizations used this too until they gained a profile — they have `OrganizationDialog`
 * below now. A unit still has nothing but a name and the organization it was made in.
 */
export function NameDialog({
  open,
  title,
  hint,
  fieldLabel,
  placeholder,
  defaultValue = "",
  submitLabel,
  busy,
  onClose,
  onSubmit,
  children,
}) {
  const formId = "name-dialog-form";
  const methods = useForm({ defaultValues: { name: defaultValue } });

  // The dialog stays mounted while closed, so `defaultValues` is only ever read once.
  // Re-seeding on open is what makes «ویرایش» of a second row show that row's name
  // rather than the previous one's.
  useEffect(() => {
    if (open) methods.reset({ name: defaultValue });
  }, [open, defaultValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      open={open}
      title={title}
      hint={hint}
      onClose={busy ? undefined : onClose}
      size="md"
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
          onSubmit={methods.handleSubmit(({ name }) => onSubmit(name.trim(), onClose))}
        >
          <Input
            name="name"
            label={fieldLabel}
            placeholder={placeholder}
            registerProps={{
              required: "نام لازم است",
              minLength: { value: 2, message: "حداقل ۲ نویسه" },
              maxLength: { value: 128, message: "حداکثر ۱۲۸ نویسه" },
            }}
          />
          {children}
        </form>
      </FormProvider>
    </Modal>
  );
}

// ---------- the organization profile ----------

// What `routers/orgs.py:decode_logo` will accept, said again here so the file is
// refused while it is still on the user's disk rather than after a 512 KB upload.
// The pair has to be changed together.
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const LOGO_MAX_BYTES = 512 * 1024;

// The same shapes the server validates, so a typo is caught next to the box it was
// typed in instead of coming back as a 422 about a field the form has to go looking for.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const PHONE_ALLOWED = /^[0-9۰-۹٠-٩+\-() ]+$/;
const countDigits = (value) => (value.match(/[0-9۰-۹٠-٩]/g) ?? []).length;

// The reference's red asterisk. `ui/Input` renders whatever `label` is, so this is a
// node rather than a « *» glued onto the string — which would have been the same colour
// as the label and read as part of the field's name.
const Required = ({ children }) => (
  <>
    {children} <span className="text-red-500">*</span>
  </>
);

/**
 * «افزودن سازمان» / «ویرایش سازمان», field for field from the customer's
 * admin_panel.mp4: name and code on the first row, address and phone on the second,
 * email and the logo picker on the third. Everything but the code and the logo is
 * required — the reference marks them with a red asterisk, and the requirement lives
 * here rather than in the column, because the organizations that predate the profile
 * have none of it and still have to be editable (see `OrganizationProfile` in
 * `app/schemas.py`).
 *
 * The logo is deliberately three states and not two. Untouched means the key is left
 * out of the body entirely, so a PATCH that never opened the picker cannot wipe the
 * image the row already has; cleared sends `""`, which is what removes it; a new file
 * sends the data URI. Folding «untouched» into «empty» is the one change here that
 * would quietly delete data.
 */
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

  // `logo === null` is «untouched»; a string is what will be sent.
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
  }, [open, organization]); // eslint-disable-line react-hooks/exhaustive-deps

  // What the box shows: the file just picked, else the one already stored, else nothing.
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
          // Two columns exactly, not `auto-fit`: the reference pairs the fields —
          // name beside code, address beside phone, email beside the logo picker — and
          // an auto-fitting track turns that into three columns at this width and
          // re-pairs everything wrongly.
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

/**
 * The reference's «انتخاب لوگو» box — an outlined full-width button in the grid's last
 * cell, so the picker sits where a sixth input would. The chosen image is shown beside
 * it: a logo is the one field on this form whose value cannot be read as text, and
 * picking the wrong file is otherwise invisible until the row is saved.
 */
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

/**
 * Credentials for an account someone else is creating. `children` is where the caller
 * puts whatever the endpoint additionally needs — a role, an organization, a unit —
 * because those differ per call and none of them is a credential.
 */
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
  const methods = useForm({ defaultValues: { username: "", password: "" } });

  useEffect(() => {
    if (open) methods.reset({ username: "", password: "" });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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
              placeholder="حداقل ۸ نویسه"
              registerProps={{
                required: "رمز عبور لازم است",
                minLength: { value: 8, message: "حداقل ۸ نویسه" },
              }}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

/** A new password for an account that cannot supply its old one. */
export function PasswordDialog({ open, title, hint, busy, onClose, onSubmit }) {
  const formId = "password-dialog-form";
  const methods = useForm({ defaultValues: { password: "" } });

  useEffect(() => {
    if (open) methods.reset({ password: "" });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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
            placeholder="حداقل ۸ نویسه"
            registerProps={{
              required: "رمز عبور لازم است",
              minLength: { value: 8, message: "حداقل ۸ نویسه" },
            }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}

/**
 * The caller's own password. It asks for the current one, which is the whole difference
 * from `PasswordDialog` above and is not a formality: an admin resetting somebody
 * else's password is authorised by being that admin, and an account changing its own
 * has only its session to show for it — so without this box a browser left open on a
 * shared machine would be a permanent takeover rather than an hour of borrowed access.
 *
 * It is the only way a super_admin ever changes their password: `/accounts/{id}/password`
 * refuses one's own row, and there is nobody above a super_admin to ask.
 */
export function SelfPasswordDialog({ open, title, hint, busy, onClose, onSubmit }) {
  const formId = "self-password-dialog-form";
  const blank = { current_password: "", new_password: "" };
  const methods = useForm({ defaultValues: blank });

  useEffect(() => {
    if (open) methods.reset(blank);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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
            placeholder="رمزی که الان با آن وارد می‌شوید"
            registerProps={{ required: "رمز فعلی لازم است" }}
          />
          <Input
            name="new_password"
            type="password"
            label="رمز جدید"
            placeholder="حداقل ۸ نویسه"
            registerProps={{
              required: "رمز جدید لازم است",
              minLength: { value: 8, message: "حداقل ۸ نویسه" },
              validate: (value, values) =>
                value !== values.current_password || "رمز جدید باید با رمز فعلی فرق کند",
            }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}

/**
 * The two-step delete, as the dialog admin_panel.mp4 uses rather than the inline pair
 * of buttons it used to be. The page still does not try to predict whether a container
 * is empty — it asks, and shows the 409 the server answers with, which names what is
 * still inside.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "بله حذف شود",
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

/**
 * The «مشاهده» dialog. The reference shows the create form again with every input
 * disabled; here it is a plain list instead, because a read-only form is a form you can
 * put the cursor in. It carries what the row is actually consulted for — the profile,
 * plus who administers it and how much sits inside it, which no input on the edit form
 * has anything to say about.
 *
 * `rows` is `[{ label, value }]`; a `value` may be a node, which is how the admin line
 * arrives as a Badge and the logo as an image rather than as text.
 */
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
