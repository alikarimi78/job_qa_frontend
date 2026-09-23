/** One sidebar link with its icon; the active page is highlighted with a darker background and an edge marker. */
import { Link } from "react-router-dom";

export default function MenuItem({ href, icon: Icon, label, isActive }) {
  return (
    <li>
      <Link
        to={href}
        className={`
          group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium
          transition-all duration-300 ease-out overflow-hidden
          ${
            isActive
              ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-600/25"
              : "text-gray-700 hover:bg-gradient-to-r hover:from-slate-600/40 hover:to-slate-500/40 hover:text-white hover:shadow-sm"
          }
        `}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-slate-600/20" />
        )}

        <div
          className={`
            relative p-2 rounded-xl transition-all duration-300
            ${isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-600/50 group-hover:text-white"}
          `}
        >
          <Icon className="w-5 h-5" />
        </div>

        <span className="relative">{label}</span>

        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
        )}
      </Link>
    </li>
  );
}
