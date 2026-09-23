/** Full-screen message for error routes such as 404 and 403: a large code, an icon, a title, an explanation and a way back. */
import { Link } from "react-router-dom";

export default function StatusScreen({ code, icon: Icon, title, message, actionLabel, actionTo }) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="w-full max-w-lg flex flex-col items-center gap-5 text-center bg-white/95 rounded-2xl border border-white/40 shadow-xl shadow-slate-900/5 p-8 md:p-10">
        <span
          aria-hidden="true"
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                     shadow-lg shadow-indigo-600/25 flex items-center justify-center [&>svg]:size-8"
        >
          <Icon />
        </span>
        <p className="text-5xl font-bold text-slate-800 m-0 leading-none fa-nums">{code}</p>
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0 leading-9">{title}</h1>
          <p className="text-sm text-slate-500 mt-2 mb-0 leading-7 text-center">{message}</p>
        </div>
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-medium
                     text-white bg-blue-600 hover:bg-blue-700 border border-blue-600
                     shadow-lg shadow-blue-600/20 transition-all duration-200"
        >
          {actionLabel}
        </Link>
      </section>
    </main>
  );
}
