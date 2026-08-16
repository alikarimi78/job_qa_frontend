import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { showMessage } from "@utils/toast";
import { logoutUser, setUserInfo } from "@store/slices/authSlice";
import { baseApi } from "@services/baseApi";
import {
  useChangeOwnNameMutation,
  useChangeOwnPasswordMutation,
  useCurrentUserQuery,
} from "@services/authApi";
import { useMediaQuery } from "@hook/useMediaQuery";
import { PersonNameDialog, SelfPasswordDialog } from "@components/manage/Forms";
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
  const [nameOpen, setNameOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const [changeOwnPassword, { isLoading: changingPassword }] = useChangeOwnPasswordMutation();
  const [changeOwnName, { isLoading: changingName }] = useChangeOwnNameMutation();
  // Only for the dialog's starting values — the panel itself reads the persisted session.
  const { data: me } = useCurrentUserQuery();

  // The dropdown's summary is drawn from the persisted session, which was written at
  // login and would otherwise still show the old name after this dialog changes it.
  // `/auth/me` is invalidated by that mutation, so this refills the store when it comes
  // back — and keeps the session honest about a rename an admin made elsewhere.
  useEffect(() => {
    if (me) dispatch(setUserInfo(me));
  }, [me, dispatch]);

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
    showMessage.success("از حساب کاربری خارج شدید.");
    navigate("/login", { replace: true });
  };

  // The dropdown gets out of the way: the dialog is modal, and a panel left open behind
  // it would still be there when the dialog closes.
  const handleChangePassword = () => {
    setIsOpen(false);
    setPasswordOpen(true);
  };

  const handleChangeName = () => {
    setIsOpen(false);
    setNameOpen(true);
  };

  return (
    <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {isMobile ? (
        <MobileMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          handleChangePassword={handleChangePassword}
          handleChangeName={handleChangeName}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleSidebar={toggleSidebar}
        />
      ) : (
        <DesktopMode
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
          handleChangePassword={handleChangePassword}
          handleChangeName={handleChangeName}
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
          runAction(() => changeOwnPassword(values), "رمز عبور شما تغییر یافت.", done)
        }
      />

      {/* The caller's own name — «شما» on every report they print. No password asked
          for: a name is not a credential. This and the accounts table's own row are the
          two ways to it, and this is the only one an ordinary user or an org_admin has. */}
      <PersonNameDialog
        open={nameOpen}
        title="ویرایش نام"
        hint="این نام در سربرگ گزارش‌های PDF شما چاپ می‌شود. نام کاربری تغییر نمی‌کند."
        initial={me}
        busy={changingName}
        onClose={() => setNameOpen(false)}
        onSubmit={(values, done) =>
          runAction(() => changeOwnName(values), "نام شما ثبت شد.", done)
        }
      />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
