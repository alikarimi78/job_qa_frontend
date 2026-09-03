import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


const Chevron = ({ className = "" }) => (
  <svg
    className={`w-3 h-3 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default function MenuItem({ href, icon, label, submenuItems }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [openSecondSubmenu, setOpenSecondSubmenu] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) setIsReady(true);
  }, [location.pathname]);

  const isActive = isReady && href && location.pathname === href;
  const isSubmenuActive =
    isReady &&
    submenuItems?.some(
      (item) =>
        item.href === location.pathname ||
        item.secondMenuItems?.some((second) => second.href === location.pathname)
    );

  useEffect(() => {
    if (isSubmenuActive) setSubmenuOpen(true);
  }, [isSubmenuActive]);

  const hasSubmenu = submenuItems && submenuItems.length > 0;

  return (
    <li>
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
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-slate-600/20" />
          )}

          <div
            className={`
              relative p-1.5 rounded-lg transition-all duration-300
              ${isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-600/50 group-hover:text-white"}
            `}
          >
            {icon}
          </div>

          <span className="relative">{label}</span>

          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
          )}
        </Link>
      )}

      {hasSubmenu && (
        <>
          <button
            type="button"
            onClick={() => setSubmenuOpen(!submenuOpen)}
            className={`
              w-full group relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl
              text-sm font-medium cursor-pointer
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
                      ? "bg-slate-700/60 text-white"
                      : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-600/50 group-hover:text-white"
                  }
                `}
              >
                {icon}
              </div>
              <span className="relative">{label}</span>
            </div>

            <div
              className={`
                p-1 rounded-lg transition-all duration-300
                ${
                  submenuOpen
                    ? "bg-slate-700/60 text-white -rotate-90"
                    : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-600/50 group-hover:text-white"
                }
              `}
            >
              <Chevron />
            </div>
          </button>

          <div
            className={`
              overflow-hidden transition-all duration-300 ease-out
              ${submenuOpen ? "max-h-96 mt-2" : "max-h-0"}
            `}
          >
            <div className="relative mr-8 space-y-1">
              <div className="absolute right-0 top-2 bottom-2 w-px bg-gradient-to-b from-slate-400 via-slate-500 to-transparent" />

              {submenuItems.map((submenuItem, index) => (
                <div key={index} className="relative">
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full" />

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
                        type="button"
                        onClick={() =>
                          setOpenSecondSubmenu((prev) =>
                            prev === submenuItem.label ? null : submenuItem.label
                          )
                        }
                        className={`
                          w-full flex items-center justify-between px-4 py-2.5 mr-4 rounded-lg text-sm
                          cursor-pointer transition-all duration-300
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
                                ? "-rotate-90 bg-slate-700/60 text-white"
                                : "bg-slate-300/80 text-slate-600"
                            }
                          `}
                        >
                          <Chevron className="w-2.5 h-2.5" />
                        </div>
                      </button>

                      {submenuItem.secondMenuItems?.length > 0 && (
                        <div
                          className={`
                            overflow-hidden transition-all duration-300 ease-out
                            ${openSecondSubmenu === submenuItem.label ? "max-h-48 mt-1" : "max-h-0"}
                          `}
                        >
                          <div className="mr-8 space-y-1">
                            {submenuItem.secondMenuItems.map((secondMenuItem, secondIndex) => (
                              <Link
                                key={secondIndex}
                                to={secondMenuItem.href}
                                className={`
                                  block px-4 py-2 rounded-lg text-xs transition-all duration-300
                                  border-r-2 border-transparent hover:border-slate-400
                                  ${
                                    isReady && location.pathname === secondMenuItem.href
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
                                        isReady && location.pathname === secondMenuItem.href
                                          ? "bg-white"
                                          : "bg-gray-400"
                                      }
                                    `}
                                  />
                                  {secondMenuItem.label}
                                </div>
                              </Link>
                            ))}
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
}
