import { KeyGlyph, PencilGlyph } from "@components/ui/IconButton";
import { ROLE_LABELS } from "@routes/roles";

// The reference dropdown links to /profile and /company-info. Neither page exists here
// — and `UserOut` carries no name or gender to build one from — so the same panel shows
// what /auth/me actually answers: the username, the role, and where the account sits.
export function AccountSummary({ username, role, userInfo }) {
  const place = userInfo?.organization?.name ?? "";

  return (
    <div className="px-4 py-3 border-b border-slate-600/40">
      {/* The person leads when the account has a name, with the credential under it —
          an account created before migration 0007 still shows the username alone. */}
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

/**
 * What the panel offers under the summary, in both header modes. The two used to carry
 * one copy each of the logout button and drifted apart the moment there was a second
 * action to add — the panel's body lives here now, beside the summary it sits under.
 *
 * «تغییر رمز» and «ویرایش نام» are here as well as on the caller's own row in
 * `/manage/accounts`, because that page is admin-only: an ordinary user has no other way
 * to reach either dialog, and an org_admin does not appear in its own account listing at
 * all. The name matters here for a second reason — a report is headed by it, and the
 * seeded first super_admin is created from environment variables that carry no name.
 */
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
        {/* The same key the accounts table draws for the same action — that is what
            `ui/IconButton`'s glyphs are there for, and it is already `w-4 h-4`. */}
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
