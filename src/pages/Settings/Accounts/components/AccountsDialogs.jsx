/** All dialogs of the accounts page for the selected account: view, reset password, change own password, edit, block and delete. */
import ChangeOwnPasswordDialog from "@components/account/ChangeOwnPasswordDialog";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import { canMoveOrganization } from "../accountPermissions";
import { ACCOUNT_DIALOGS } from "../constants";
import AccountDetailsDialog from "./AccountDetailsDialog";
import AccountEditDialog from "./AccountEditDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

export default function AccountsDialogs({ accountsPage }) {
  const { dialogs, selectedAccount: account, isBusy } = accountsPage;
  const username = account?.username ?? "";

  return (
    <>
      <AccountDetailsDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.view)}
        account={account}
        organizationLabel={account ? accountsPage.organizationLabelOf(account) : "—"}
        onClose={dialogs.close}
      />

      <ResetPasswordDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.resetPassword)}
        username={username}
        busy={isBusy}
        onClose={dialogs.close}
        onSubmit={accountsPage.resetPassword}
      />

      <ChangeOwnPasswordDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.changeOwnPassword)}
        title="تغییر رمز عبور خود"
        hint="رمز فعلی پرسیده می‌شود، زیرا در این حالت تنها نشست باز شما گواه مالکیت حساب است."
        busy={isBusy}
        onClose={dialogs.close}
        onSubmit={accountsPage.changeOwnPassword}
      />

      <AccountEditDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.edit)}
        account={account}
        canMove={Boolean(account) && canMoveOrganization(accountsPage.currentUser, account)}
        editForm={accountsPage.editForm}
        organizations={accountsPage.organizations}
        busy={isBusy}
        onClose={dialogs.close}
        onSubmit={accountsPage.saveAccount}
      />

      <ConfirmDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.block)}
        title="مسدودکردن کاربر"
        message={`از این پس ورود «${username}» پذیرفته نمی‌شود، حتی اگر توکن معتبری در اختیار داشته باشد. هیچ اطلاعاتی حذف نمی‌شود و در هر زمان امکان رفع مسدودی وجود دارد.`}
        confirmLabel="مسدود شود"
        busy={isBusy}
        onClose={dialogs.close}
        onConfirm={accountsPage.block}
      />

      <ConfirmDialog
        open={dialogs.isOpen(ACCOUNT_DIALOGS.delete)}
        title="حذف کاربر"
        message={`آیا از حذف «${username}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. پیشنهادهای شغلی این کاربر در پایگاه داده باقی می‌مانند و تنها انتساب آن‌ها به این کاربر حذف می‌شود.`}
        busy={isBusy}
        onClose={dialogs.close}
        onConfirm={accountsPage.remove}
      />
    </>
  );
}
