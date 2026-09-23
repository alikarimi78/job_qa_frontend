/** "Add account" dialog: choose the role (only those the admin may create) and, where needed, the organization, then the name, username and password. */
import AccountCredentialsDialog from "@components/account/AccountCredentialsDialog";
import FormField from "@components/ui/FormField";
import Select from "@components/ui/Select";
import { ROLES, roleLabel } from "@constants/roles";

const PLACEHOLDER_OPTION = <option value="">— انتخاب نمایید —</option>;

function RoleField({ newAccount }) {
  return (
    <FormField label="نقش">
      <Select value={newAccount.role} onChange={newAccount.changeRole} className="w-full h-11">
        {PLACEHOLDER_OPTION}
        {newAccount.creatableRoles.map((role) => (
          <option key={role} value={role}>
            {roleLabel(role)}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

function OrganizationField({ newAccount }) {
  const hasNoChoice = newAccount.organizationChoices.length === 0;

  return (
    <FormField
      label="سازمان"
      note={
        hasNoChoice && (
          <span className="text-xs text-amber-600">
            {newAccount.role === ROLES.orgAdmin
              ? "تمامی سازمان‌ها دارای ادمین هستند؛ هر سازمان تنها یک ادمین می‌پذیرد."
              : "تاکنون سازمانی ایجاد نشده است."}
          </span>
        )
      }
    >
      <Select
        value={newAccount.organizationId}
        onChange={newAccount.changeOrganization}
        className="w-full h-11"
      >
        {PLACEHOLDER_OPTION}
        {newAccount.organizationChoices.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

function OwnOrganizationField({ name }) {
  return (
    <FormField label="سازمان">
      <div className="h-11 px-4 flex items-center rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500">
        {name}
      </div>
    </FormField>
  );
}

export default function NewAccountDialog({ newAccount }) {
  return (
    <AccountCredentialsDialog
      open={newAccount.isOpen}
      title="افزودن کاربر"
      hint="نقش تعیین می‌کند کاربر در کدام سطح قرار می‌گیرد و چه کاربرانی ایجاد می‌کند. در این فهرست تنها نقش‌هایی نمایش داده می‌شود که مجاز به ایجاد آن‌ها هستید."
      submitLabel="افزودن کاربر"
      busy={newAccount.isCreating}
      disabled={!newAccount.canSubmit}
      onClose={newAccount.close}
      onSubmit={newAccount.submit}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <RoleField newAccount={newAccount} />
        {newAccount.needsOrganization && !newAccount.usesOwnOrganization && (
          <OrganizationField newAccount={newAccount} />
        )}
        {newAccount.usesOwnOrganization && (
          <OwnOrganizationField name={newAccount.ownOrganizationName} />
        )}
      </div>
    </AccountCredentialsDialog>
  );
}
