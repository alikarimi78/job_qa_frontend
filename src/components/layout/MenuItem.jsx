import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Ported from the reference MenuItem, state for state: a direct link, a parent that
// expands, and a second level under that. The only change is that `icon` is a node
// rather than an image path — see constant/menuItems.jsx.

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

  // A parent opens itself when the page inside it is the one being shown, so a reload
  // on /admin does not present a collapsed menu with no sign of where you are.
  useEffect(() => {
    if (isSubmenuActive) setSubmenuOpen(true);
  }, [isSubmenuActive]);

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
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-indigo-950/80 hover:bg-gradient-to-r hover:from-indigo-600/40 hover:to-blue-500/40 hover:text-white hover:shadow-sm"
            }
          `}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-600/20" />
          )}

          <div
            className={`
              relative p-1.5 rounded-lg transition-all duration-300
              ${isActive ? "bg-white/20 text-white" : "bg-white/70 text-indigo-700 group-hover:bg-indigo-600/60 group-hover:text-white"}
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

      {/* آیتم والد با زیرمنو */}
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
                  ? "bg-gradient-to-r from-indigo-600/55 to-blue-500/55 text-white shadow-sm"
                  : "text-indigo-950/80 hover:bg-gradient-to-r hover:from-indigo-600/40 hover:to-blue-500/40 hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  relative p-1.5 rounded-lg transition-all duration-300
                  ${
                    submenuOpen || isSubmenuActive
                      ? "bg-indigo-700/70 text-white"
                      : "bg-white/70 text-indigo-700 group-hover:bg-indigo-600/60 group-hover:text-white"
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
                    ? "bg-indigo-700/70 text-white -rotate-90"
                    : "bg-white/70 text-indigo-700 group-hover:bg-indigo-600/60 group-hover:text-white"
                }
              `}
            >
              <Chevron />
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
              <div className="absolute right-0 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400 via-indigo-500 to-transparent" />

              {submenuItems.map((submenuItem, index) => (
                <div key={index} className="relative">
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full" />

                  {submenuItem.href ? (
                    <Link
                      to={submenuItem.href}
                      className={`
                        block px-4 py-2.5 mr-4 rounded-lg text-sm transition-all duration-300
                        ${
                          isReady && location.pathname === submenuItem.href
                            ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium shadow-md shadow-indigo-600/25"
                            : "text-indigo-950/75 hover:bg-gradient-to-r hover:from-indigo-600/35 hover:to-blue-500/35 hover:text-white hover:font-medium"
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
                              ? "bg-gradient-to-r from-indigo-600/45 to-blue-500/45 text-white font-medium"
                              : "text-indigo-950/75 hover:bg-gradient-to-r hover:from-indigo-600/35 hover:to-blue-500/35 hover:text-white hover:font-medium"
                          }
                        `}
                      >
                        <span>{submenuItem.label}</span>
                        <div
                          className={`
                            p-0.5 rounded transition-all duration-300
                            ${
                              openSecondSubmenu === submenuItem.label
                                ? "-rotate-90 bg-indigo-700/70 text-white"
                                : "bg-white/70 text-indigo-700"
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
                                  border-r-2 border-transparent hover:border-indigo-400
                                  ${
                                    isReady && location.pathname === secondMenuItem.href
                                      ? "bg-gradient-to-r from-indigo-600/50 to-blue-500/50 text-white font-medium border-r-indigo-300"
                                      : "text-indigo-950/65 hover:bg-gradient-to-r hover:from-indigo-600/25 hover:to-blue-500/25 hover:text-white hover:font-medium"
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
