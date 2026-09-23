/** Buttons of the account dropdown: edit name, change password, sign out. */
import { KeyIcon, LogOutIcon, PencilIcon } from "@components/icons";

const ITEM_CLASS =
  "w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer";

export default function AccountActions({ onChangeName, onChangePassword, onLogout }) {
  return (
    <>
      <button type="button" onClick={onChangeName} className={`${ITEM_CLASS} text-slate-200`}>
        <PencilIcon />
        ویرایش نام
      </button>
      <button type="button" onClick={onChangePassword} className={`${ITEM_CLASS} text-slate-200`}>
        <KeyIcon />
        تغییر رمز
      </button>
      <button
        type="button"
        onClick={onLogout}
        className={`${ITEM_CLASS} text-red-400 border-t border-slate-600/40`}
      >
        <LogOutIcon />
        خروج از حساب
      </button>
    </>
  );
}
