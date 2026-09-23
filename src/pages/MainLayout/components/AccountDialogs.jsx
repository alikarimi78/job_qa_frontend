/** The two dialogs opened from the account menu: change your own password and edit your name. */
import ChangeOwnPasswordDialog from "@components/account/ChangeOwnPasswordDialog";
import PersonNameDialog from "@components/account/PersonNameDialog";
import { ACCOUNT_DIALOGS } from "../constants";

export default function AccountDialogs({ menu }) {
  return (
    <>
      <ChangeOwnPasswordDialog
        open={menu.openDialog === ACCOUNT_DIALOGS.password}
        title="تغییر رمز عبور"
        hint="رمز فعلی پرسیده می‌شود، چون اینجا چیزی جز نشست باز شما ثابت نمی‌کند که صاحب حساب هستید."
        busy={menu.isChangingPassword}
        onClose={menu.closeDialog}
        onSubmit={menu.changePassword}
      />

      <PersonNameDialog
        open={menu.openDialog === ACCOUNT_DIALOGS.name}
        title="ویرایش نام"
        hint="این نام در سربرگ گزارش‌های PDF شما چاپ می‌شود. نام کاربری تغییر نمی‌کند."
        initial={menu.currentUser}
        busy={menu.isChangingName}
        onClose={menu.closeDialog}
        onSubmit={menu.changeName}
      />
    </>
  );
}
