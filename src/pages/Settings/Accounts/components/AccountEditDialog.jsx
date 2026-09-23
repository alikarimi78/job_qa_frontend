/** Dialog to rename an account and, for a super admin editing an account inside an organization, move it to another organization. */
import { FormProvider } from "react-hook-form";
import PersonNameFields from "@components/account/PersonNameFields";
import FormDialog from "@components/dialogs/FormDialog";
import FormField from "@components/ui/FormField";
import Select from "@components/ui/Select";
import { ROLES } from "@constants/roles";

const FORM_ID = "account-edit-form";

function DestinationField({ editForm, organizations, isOrganizationAdmin }) {
  return (
    <FormField
      label="سازمان"
      note={
        isOrganizationAdmin && (
          <span className="text-xs text-slate-400">
            انتقال ادمین سازمان تنها به سازمانی امکان‌پذیر است که ادمین نداشته باشد.
          </span>
        )
      }
    >
      <Select
        value={editForm.destinationId}
        onChange={editForm.changeDestination}
        className="w-full h-11"
        required
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

export default function AccountEditDialog({
  open,
  account,
  canMove,
  editForm,
  organizations,
  busy,
  onClose,
  onSubmit,
}) {
  const username = account?.username ?? "";

  return (
    <FormDialog
      open={open}
      title="ویرایش کاربر"
      hint={
        canMove
          ? `نام و سازمان «${username}» ویرایش می‌شود؛ نقش آن عوض نمی‌شود و هیچ‌چیز دیگری با آن جابه‌جا نمی‌شود.`
          : `نام «${username}» اصلاح می‌شود؛ نام کاربری و نقش تغییر نمی‌کنند.`
      }
      formId={FORM_ID}
      submitLabel="ثبت تغییر"
      busy={busy}
      onClose={onClose}
    >
      <FormProvider {...editForm.methods}>
        <form
          id={FORM_ID}
          onSubmit={editForm.methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <PersonNameFields />
          </div>

          {canMove && (
            <DestinationField
              editForm={editForm}
              organizations={organizations}
              isOrganizationAdmin={account?.role === ROLES.orgAdmin}
            />
          )}
        </form>
      </FormProvider>
    </FormDialog>
  );
}
