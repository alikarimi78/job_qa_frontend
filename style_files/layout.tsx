import { Outlet, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import NetWorkStatus from "@components/NetWorkStatus";
import Header from "@components/header";
import SideBar from "@components/sidebar";
import store, { persistor } from "@store/store";
import { PAGE_TITLES } from "@constant/pageTitles";
import { useMediaQuery } from "@hook/useMediaQuery";
import { useEffect, useState } from "react";
import { APP_TITLE } from "@constant/config";

export default function MainLayout() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  document.title = PAGE_TITLES[location.pathname]
    ? `${PAGE_TITLES[location.pathname]} - سامانه سنجش و پایش`
    : APP_TITLE;
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NetWorkStatus />
        <div className="flex flex-col h-screen">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex flex-1 gap-2  overflow-hidden bg-[#f4f7f6] bg-gradient-to-br from-blue-50 to-indigo-100">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div
              data-active={isMobile}
              className="flex flex-col gap-8 data-active:p-2 p-8 w-full rounded-lg"
            >
              <Outlet />
              <Toaster
                containerStyle={{ zIndex: 99999999 }}
                toastOptions={{
                  style: {
                    zIndex: 99999999,
                  },
                }}
              />
            </div>
          </main>
        </div>
      </PersistGate>
    </Provider>
  );
}
