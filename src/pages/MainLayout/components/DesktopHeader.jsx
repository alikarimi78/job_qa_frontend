/** Header content on wide screens: app mark, title and tagline on one side, the account button with its dropdown on the other. */
import { ChevronDownIcon, DocumentIcon, UserIcon } from "@components/icons";
import { APP_TAGLINE, APP_TITLE } from "@constants/appInfo";
import AccountDropdown from "./AccountDropdown";

export default function DesktopHeader({ menu }) {
  return (
    <div className="flex items-center justify-between px-6 h-16">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <DocumentIcon className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-white">{APP_TITLE}</h1>
            <div className="flex items-center justify-start font-semibold gap-2 text-xs text-slate-300">
              <span>{APP_TAGLINE}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menu.menuRef}>
          <button
            type="button"
            onClick={menu.toggleMenu}
            aria-haspopup="menu"
            aria-expanded={menu.isMenuOpen}
            className="flex gap-4 ml-2 justify-between px-3 py-1.5 items-center bg-slate-700/50 rounded-lg border border-slate-600/30
                       cursor-pointer hover:bg-slate-600/50 transition-colors duration-200"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-600/70 text-slate-200 shrink-0">
              <UserIcon className="w-6 h-6" />
            </span>
            <div className="flex flex-col text-start">
              <span className="text-sm text-white font-medium">{menu.account.username}</span>
              <span className="text-xs text-slate-300">خوش‌آمدید</span>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                menu.isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AccountDropdown
            isOpen={menu.isMenuOpen}
            widthClass="w-56"
            account={menu.account}
            actions={menu.menuActions}
          />
        </div>
      </div>
    </div>
  );
}
