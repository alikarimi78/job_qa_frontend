import { menuItems } from "@constant/menuItems";
import MenuItem from "./MenuItem";
import Logo from "@assets/images/logo.png";
import { useAppSelector } from "@store/hooks";
import { hasRole } from "@routes/roles";
import { APP_TITLE, APP_SUBTITLE, ORGANISATION } from "@constant/config";

export default function SideBar({ isOpen, setIsOpen }) {
  const role = useAppSelector((state) => state.auth.role);

  // A parent whose children are all filtered out disappears with them, so an
  // org_admin never sees an empty «مدیریت» that opens onto nothing.
  const visibleMenuItems = menuItems
    .map((item) => {
      if (!hasRole(role, item.roles)) return null;
      if (!item.submenuItems) return item;

      const submenuItems = item.submenuItems.filter((sub) => hasRole(role, sub.roles));
      return submenuItems.length ? { ...item, submenuItems } : null;
    })
    .filter(Boolean);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[99] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Indigo glass rather than the reference's neutral slate: the content behind it
          already runs blue-50 → indigo-100, so the panel now reads as the same material
          tinted, instead of a grey card laid over a blue page. Navigation stays in the
          indigo family and green is left to mean "this button files something". */}
      <aside
        className={`
          fixed md:static inset-y-0 right-0
          flex flex-col justify-between
          bg-gradient-to-b from-indigo-500/25 via-indigo-400/15 to-blue-500/20
          backdrop-blur-3xl z-[9999999]
          border-l border-indigo-300/50
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
        {/* Header */}
        <div className="flex flex-col gap-4 px-2 py-4 flex-1 min-h-0">
          <div className="flex flex-col items-center gap-2 border-b border-indigo-300/60 pb-4">
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

          {/* Menu */}
          <nav className="flex-1 min-h-0 overflow-y-auto">
            <ul className="flex flex-col gap-2">
              {visibleMenuItems.map((item, index) => (
                <MenuItem key={index} {...item} sidebarOpen={isOpen} />
              ))}
            </ul>
          </nav>
        </div>

        <div className="px-6 py-3 shrink-0">
          <p className="text-xs font-light text-center text-indigo-950/70 leading-5">
            کلیه حقوق این سامانه برای <strong className="font-bold">{ORGANISATION}</strong> محفوظ
            است.
          </p>
        </div>
      </aside>
    </>
  );
}
