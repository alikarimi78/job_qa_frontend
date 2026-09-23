/** Configuration of the main layout: the sidebar menu (with the roles allowed to see each entry), the browser-tab title of each page, the screen widths where the layout switches to its mobile form, and the dialogs of the account menu. */
import {
  BarChartIcon,
  BriefcaseIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
} from "@components/icons";
import { ADMIN_ROLES } from "@constants/roles";
import { PATHS } from "@routes/paths";

export const MENU_ITEMS = [
  { href: PATHS.dashboard, label: "پیشخوان", icon: BarChartIcon, roles: ADMIN_ROLES },
  { href: PATHS.search, label: "تحلیل هوشمند مشاغل", icon: SearchIcon },
  { href: PATHS.suggestions, label: "تحلیل شخصی", icon: ListIcon },
  { href: PATHS.manageJobs, label: "مدیریت مشاغل", icon: BriefcaseIcon, roles: ADMIN_ROLES },
  { href: PATHS.settings, label: "تنظیمات", icon: SettingsIcon, roles: ADMIN_ROLES },
];

export const PAGE_TITLES = {
  [PATHS.search]: "تحلیل هوشمند مشاغل",
  [PATHS.suggestions]: "تحلیل شخصی",
  [PATHS.dashboard]: "پیشخوان",
  [PATHS.manageJobs]: "لیست مشاغل",
  [PATHS.suggestionReviews]: "بررسی پیشنهادها",
  [PATHS.organizations]: "مدیریت سازمان‌ها",
  [PATHS.accounts]: "مدیریت کاربران",
};

export const MOBILE_LAYOUT_QUERY = "(max-width: 768px)";
export const MOBILE_HEADER_QUERY = "(max-width: 1120px)";

export const ACCOUNT_DIALOGS = { password: "password", name: "name" };
