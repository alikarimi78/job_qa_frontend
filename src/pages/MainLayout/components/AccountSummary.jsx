/** Top of the account dropdown: the user's full name (or username), username, role and organization. */
import { roleLabel } from "@constants/roles";

export default function AccountSummary({ username, role, userInfo }) {
  const organizationName = userInfo?.organization?.name ?? "";

  return (
    <div className="px-4 py-3 border-b border-slate-600/40">
      <p className="text-sm text-white font-medium truncate">{userInfo?.full_name || username}</p>
      {userInfo?.full_name && <p className="text-xs text-slate-400 mt-0.5 truncate">{username}</p>}
      <p className="text-xs text-slate-300 mt-0.5">{roleLabel(role)}</p>
      {organizationName && <p className="text-xs text-slate-400 mt-1 leading-5">{organizationName}</p>}
    </div>
  );
}
