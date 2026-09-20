import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { Spinner } from "@components/ui/Loader";
import { useLoginMutation, useLazyCurrentUserQuery } from "@services/authApi";
import { landingPath } from "@routes/landing";
import { useAppDispatch } from "@store/hooks";
import { setAuthToken, setRoleUser, setUserInfo } from "@store/slices/authSlice";
import { showMessage } from "@utils/toast";
import { errorMessage } from "@utils/errors";
import { APP_TITLE, APP_SUBTITLE, ORGANISATION, UNIVERSITY } from "@constant/config";
import Illustration from "@assets/images/login-analysis.svg";
import Logo from "@assets/images/logo.png";

const glyph = (path) => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const LoginIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 16l-4-4m0 0l4-4m-4 4h14M13 4h3a3 3 0 013 3v10a3 3 0 01-3 3h-3"
    />
  </svg>
);

const EyeGlyph = glyph(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);

const EyeOffGlyph = glyph(
  <>
    <path d="M10.6 6.2A9.9 9.9 0 0112 6c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.6 6.6A17 17 0 002 13s3.6 7 10 7a9.9 9.9 0 004.2-.9" />
    <path d="M9.9 9.9a3 3 0 104.2 4.2M3 3l18 18" />
  </>,
);

// What the system does, named in the three things a reader can do with it once inside.
const FEATURES = [
  {
    title: "تحلیل شغل با نام آن",
    body: "وظایف، مهارت‌ها، دانش، ابزارها و مسیر پیشرفت هر شغل، در یک نگاه.",
    icon: glyph(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </>,
    ),
  },
  {
    title: "تحلیل شخصی بر پایه توانمندی‌ها",
    body: "آنچه می‌دانید و می‌توانید را وارد نمایید تا نزدیک‌ترین مشاغل رتبه‌بندی شوند.",
    icon: glyph(
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>,
    ),
  },
  {
    title: "گزارش رسمی هر تحلیل",
    body: "نتیجه هر تحلیل را به‌صورت گزارش PDF دریافت و بایگانی نمایید.",
    icon: glyph(
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M9 15h6M9 11h3" />
      </>,
    ),
  },
];

export default function Login() {
  const methods = useForm({ defaultValues: { username: "", password: "" } });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();
  const [getCurrentUser] = useLazyCurrentUserQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // The form takes the page's own side — the start of an RTL line — and the picture the other; the
  // form is therefore first in the document, which also puts it first on a narrow screen.
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-[minmax(340px,30%)_1fr]">
      <section className="flex items-center justify-center lg:justify-start px-6 py-10 sm:px-10 lg:ps-10 lg:pe-6">
        <div className="w-full max-w-[340px] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              width={56}
              height={56}
              alt="نشان پژوهشکده سرمایه انسانی"
              className="w-14 h-14 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-800 leading-7 m-0">{UNIVERSITY}</h1>
              <p className="text-xs text-slate-500 mt-0.5 mb-0 leading-5">{APP_SUBTITLE}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 m-0 leading-8">ورود به سامانه</h2>
            <p className="text-sm text-slate-500 mt-1 mb-0 leading-6">
              برای استفاده از تحلیل مشاغل، با حساب کاربری خود وارد شوید.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitHandler)} className="flex flex-col gap-5">
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
                type={showPassword ? "text" : "password"}
                label="کلمه عبور"
                placeholder="کلمه عبور را وارد نمایید"
                className="w-full"
                inputProps={{ autoComplete: "current-password" }}
                registerProps={{ required: "کلمه عبور را وارد نمایید" }}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((was) => !was)}
                    title={showPassword ? "پنهان کردن کلمه عبور" : "نمایش کلمه عبور"}
                    aria-label={showPassword ? "پنهان کردن کلمه عبور" : "نمایش کلمه عبور"}
                    className="w-8 h-8 rounded-lg inline-flex items-center justify-center cursor-pointer
                               text-slate-400 hover:text-slate-700 transition-colors duration-200
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {showPassword ? EyeOffGlyph : EyeGlyph}
                  </button>
                }
              />

              <Button
                variant="primary"
                size="xl"
                className="w-full mt-1"
                buttonProps={{ type: "submit", disabled: isLoading }}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    ورود به سامانه
                    {LoginIcon}
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-400 leading-6 m-0">
                ایجاد حساب کاربری بر عهده مدیر سازمان شماست؛ امکان ثبت‌نام آزاد وجود ندارد.
              </p>
            </form>
          </FormProvider>

          <p className="text-[11px] text-slate-400 leading-5 m-0">
            کلیه حقوق این سامانه برای <strong className="font-bold">{ORGANISATION}</strong> محفوظ
            است.
          </p>
        </div>
      </section>

      {/* The picture side: what the system is, over a dark ground, with the illustration between the
          text and the three things it does. */}
      <section className="relative overflow-hidden text-white min-h-[20rem] lg:min-h-screen
                          bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div
          aria-hidden="true"
          className="absolute -top-28 -start-28 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 end-0 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl"
        />

        <div className="relative h-full flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-lg min-w-0 flex flex-col gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-blue-100">
                هوش مصنوعی در خدمت انتخاب شغل
              </span>
              <h2 className="text-2xl md:text-3xl font-bold leading-10 mt-4 mb-0 break-words">
                {APP_TITLE}
              </h2>
              <p className="text-sm md:text-[15px] text-blue-100/90 leading-8 mt-3 mb-0">
                این سامانه بیش از هزار شغل را با وظایف، مهارت‌ها، دانش، ابزارها و مسیر پیشرفت آن‌ها
                گرد آورده است. نام یک شغل را بپرسید تا مشخصات کامل آن را ببینید، یا توانمندی‌های خود
                را وارد نمایید تا نزدیک‌ترین مشاغل به شما رتبه‌بندی شوند.
              </p>
            </div>

            <img
              src={Illustration}
              alt=""
              aria-hidden="true"
              className="hidden sm:block w-full max-w-md mx-auto opacity-95"
            />

            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-blue-100
                               flex items-center justify-center shrink-0"
                  >
                    {feature.icon}
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-sm font-bold leading-6">{feature.title}</strong>
                    <p className="text-xs text-blue-100/80 leading-6 m-0">{feature.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
