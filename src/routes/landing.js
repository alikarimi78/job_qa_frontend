import { ADMIN_ROLES } from "./roles";

// Where a session opens. An admin lands on the dashboard — it is the overview the rest
// of their work starts from, and the first thing they asked to see after signing in.
// An ordinary user has no dashboard at all (`GET /stats` is admin-only), so for them the
// system opens on the thing they came to do.
//
// Used in two places that must agree: the redirect after a successful login, and «/»
// itself, so a persisted session reloading the root lands in the same place rather than
// on whichever page the root happens to render.
export function landingPath(role) {
  return ADMIN_ROLES.includes(role) ? "/manage/dashboard" : "/search";
}

export default landingPath;
