import { KeyGlyph, PencilGlyph } from "@components/ui/IconButton";
import { ROLE_LABELS } from "@routes/roles";

export function AccountSummary({ username, role, userInfo }) {
  const place = userInfo?.organization?.name ?? "";

  return (
    <div className="px-4 py-3 border-b border-slate-600/40">
      <p className="text-sm text-white font-medium truncate">
        {userInfo?.full_name || username}
      </p>
      {userInfo?.full_name && (
        <p className="text-xs text-slate-400 mt-0.5 truncate">{username}</p>
      )}
      <p className="text-xs text-slate-300 mt-0.5">{ROLE_LABELS[role] ?? role}</p>
      {place && <p className="text-xs text-slate-400 mt-1 leading-5">{place}</p>}
    </div>
  );
}

export function AccountActions({ onChangeName, onChangePassword, onLogout }) {
  const item =
    "w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer";

  return (
    <>
      <button onClick={onChangeName} className={`${item} text-slate-200`}>
        {PencilGlyph}
        ویرایش نام
      </button>
      <button onClick={onChangePassword} className={`${item} text-slate-200`}>
        {KeyGlyph}
        تغییر رمز
      </button>
      <button onClick={onLogout} className={`${item} text-red-400 border-t border-slate-600/40`}>
        <LogoutIcon />
        خروج از حساب
      </button>
    </>
  );
}

export const AvatarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const LogoutIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export const ChevronIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
