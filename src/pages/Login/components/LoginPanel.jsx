/** The narrow side of the login page: organization logo and name, the heading, the sign-in form and the copyright line. */
import Logo from "@assets/images/logo.png";
import { APP_SUBTITLE, OWNER_ORGANIZATION, UNIVERSITY_NAME } from "@constants/appInfo";
import LoginForm from "./LoginForm";

export default function LoginPanel({ login }) {
  return (
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
            <h1 className="text-base font-bold text-slate-800 leading-7 m-0">{UNIVERSITY_NAME}</h1>
            <p className="text-xs text-slate-500 mt-0.5 mb-0 leading-5">{APP_SUBTITLE}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 m-0 leading-8">ورود به سامانه</h2>
          <p className="text-sm text-slate-500 mt-1 mb-0 leading-6">
            برای استفاده از تحلیل مشاغل، با حساب کاربری خود وارد شوید.
          </p>
        </div>

        <LoginForm login={login} />

        <p className="text-[11px] text-slate-400 leading-5 m-0">
          کلیه حقوق این سامانه برای <strong className="font-bold">{OWNER_ORGANIZATION}</strong> محفوظ
          است.
        </p>
      </div>
    </section>
  );
}
