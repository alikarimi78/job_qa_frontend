import { menuItems } from "../../constant/menuItems";
import MenuItem from "./components/MenuItem";
import Logo from "./../../assets/images/logo.png";
import { useAppSelector } from "@store/hooks";
import { hasPermission } from "./../../routes/roles";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const userPermissions = useAppSelector((state) => state.auth.permissions);

  const visibleMenuItems = menuItems
    .map((item) => {
      if (!hasPermission(userPermissions, item.requiredPermissions)) {
        return null;
      }

      if (!item.submenuItems) return item;

      const submenuItems = item.submenuItems.filter((sub) =>
        hasPermission(userPermissions, sub.requiredPermissions)
      );

      return submenuItems.length ? { ...item, submenuItems } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[99] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`
      fixed md:static inset-y-0 right-0
      flex-col justify-between
      bg-slate-500/35 backdrop-blur-3xl z-[9999999]
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
        {/* Header */}
        <div className="flex flex-col gap-4 px-2 py-4 h-5/6 md:h-full">
          <div className="flex flex-col items-center gap-2 border-b pb-4">
            <img
              src={Logo}
              width={140}
              height={140}
              className="transition-all duration-300"
              alt="Logo"
            />

            <h1 className="text-sm font-bold text-slate-800 text-center leading-6">
              سامانه سنجش و پایش
              <br />
              پژوهشکده سرمایه انسانی
            </h1>
          </div>

          {/* Menu */}
          <nav className="md:h-[46vh] max-md:flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-2">
              {visibleMenuItems.map((item, index) => (
                <MenuItem key={index} {...item} sidebarOpen={isOpen} />
              ))}
            </ul>
          </nav>
        </div>

        <div className="md:px-6 max-md:flex max-md:items-end max-md:pb-4 md:py-3 max-md:h-1/6">
          <p className="text-xs font-light text-center text-slate-700 leading-5">
            کلیه حقوق این سامانه برای{" "}
            <strong className="font-bold">
              پژوهشکده سرمایه انسانی دانشگاه فرماندهی و ستاد آجا
            </strong>{" "}
            محفوظ است.
          </p>
        </div>
      </aside>
    </>
  );
}
