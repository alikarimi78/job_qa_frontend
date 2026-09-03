import { useAppSelector } from "@store/hooks";
import { APP_TITLE } from "@constant/config";
import { AccountActions, AccountSummary, AvatarIcon, ChevronIcon } from "./UserMenu";

export default function DesktopMode({
  isOpen,
  dropdownRef,
  setIsOpen,
  handleLogout,
  handleChangePassword,
  handleChangeName,
}) {
  const { username, role, userInfo } = useAppSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-between px-6 h-16">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-white">{APP_TITLE}</h1>
            <div className="flex items-center justify-start font-semibold gap-2 text-xs text-slate-300">
              <span>مشاغل، مهارت‌ها و مسیر شغلی</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex gap-4 ml-2 justify-between px-3 py-1.5 items-center bg-slate-700/50 rounded-lg border border-slate-600/30
                       cursor-pointer hover:bg-slate-600/50 transition-colors duration-200"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-600/70 text-slate-200 shrink-0">
              <AvatarIcon />
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">{username}</span>
              <span className="text-xs text-slate-300">خوش‌آمدید</span>
            </div>
            <ChevronIcon
              className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          <div
            data-active={isOpen || undefined}
            className={`
              absolute left-0 mt-2 w-56 rounded-lg bg-slate-800 z-40 overflow-hidden
              border border-slate-600/40 shadow-xl opacity-0 scale-95 -translate-y-1 pointer-events-none
              transition-all duration-200 origin-top
              data-active:opacity-100 data-active:scale-100 data-active:translate-y-0 data-active:pointer-events-auto
            `}
          >
            <AccountSummary username={username} role={role} userInfo={userInfo} />
            <AccountActions
              onChangeName={handleChangeName}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
