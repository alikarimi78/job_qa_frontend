/** State of the main layout: whether the screen is mobile-sized, whether the sidebar is open (it closes itself after navigating on mobile), and the browser-tab title of the current page. */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useDocumentTitle from "@hooks/useDocumentTitle";
import useMediaQuery from "@hooks/useMediaQuery";
import { MOBILE_LAYOUT_QUERY, PAGE_TITLES } from "../constants";

export default function useMainLayout() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(MOBILE_LAYOUT_QUERY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useDocumentTitle(PAGE_TITLES[pathname]);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [pathname, isMobile]);

  return {
    isMobile,
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen((wasOpen) => !wasOpen),
    closeSidebar: () => setIsSidebarOpen(false),
  };
}
