/** Logic behind the header's account menu: opening and closing the dropdown, the change-name and change-password dialogs and their requests, keeping the stored profile fresh, and signing out. */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useChangeOwnNameMutation,
  useChangeOwnPasswordMutation,
  useCurrentUserQuery,
} from "@services/authApi";
import { baseApi } from "@services/baseApi";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { logoutUser, selectAuth, setUserInfo } from "@store/slices/authSlice";
import useClickOutside from "@hooks/useClickOutside";
import { PATHS } from "@routes/paths";
import { runAction } from "@utils/runAction";
import { showMessage } from "@utils/toast";
import { ACCOUNT_DIALOGS } from "../constants";

export default function useAccountMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username, role, userInfo } = useAppSelector(selectAuth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const menuRef = useClickOutside(() => setIsMenuOpen(false));

  const { data: currentUser } = useCurrentUserQuery();
  const [changeOwnPassword, { isLoading: isChangingPassword }] = useChangeOwnPasswordMutation();
  const [changeOwnName, { isLoading: isChangingName }] = useChangeOwnNameMutation();

  useEffect(() => {
    if (currentUser) dispatch(setUserInfo(currentUser));
  }, [currentUser, dispatch]);

  const openFromMenu = (dialog) => {
    setIsMenuOpen(false);
    setOpenDialog(dialog);
  };

  const logout = () => {
    dispatch(logoutUser());
    dispatch(baseApi.util.resetApiState());
    showMessage.success("از حساب کاربری خارج شدید.");
    navigate(PATHS.login, { replace: true });
  };

  return {
    account: { username, role, userInfo },
    currentUser,
    menuRef,
    isMenuOpen,
    toggleMenu: () => setIsMenuOpen((wasOpen) => !wasOpen),
    openDialog,
    closeDialog: () => setOpenDialog(null),
    menuActions: {
      onChangeName: () => openFromMenu(ACCOUNT_DIALOGS.name),
      onChangePassword: () => openFromMenu(ACCOUNT_DIALOGS.password),
      onLogout: logout,
    },
    isChangingPassword,
    isChangingName,
    changePassword: (values, onSuccess) =>
      runAction(() => changeOwnPassword(values), "رمز عبور شما تغییر یافت.", onSuccess),
    changeName: (values, onSuccess) =>
      runAction(() => changeOwnName(values), "نام شما ثبت شد.", onSuccess),
  };
}
