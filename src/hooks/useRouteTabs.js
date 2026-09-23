/** Treats sub-routes of a section as tabs: reports which tab the current URL is on and navigates when another tab is chosen. */
import { useLocation, useNavigate } from "react-router-dom";

export default function useRouteTabs(basePath, tabs) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeTab =
    tabs.find((tab) => tab.path && pathname.startsWith(`${basePath}/${tab.path}`)) ??
    tabs.find((tab) => !tab.path);

  const selectTab = (path) => navigate(`${basePath}/${path}`);

  return { activeTab: activeTab?.path, selectTab };
}
