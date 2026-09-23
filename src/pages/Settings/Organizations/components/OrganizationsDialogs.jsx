/** All dialogs of the organizations page: create, edit, view, delete, and define the organization's admin. */
import AccountCredentialsDialog from "@components/account/AccountCredentialsDialog";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import { faNumber } from "@utils/numbers";
import { ORGANIZATION_DIALOGS } from "../constants";
import OrganizationDetailsDialog from "./OrganizationDetailsDialog";
import OrganizationDialog from "./OrganizationDialog";

function deleteMessage(organization) {
  const jobsNote = organization?.job_count
    ? ` همچنین ${faNumber(organization.job_count)} شغل اختصاصی این سازمان به همراه آن حذف می‌شود؛` +
      ` شغلی که باید بماند را پیش از حذف، در «مدیریت مشاغل» عمومی نمایید.`
    : "";
  return (
    `آیا از حذف سازمان «${organization?.name ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. ` +
    `حذف تنها وقتی ممکن است که هیچ کاربری — ادمین آن هم — در سازمان نمانده باشد.` +
    jobsNote
  );
}

export default function OrganizationsDialogs({ organizationsPage }) {
  const { dialogs, selectedOrganization } = organizationsPage;

  return (
    <>
      <OrganizationDialog
        open={dialogs.isOpen(ORGANIZATION_DIALOGS.create)}
        title="افزودن سازمان"
        submitLabel="افزودن سازمان"
        busy={organizationsPage.isCreating}
        onClose={dialogs.close}
        onSubmit={organizationsPage.create}
      />

      <OrganizationDialog
        open={dialogs.isOpen(ORGANIZATION_DIALOGS.edit)}
        title="ویرایش سازمان"
        hint="مشخصات سازمان تغییر می‌کند؛ کاربران ذیل آن بدون تغییر باقی می‌مانند."
        submitLabel="ویرایش سازمان"
        organization={selectedOrganization}
        initialLogo={organizationsPage.selectedLogo}
        busy={organizationsPage.isSaving}
        onClose={dialogs.close}
        onSubmit={organizationsPage.update}
      />

      <OrganizationDetailsDialog
        open={dialogs.isOpen(ORGANIZATION_DIALOGS.view)}
        organization={selectedOrganization}
        logo={organizationsPage.selectedLogo}
        admin={selectedOrganization && organizationsPage.adminOf(selectedOrganization.id)}
        accountCount={selectedOrganization && organizationsPage.accountCountOf(selectedOrganization.id)}
        onClose={dialogs.close}
      />

      <ConfirmDialog
        open={dialogs.isOpen(ORGANIZATION_DIALOGS.delete)}
        title="حذف سازمان"
        message={deleteMessage(selectedOrganization)}
        busy={organizationsPage.isDeleting}
        onClose={dialogs.close}
        onConfirm={organizationsPage.remove}
      />

      <AccountCredentialsDialog
        open={dialogs.isOpen(ORGANIZATION_DIALOGS.addAdmin)}
        title="تعریف ادمین سازمان"
        hint={`ادمین سازمان «${selectedOrganization?.name ?? ""}» — ایجاد کاربران این سازمان بر عهده اوست. هر سازمان تنها یک ادمین دارد.`}
        submitLabel="ثبت ادمین سازمان"
        busy={organizationsPage.isAddingAdmin}
        onClose={dialogs.close}
        onSubmit={organizationsPage.addAdmin}
      />
    </>
  );
}
