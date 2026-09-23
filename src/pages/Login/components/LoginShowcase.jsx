/** The dark wide side of the login page introducing the system: title, description, illustration and feature list. */
import Illustration from "@assets/images/login-analysis.svg";
import { APP_TITLE } from "@constants/appInfo";
import { LOGIN_FEATURES } from "../constants";

function FeatureItem({ title, body, icon: Icon }) {
  return (
    <li className="flex items-start gap-3 min-w-0">
      <span
        aria-hidden="true"
        className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-blue-100
                   flex items-center justify-center shrink-0"
      >
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <strong className="block text-sm font-bold leading-6">{title}</strong>
        <p className="text-xs text-blue-100/80 leading-6 m-0">{body}</p>
      </div>
    </li>
  );
}

export default function LoginShowcase() {
  return (
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
            {LOGIN_FEATURES.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
