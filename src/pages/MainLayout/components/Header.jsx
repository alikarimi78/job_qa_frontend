/** Top bar of every signed-in page; picks the desktop or mobile layout by screen width and hosts the account dialogs. */
import useMediaQuery from "@hooks/useMediaQuery";
import { MOBILE_HEADER_QUERY } from "../constants";
import useAccountMenu from "../hooks/useAccountMenu";
import AccountDialogs from "./AccountDialogs";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

export default function Header({ onToggleSidebar }) {
  const isMobile = useMediaQuery(MOBILE_HEADER_QUERY);
  const menu = useAccountMenu();

  return (
    <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {isMobile ? (
        <MobileHeader menu={menu} onToggleSidebar={onToggleSidebar} />
      ) : (
        <DesktopHeader menu={menu} />
      )}

      <AccountDialogs menu={menu} />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
