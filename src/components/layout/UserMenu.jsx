import { ROLE_LABELS } from "@routes/roles";

// The reference dropdown links to /profile and /company-info. Neither page exists here
// — and `UserOut` carries no name or gender to build one from — so the same panel shows
// what /auth/me actually answers: the username, the role, and where the account sits.
export function AccountSummary({ username, role, userInfo }) {
  const place = [userInfo?.organization?.name, userInfo?.unit?.name].filter(Boolean).join(" / ");

  return (
    <div className="px-4 py-3 border-b border-slate-600/40">
      <p className="text-sm text-white font-medium truncate">{username}</p>
      <p className="text-xs text-slate-300 mt-0.5">{ROLE_LABELS[role] ?? role}</p>
      {place && <p className="text-xs text-slate-400 mt-1 leading-5">{place}</p>}
    </div>
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
