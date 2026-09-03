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
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const [changeOwnPassword, { isLoading: changingPassword }] = useChangeOwnPasswordMutation();
  const [changeOwnName, { isLoading: changingName }] = useChangeOwnNameMutation();
  const { data: me } = useCurrentUserQuery();

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
    dispatch(baseApi.util.resetApiState());
    showMessage.success("از حساب کاربری خارج شدید.");
    navigate("/login", { replace: true });
  };

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
