/** Sign-in logic: the username/password form, the show-password toggle, and submitting — store the token, fetch the profile, then go back to the page that asked for a login (or the role's landing page). */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_TITLE } from "@constants/appInfo";
import useToggle from "@hooks/useToggle";
import { landingPathFor } from "@routes/paths";
import { useLazyCurrentUserQuery, useLoginMutation } from "@services/authApi";
import { useAppDispatch } from "@store/hooks";
import { setAuthToken, setUserInfo } from "@store/slices/authSlice";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export default function useLogin() {
  const methods = useForm({ defaultValues: { username: "", password: "" } });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [fetchCurrentUser] = useLazyCurrentUserQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, togglePasswordVisible] = useToggle(false);

  const redirectPath = location.state?.from?.pathname;

  const signIn = async (credentials) => {
    setIsSubmitting(true);
    try {
      const token = await login(credentials).unwrap();
      dispatch(
        setAuthToken({
          accessToken: token.access_token,
          role: token.role,
          username: credentials.username,
        })
      );

      const currentUser = await fetchCurrentUser().unwrap();
      dispatch(setUserInfo(currentUser));

      showMessage.success(`به ${APP_TITLE} خوش آمدید`);
      navigate(redirectPath ?? landingPathFor(currentUser.role), { replace: true });
    } catch (error) {
      showMessage.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    submit: methods.handleSubmit(signIn),
    isSubmitting,
    isPasswordVisible,
    togglePasswordVisible,
  };
}
