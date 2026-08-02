import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import { PAGE_TITLES } from "@constant/pageTitles";
import { APP_TITLE } from "@constant/config";
import { useMediaQuery } from "@hook/useMediaQuery";

export default function MainLayout() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  document.title = PAGE_TITLES[location.pathname]
    ? `${PAGE_TITLES[location.pathname]} - ${APP_TITLE}`
    : APP_TITLE;

  // On a phone the sidebar covers the page, so following a link has to close it
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex flex-1 gap-2 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        {/* The reference keeps `overflow-hidden` on <main> and scrolls inside each
            page. The management page is far taller than a viewport, so the scroll
            lives here instead — otherwise its lower half is simply unreachable. */}
        <div
          data-active={isMobile || undefined}
          className="flex flex-col gap-6 data-active:p-3 p-8 w-full overflow-y-auto"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
