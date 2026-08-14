import { useEffect } from "react";
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
 * A container's whole editable surface: its name. Backs four calls — create and rename,
 * for an organization and for a unit — because `PATCH /orgs/{id}` and `PATCH /units/{id}`
 * accept exactly what `POST` does minus the parent, and the parent is never chosen here.
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
          <DialogFooter formId={formId} label="ثبت رمز تازه" busy={busy} />
          <CloseButton onClose={onClose} busy={busy} />
        </>
      }
    >
      <FormProvider {...methods}>
        <form id={formId} onSubmit={methods.handleSubmit(({ password }) => onSubmit(password, onClose))}>
          <Input
            name="password"
            type="password"
            label="رمز تازه"
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
 * disabled; here that would be a single greyed-out «نام» box, because an organization
 * is a name and an id and nothing else. So it shows the name together with what the
 * row is actually consulted for — who administers it and how much sits inside it.
 *
 * `rows` is `[{ label, value }]`; a `value` may be a node, which is how the admin line
 * arrives as a Badge rather than as text.
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
