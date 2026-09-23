/** Frame of every signed-in page: header on top, sidebar on the right, and the current page scrolling in the remaining space. */
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import useMainLayout from "./hooks/useMainLayout";

export default function MainLayout() {
  const { isMobile, isSidebarOpen, toggleSidebar, closeSidebar } = useMainLayout();

  return (
    <div className="flex flex-col h-screen">
      <Header onToggleSidebar={toggleSidebar} />
      <main className="flex flex-1 gap-2 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div
          data-active={isMobile || undefined}
          className="flex flex-col gap-6 data-active:p-3 p-8 w-full overflow-y-auto [scrollbar-gutter:stable]"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
