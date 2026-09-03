import { ADMIN_ROLES } from "@routes/roles";

const icon = (path) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </>
);

const ListIcon = icon(
  <>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </>
);

const ShieldIcon = icon(
  <>
    <path d="M12 3l7 3v6c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>
);

const UsersIcon = icon(
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87" />
  </>
);

const ChartIcon = icon(
  <>
    <path d="M3 3v18h18" />
    <path d="M7 15v3M12 10v8M17 6v12" />
  </>
);

const BuildingIcon = icon(
  <>
    <path d="M3 21h18" />
    <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
    <path d="M19 21V11a2 2 0 00-2-2h-2" />
    <path d="M9 7h2M9 11h2M9 15h2" />
  </>
);

const BriefcaseIcon = icon(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    <path d="M3 12h18" />
  </>
);

export const menuItems = [
  {
    href: "/manage/dashboard",
    label: "داشبورد",
    icon: ChartIcon,
    roles: ADMIN_ROLES,
  },
  {
    href: "/search",
    label: "جستجوی شغل",
    icon: SearchIcon,
  },
  {
    href: "/suggestions",
    label: "پیشنهادها",
    icon: ListIcon,
  },
  {
    href: "/manage/organizations",
    label: "مدیریت سازمان‌ها",
    icon: BuildingIcon,
    roles: ["super_admin"],
  },
  {
    href: "/manage/accounts",
    label: "مدیریت کاربران",
    icon: UsersIcon,
    roles: ADMIN_ROLES,
  },
  {
    href: "/manage/jobs",
    label: "مدیریت مشاغل",
    icon: BriefcaseIcon,
    roles: ["super_admin"],
  },
  {
    href: "/admin",
    label: "بررسی پیشنهادها",
    icon: ShieldIcon,
    roles: ["super_admin"],
  },
];

export default menuItems;
