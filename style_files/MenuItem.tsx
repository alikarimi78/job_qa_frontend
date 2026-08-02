import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import ArrowRight from "./../../../assets/icons/arrow-right.svg";
import { RoleType } from "./../../../routes/roles";

interface MenuItemProps {
  href?: string;
  iconSrc: string;
  label: string;
  submenuItems?: {
    label: string;
    href?: string;
    secondMenuItems?: {
      label: string;
      href?: string;
    }[];
  }[];
  sidebarOpen?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  href,
  iconSrc,
  label,
  submenuItems,
}) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [openSecondSubmenu, setOpenSecondSubmenu] = useState<string | null>(
    null
  );
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      setIsReady(true);
    }
  }, [location.pathname]);

  const isActive = isReady && href && location.pathname === href;
  const isSubmenuActive =
    isReady &&
    submenuItems?.some(
      (item) =>
        item.href === location.pathname ||
        item.secondMenuItems?.some(
          (secondItem) => secondItem.href === location.pathname
        )
    );

  // useEffect(() => {
  //   if (isSubmenuActive && !submenuOpen) {
  //     setSubmenuOpen(true);
  //   }
  // }, [isSubmenuActive, submenuOpen]);

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  const toggleSecondSubmenu = (submenuTitle: string) => {
    setOpenSecondSubmenu((prev) =>
      prev === submenuTitle ? null : submenuTitle
    );
  };

  const hasSubmenu = submenuItems && submenuItems.length > 0;

  return (
    <li>
      {/* آیتم با لینک مستقیم */}
      {href && !hasSubmenu && (
        <Link
          to={href}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
            transition-all duration-300 ease-out overflow-hidden
            ${
              isActive
                ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-600/25"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-slate-600/40 hover:to-slate-500/40 hover:text-white hover:shadow-sm"
            }
          `}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-slate-600/20 animate-pulse"></div>
          )}

          <div
            className={`
            relative p-1.5 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-white/20"
                : "bg-slate-200/80 group-hover:bg-slate-600/50"
            }
          `}
          >
            <img
              src={iconSrc}
              width={16}
              height={16}
              className={`
                transition-all duration-300
                ${
                  isActive
                    ? "brightness-0 invert"
                    : "opacity-80 group-hover:opacity-100 group-hover:filter group-hover:brightness-0 group-hover:invert"
                }
              `}
              alt=""
            />
          </div>

          <span className="relative">{label}</span>

          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
          )}
        </Link>
      )}

      {/* آیتم والد با زیرمنو */}
      {hasSubmenu && (
        <>
          <button
            onClick={toggleSubmenu}
            className={`
              w-full group relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-300 ease-out overflow-hidden
              ${
                submenuOpen || isSubmenuActive
                  ? "bg-gradient-to-r from-slate-600/50 to-slate-500/50 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-slate-600/40 hover:to-slate-500/40 hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                relative p-1.5 rounded-lg transition-all duration-300
                ${
                  submenuOpen || isSubmenuActive
                    ? "bg-slate-700/60"
                    : "bg-slate-200/80 group-hover:bg-slate-600/50"
                }
              `}
              >
                <img
                  src={iconSrc}
                  width={16}
                  height={16}
                  className={`
                    transition-all duration-300
                    ${
                      submenuOpen || isSubmenuActive
                        ? "opacity-100 filter brightness-0 invert"
                        : "opacity-80 group-hover:opacity-100 group-hover:filter group-hover:brightness-0 group-hover:invert"
                    }
                  `}
                  alt=""
                />
              </div>
              <span className="relative">{label}</span>
            </div>

            <div
              className={`
              p-1 rounded-lg transition-all duration-300
              ${
                submenuOpen
                  ? "bg-slate-700/60 rotate-90"
                  : "bg-slate-200/80 group-hover:bg-slate-600/50"
              }
            `}
            >
              <img
                src={ArrowRight}
                width={12}
                height={12}
                className={`
                  transition-all duration-300
                  ${
                    submenuOpen
                      ? "opacity-100 filter brightness-0 invert"
                      : "opacity-80 group-hover:opacity-100 group-hover:filter group-hover:brightness-0 group-hover:invert"
                  }
                `}
                alt=""
              />
            </div>
          </button>

          {/* زیرمنو */}
          <div
            className={`
            overflow-hidden transition-all duration-300 ease-out
            ${submenuOpen ? "max-h-96 mt-2" : "max-h-0"}
          `}
          >
            <div className="relative mr-8 space-y-1">
              <div className="absolute right-0 top-2 bottom-2 w-px bg-gradient-to-b from-slate-400 via-slate-500 to-transparent"></div>

              {submenuItems.map((submenuItem, index) => (
                <div key={index} className="relative">
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full"></div>

                  {submenuItem.href ? (
                    <Link
                      to={submenuItem.href}
                      className={`
                        block px-4 py-2.5 mr-4 rounded-lg text-sm transition-all duration-300
                        ${
                          isReady && location.pathname === submenuItem.href
                            ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium shadow-md shadow-slate-600/25"
                            : "text-gray-600 hover:bg-gradient-to-r hover:from-slate-600/30 hover:to-slate-500/30 hover:text-white hover:font-medium"
                        }
                      `}
                    >
                      {submenuItem.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSecondSubmenu(submenuItem.label)}
                        className={`
                          w-full flex items-center justify-between px-4 py-2.5 mr-4 rounded-lg text-sm
                          transition-all duration-300
                          ${
                            openSecondSubmenu === submenuItem.label
                              ? "bg-gradient-to-r from-slate-600/40 to-slate-500/40 text-white font-medium"
                              : "text-gray-600 hover:bg-gradient-to-r hover:from-slate-600/30 hover:to-slate-500/30 hover:text-white hover:font-medium"
                          }
                        `}
                      >
                        <span>{submenuItem.label}</span>
                        <div
                          className={`
                          p-0.5 rounded transition-all duration-300
                          ${
                            openSecondSubmenu === submenuItem.label
                              ? "rotate-90 bg-slate-700/60"
                              : "bg-slate-300/80"
                          }
                        `}
                        >
                          <img
                            src={ArrowRight}
                            width={10}
                            height={10}
                            className={`
                              transition-all duration-300
                              ${
                                openSecondSubmenu === submenuItem.label
                                  ? "opacity-100 filter brightness-0 invert"
                                  : "opacity-70"
                              }
                            `}
                            alt=""
                          />
                        </div>
                      </button>

                      {submenuItem.secondMenuItems?.length && (
                        <div
                          className={`
                          overflow-hidden transition-all duration-300 ease-out
                          ${
                            openSecondSubmenu === submenuItem.label
                              ? "max-h-48 mt-1"
                              : "max-h-0"
                          }
                        `}
                        >
                          <div className="mr-8 space-y-1">
                            {submenuItem.secondMenuItems.map(
                              (secondMenuItem, secondIndex) => (
                                <Link
                                  key={secondIndex}
                                  to={secondMenuItem.href as string}
                                  className={`
                                  block px-4 py-2 rounded-lg text-xs transition-all duration-300
                                  border-r-2 border-transparent hover:border-slate-400
                                  ${
                                    isReady &&
                                    location.pathname === secondMenuItem.href
                                      ? "bg-gradient-to-r from-slate-600/50 to-slate-500/50 text-white font-medium border-r-slate-300"
                                      : "text-gray-500 hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-slate-500/20 hover:text-white hover:font-medium"
                                  }
                                `}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`
                                    w-1.5 h-1.5 rounded-full transition-colors duration-300
                                    ${
                                      isReady &&
                                      location.pathname === secondMenuItem.href
                                        ? "bg-white"
                                        : "bg-gray-400"
                                    }
                                  `}
                                    ></div>
                                    {secondMenuItem.label}
                                  </div>
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </li>
  );
};

export default MenuItem;
