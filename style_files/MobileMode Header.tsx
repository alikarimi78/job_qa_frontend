import Button from "@components/ui/Button";
import { useAppSelector } from "@store/hooks";
import { Link } from "react-router";

export default function MobileMode({
  isOpen,
  toggleSidebar,
  dropdownRef,
  handleBackToDashboard,
  setIsOpen,
  handleLogout,
}) {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  return (
    <>
      {location.pathname.includes("questions") ? (
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-white">
                سامانه سنجش و پایش
              </h1>
            </div>
          </div>
          <Button
            variant="secondary"
            buttonProps={{ onClick: handleBackToDashboard }}
            className="flex items-center gap-2 px-4 h-10 bg-slate-600 hover:bg-slate-500
                             text-white border-slate-500 rounded-lg transition-all"
          >
            بازگشت
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between h-16 px-3">
          <button
            data-active={location.pathname.includes("questions")}
            onClick={toggleSidebar}
            className="flex items-center relative text-white justify-start"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
              <h1 className="text-lg font-semibold text-white">
                سامانه سنجش و پایش
              </h1>
              <div className="flex items-center font-semibold justify-center gap-2 text-xs text-slate-300">
                <span>پنل مدیریت</span>
              </div>
            </div>
          </div>
          <div
            className="relative"
            ref={dropdownRef}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div
              className="flex gap-4
                            cursor-pointer bg-slate-600/50 rounded-full p-1 transition-colors duration-200"
            >
              <svg
                className={`w-6 h-6 text-slate-300 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div
              data-active={isOpen}
              className={`
                   absolute left-0 mt-2 rounded-lg bg-slate-800 z-40 w-40
                   border border-slate-600/40 shadow-xl opacity-0 scale-95 -translate-y-1
                   transition-all duration-200 origin-top data-active:opacity-100 data-active:scale-100 data-active:translate-y-0
                  `}
            >
              <Link
                data-active={isOpen}
                to="/profile"
                className="w-full hidden data-active:flex justify-center items-center gap-2 px-4 py-3 text-sm text-white
                              hover:bg-slate-700/50 transition-colors rounded-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>{" "}
                اطلاعات کاربری
              </Link>
              {userInfo?.company_id !== null && (
                <Link
                  data-active={isOpen}
                  to={"/company-info"}
                  className="w-full hidden data-active:flex justify-center items-center gap-2 px-4 py-3 text-sm text-white
                            bg-slate-700/50 transition-colors rounded-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
                    />
                  </svg>
                  اطلاعات سازمان
                </Link>
              )}

              <button
                onClick={handleLogout}
                data-active={isOpen}
                className="w-full hidden data-active:flex justify-center items-center gap-2 px-4 py-3 text-sm text-red-400
                              hover:bg-slate-700/50 transition-colors rounded-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                خروج از حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
