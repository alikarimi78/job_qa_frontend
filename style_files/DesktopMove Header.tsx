import Button from "@components/ui/Button";
import { useAppSelector } from "@store/hooks";
import { Link, useLocation } from "react-router";
import MenIcon from "@assets/images/man.webp";
import WomenIcon from "@assets/images/women.png";
export default function DesktopMode({
  isOpen,
  dropdownRef,
  setIsOpen,
  handleLogout,
  handleBackToDashboard,
}) {
  const location = useLocation();

  const userInfo = useAppSelector((state) => state.auth.userInfo);
  return (
    <div className="flex items-center md:justify-between px-6 h-16">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex  items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <svg
              className="w-6 h-6 text-white "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl fold-bold text-white">
              سامانه سنجش و پایش
            </h1>
            <div className="flex items-center justify-start font-semibold gap-2 text-xs text-slate-300">
              {/* <span>نسخه 0.9.0</span> */}
              <span>پنل مدیریت</span>
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex items-center gap-4 hidden">
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex gap-4 ml-2 justify-between px-2 py-1 items-center bg-slate-700/50 rounded-lg border border-slate-600/30
                       cursor-pointer hover:bg-slate-600/50 transition-colors duration-200"
          >
            <img
              src={
                userInfo?.gender || userInfo?.gender === null
                  ? MenIcon
                  : WomenIcon
              }
              alt="user gender"
              height={46}
              width={46}
            />
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">
                {userInfo?.firstname} {userInfo?.lastname}
              </span>
              <span className="text-xs text-slate-300">خوش‌آمدید</span>
            </div>
            <svg
              className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
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
              absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 z-40
              border border-slate-600/40 shadow-xl opacity-0 scale-95 -translate-y-1
              transition-all duration-200 origin-top data-active:opacity-100 data-active:scale-100 data-active:translate-y-0
            `}
          >
            <Link
              data-active={isOpen}
              to="/profile"
              className="w-full hidden data-active:flex items-center gap-2 px-4 py-3 text-sm text-white
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
                className="w-full hidden data-active:flex  items-center gap-2 px-4 py-3 text-sm text-white
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
                    d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
                  />
                </svg>
                اطلاعات سازمان
              </Link>
            )}

            <button
              onClick={handleLogout}
              data-active={isOpen}
              className="w-full hidden data-active:flex  items-center gap-2 px-4 py-3 text-sm text-red-400
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

        {location.pathname.includes("questions") && (
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
        )}
      </div>
    </div>
  );
}
