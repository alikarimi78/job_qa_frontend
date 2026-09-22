export const ROLE_LABELS = {
  super_admin: "سوپر ادمین",
  org_admin: "ادمین سازمان",
  user: "کاربر",
};

export const ADMIN_ROLES = ["super_admin", "org_admin"];

export const hasRole = (role, required) => !required || required.includes(role);
