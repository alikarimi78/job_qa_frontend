/** The sidebar entries the signed-in role may see, each flagged as active when the current URL is that page or one of its sub-pages. */
import { useLocation } from "react-router-dom";
import { hasRole } from "@constants/roles";
import { useAppSelector } from "@store/hooks";
import { selectRole } from "@store/slices/authSlice";
import { MENU_ITEMS } from "../constants";

const isWithin = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

export default function useSidebarMenu() {
  const role = useAppSelector(selectRole);
  const { pathname } = useLocation();

  return MENU_ITEMS.filter((item) => hasRole(role, item.roles)).map((item) => ({
    ...item,
    isActive: isWithin(pathname, item.href),
  }));
}
