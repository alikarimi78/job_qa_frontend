import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "@components/ui/Input";
import SubmitBar from "@components/ui/SubmitBar";
import { useLoginMutation, useLazyCurrentUserQuery } from "@services/authApi";
import { landingPath } from "@routes/landing";
import { useAppDispatch } from "@store/hooks";
import { setAuthToken, setRoleUser, setUserInfo } from "@store/slices/authSlice";
import { showMessage } from "@utils/toast";
import { errorMessage } from "@utils/errors";
import { APP_TITLE, APP_SUBTITLE, ORGANISATION } from "@constant/config";
import Campus from "@assets/images/daneshgah.jpg";
import Logo from "@assets/images/logo.png";

const LoginIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 16l-4-4m0 0l4-4m-4 4h14M13 4h3a3 3 0 013 3v10a3 3 0 01-3 3h-3"
    />
  </svg>
);

export default function Login() {
  const methods = useForm({ defaultValues: { username: "", password: "" } });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();
  const [getCurrentUser] = useLazyCurrentUserQuery();
  const [isLoading, setIsLoading] = useState(false);

  const next = location.state?.from?.pathname;

  const submitHandler = async (data) => {
    setIsLoading(true);
    try {
      const token = await loginUser(data).unwrap();
      dispatch(
        setAuthToken({
          accessToken: token.access_token,
          role: token.role,
          username: data.username,
        })
      );

      const me = await getCurrentUser().unwrap();
      dispatch(setRoleUser(me.role));
      dispatch(setUserInfo(me));

      showMessage.success(`به ${APP_TITLE} خوش آمدید`);
      navigate(next ?? landingPath(me.role), { replace: true });
    } catch (err) {
      showMessage.error(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <img
        src={Campus}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-blue-950/85" />

      <div className="relative w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={Logo}
            width={96}
            height={96}
            alt="نشان پژوهشکده سرمایه انسانی"
            className="drop-shadow-2xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{APP_TITLE}</h1>
            <p className="text-sm text-slate-300 mt-1">{APP_SUBTITLE}</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="bg-white/95 backdrop-blur-sm py-6 md:py-8 px-6 w-full flex flex-col gap-6
                       border border-white/20 shadow-2xl rounded-2xl"
          >
            <div className="text-center pb-2 md:pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">ورود کاربران</h3>
              <p className="text-sm text-gray-500 mt-1">سامانه پرسش و پاسخ مشاغل</p>
            </div>

            <div className="flex flex-col gap-3 md:gap-5">
              <Input
                name="username"
                label="نام کاربری"
                placeholder="نام کاربری را وارد نمایید"
                className="w-full"
                inputProps={{ autoComplete: "username", autoFocus: true }}
                registerProps={{ required: "نام کاربری را وارد نمایید" }}
              />
              <Input
                name="password"
                type="password"
                label="کلمه عبور"
                placeholder="کلمه عبور را وارد نمایید"
                className="w-full"
                inputProps={{ autoComplete: "current-password" }}
                registerProps={{ required: "کلمه عبور را وارد نمایید" }}
              />
            </div>

            <SubmitBar
              label="ورود به سیستم"
              icon={<LoginIcon />}
              busy={isLoading}
              busyLabel="در حال ورود..."
              className="mt-1"
              hint="ایجاد حساب کاربری بر عهده مدیر سازمان شماست؛ امکان ثبت‌نام آزاد وجود ندارد."
            />
          </form>
        </FormProvider>

        <p className="text-[11px] font-light text-center text-slate-300 leading-5 px-4">
          کلیه حقوق این سامانه برای <strong className="font-bold">{ORGANISATION}</strong> محفوظ است.
        </p>
      </div>
    </div>
  );
}
