/** Header content on narrow screens: the menu button that opens the sidebar, the centred title, and a compact account button with its dropdown. */
import { ChevronDownIcon, MenuIcon } from "@components/icons";
import { APP_TAGLINE, APP_TITLE } from "@constants/appInfo";
import AccountDropdown from "./AccountDropdown";

export default function MobileHeader({ menu, onToggleSidebar }) {
  return (
    <div className="flex items-center justify-between h-16 px-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="باز و بسته کردن منو"
        className="flex items-center relative text-white justify-start cursor-pointer"
      >
        <MenuIcon className="w-7 h-7" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold text-white text-center">{APP_TITLE}</h1>
          <div className="flex items-center font-semibold justify-center gap-2 text-xs text-slate-300">
            <span>{APP_TAGLINE}</span>
          </div>
        </div>
      </div>

      <div className="relative" ref={menu.menuRef}>
        <button
          type="button"
          onClick={menu.toggleMenu}
          aria-label="منوی حساب کاربری"
          aria-haspopup="menu"
          aria-expanded={menu.isMenuOpen}
          className="flex gap-4 cursor-pointer bg-slate-600/50 rounded-full p-1 transition-colors duration-200"
        >
          <ChevronDownIcon
            className={`w-6 h-6 text-slate-300 transition-transform duration-200 ${
              menu.isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AccountDropdown
          isOpen={menu.isMenuOpen}
          widthClass="w-52"
          account={menu.account}
          actions={menu.menuActions}
        />
      </div>
    </div>
  );
}
