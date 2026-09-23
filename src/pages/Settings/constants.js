/** The tabs of the settings section and which roles may open each one. */
import { BuildingIcon, UsersIcon } from "@components/icons";
import { ADMIN_ROLES, ROLES, hasRole } from "@constants/roles";
import { PATHS } from "@routes/paths";

export const SETTINGS_BASE_PATH = PATHS.settings;

const SETTINGS_TABS = [
  { path: "organizations", label: "مدیریت سازمان‌ها", icon: BuildingIcon, roles: [ROLES.superAdmin] },
  { path: "accounts", label: "مدیریت کاربران", icon: UsersIcon, roles: ADMIN_ROLES },
];

export const settingsTabsFor = (role) => SETTINGS_TABS.filter((tab) => hasRole(role, tab.roles));
