export const ROLE_LABELS = {
  super_admin: "سوپر ادمین",
  org_admin: "ادمین سازمان",
  user: "کاربر",
};

export const ADMIN_ROLES = ["super_admin", "org_admin"];

// The reference sidebar gates its menu on permissions fetched from the server. This
// backend has no permission endpoint — it has three roles, re-read from the database on
// every request — so the same gate keys on the role instead. An item with no `roles`
// is open to anyone signed in.
export function hasRole(role, required) {
  if (!required || required.length === 0) return true;
  return required.includes(role);
}

export default hasRole;
