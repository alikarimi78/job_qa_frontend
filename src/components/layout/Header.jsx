import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { showMessage } from "@utils/toast";
import { logoutUser } from "@store/slices/authSlice";
import { baseApi } from "@services/baseApi";
import { useChangeOwnPasswordMutation } from "@services/authApi";
import { useMediaQuery } from "@hook/useMediaQuery";
import { SelfPasswordDialog } from "@components/manage/Forms";
import { runAction } from "@utils/action";
import MobileMode from "./MobileMode";
import DesktopMode from "./DesktopMode";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  // The dialog is owned here rather than in the two header modes, so only one of it
  // exists whichever mode is drawn, and it survives the switch across the breakpoint.
  const [passwordOpen, setPasswordOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const [changeOwnPassword, { isLoading: changingPassword }] = useChangeOwnPasswordMutation();

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

  // The dropdown gets out of the way: the dialog is modal, and a panel left open behind
  // it would still be there when the dialog closes.
  const handleChangePassword = () => {
    setIsOpen(false);
    setPasswordOpen(true);
  };

  return (
    <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {isMobile ? (
        <MobileMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          handleChangePassword={handleChangePassword}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleSidebar={toggleSidebar}
        />
      ) : (
        <DesktopMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          handleChangePassword={handleChangePassword}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      {/* Every account has this, at every role: `POST /auth/password` acts on the
          caller alone and asks for the current password, which is what an admin's
          authority stands in for on `/accounts/{id}/password`. The token keeps working
          afterwards — it identifies the account, not the password. */}
      <SelfPasswordDialog
        open={passwordOpen}
        title="تغییر رمز عبور"
        hint="رمز فعلی پرسیده می‌شود، چون اینجا چیزی جز نشست باز شما ثابت نمی‌کند که صاحب حساب هستید."
        busy={changingPassword}
        onClose={() => setPasswordOpen(false)}
        onSubmit={(values, done) =>
          runAction(() => changeOwnPassword(values), "رمز شما تغییر کرد.", done)
        }
      />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
