/** Account roles as the backend names them, their Persian labels, and the helper that checks a role against an allowed list. */
export const ROLES = {
  superAdmin: "super_admin",
  orgAdmin: "org_admin",
  user: "user",
};

export const ROLE_LABELS = {
  [ROLES.superAdmin]: "سوپر ادمین",
  [ROLES.orgAdmin]: "ادمین سازمان",
  [ROLES.user]: "کاربر",
};

export const ADMIN_ROLES = [ROLES.superAdmin, ROLES.orgAdmin];

export const roleLabel = (role) => ROLE_LABELS[role] ?? role;

export const hasRole = (role, allowedRoles) => !allowedRoles || allowedRoles.includes(role);
