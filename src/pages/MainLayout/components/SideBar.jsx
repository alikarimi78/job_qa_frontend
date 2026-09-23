/** The right-hand sidebar: logo and app name, the menu for the current role, and the copyright line; on mobile it slides over the page with a backdrop that closes it. */
import Logo from "@assets/images/logo.png";
import { APP_SUBTITLE, APP_TITLE, OWNER_ORGANIZATION } from "@constants/appInfo";
import useSidebarMenu from "../hooks/useSidebarMenu";
import MenuItem from "./MenuItem";

export default function SideBar({ isOpen, onClose }) {
  const menuItems = useSidebarMenu();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-sidebar-backdrop md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed md:static inset-y-0 right-0
          flex flex-col justify-between
          bg-slate-500/35 backdrop-blur-3xl z-sidebar
          border-l border-slate-300/40
          transition-all duration-300 ease-out
          ${
            isOpen
              ? "w-[280px] lg:w-[380px] translate-x-0 opacity-100"
              : "w-0 translate-x-full opacity-0 lg:w-[380px] md:translate-x-0 md:opacity-100"
          }
          md:flex
          overflow-hidden
        `}
      >
        <div className="flex flex-col gap-4 px-2 py-4 flex-1 min-h-0">
          <div className="flex flex-col items-center gap-2 border-b border-slate-300/50 pb-4">
            <img
              src={Logo}
              width={140}
              height={140}
              className="transition-all duration-300"
              alt="نشان پژوهشکده سرمایه انسانی"
            />

            <h1 className="text-sm font-bold text-slate-800 text-center leading-6">
              {APP_TITLE}
              <br />
              {APP_SUBTITLE}
            </h1>
          </div>

          <nav className="flex-1 min-h-0 overflow-y-auto">
            <ul className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <MenuItem key={item.href} {...item} />
              ))}
            </ul>
          </nav>
        </div>

        <div className="px-6 py-3 shrink-0">
          <p className="text-xs font-light text-center text-slate-700 leading-5">
            کلیه حقوق این سامانه برای <strong className="font-bold">{OWNER_ORGANIZATION}</strong> محفوظ
            است.
          </p>
        </div>
      </aside>
    </>
  );
}
