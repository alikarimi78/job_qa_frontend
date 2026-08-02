import { useAppSelector } from "@store/hooks";
import { APP_TITLE } from "@constant/config";
import { AccountSummary, ChevronIcon, LogoutIcon } from "./UserMenu";

export default function MobileMode({ isOpen, toggleSidebar, dropdownRef, setIsOpen, handleLogout }) {
  const { username, role, userInfo } = useAppSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-between h-16 px-3">
      <button
        onClick={toggleSidebar}
        aria-label="باز و بسته کردن منو"
        className="flex items-center relative text-white justify-start cursor-pointer"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold text-white text-center">{APP_TITLE}</h1>
          <div className="flex items-center font-semibold justify-center gap-2 text-xs text-slate-300">
            <span>مشاغل، مهارت‌ها و مسیر شغلی</span>
          </div>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex gap-4 cursor-pointer bg-slate-600/50 rounded-full p-1 transition-colors duration-200"
        >
          <ChevronIcon
            className={`w-6 h-6 text-slate-300 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          data-active={isOpen || undefined}
          className={`
            absolute left-0 mt-2 rounded-lg bg-slate-800 z-40 w-52 overflow-hidden
            border border-slate-600/40 shadow-xl opacity-0 scale-95 -translate-y-1 pointer-events-none
            transition-all duration-200 origin-top
            data-active:opacity-100 data-active:scale-100 data-active:translate-y-0 data-active:pointer-events-auto
          `}
        >
          <AccountSummary username={username} role={role} userInfo={userInfo} />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400
                       hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <LogoutIcon />
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
