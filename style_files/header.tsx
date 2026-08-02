import { useNavigate } from "react-router";
import { useAppDispatch } from "@store/hooks";
import { showMessage } from "@utils/toast";
import { logoutUser } from "@store/slices/authSlice";
import { useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@hook/useMediaQuery";
import MobileMode from "./components/MobileMode";
import DesktopMode from "./components/DesktopMove";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 1120px)");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    showMessage.success("شما خارج شدید");
    navigate("/login");
  };

  const handleBackToDashboard = () => {
    navigate(-1);
  };

  return (
    <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {isMobile ? (
        <MobileMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleBackToDashboard={handleBackToDashboard}
          toggleSidebar={toggleSidebar}
        />
      ) : (
        <DesktopMode
          dropdownRef={dropdownRef}
          handleBackToDashboard={handleBackToDashboard}
          handleLogout={handleLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
