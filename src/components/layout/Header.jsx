import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { showMessage } from "@utils/toast";
import { logoutUser } from "@store/slices/authSlice";
import { baseApi } from "@services/baseApi";
import { useMediaQuery } from "@hook/useMediaQuery";
import MobileMode from "./MobileMode";
import DesktopMode from "./DesktopMode";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 1120px)");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    // Without this the next account to sign in on this browser is shown the previous
    // one's cached accounts and suggestions until each query refetches.
    dispatch(baseApi.util.resetApiState());
    showMessage.success("شما خارج شدید");
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {isMobile ? (
        <MobileMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleSidebar={toggleSidebar}
        />
      ) : (
        <DesktopMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
