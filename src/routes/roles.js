export const ROLE_LABELS = {
  super_admin: "سوپر ادمین",
  org_admin: "ادمین سازمان",
  user: "کاربر",
};

export const ADMIN_ROLES = ["super_admin", "org_admin"];

export function hasRole(role, required) {
  if (!required || required.length === 0) return true;
  return required.includes(role);
}

export default hasRole;
