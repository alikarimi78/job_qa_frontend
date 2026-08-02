import { ADMIN_ROLES } from "@routes/roles";

// The reference menu points `iconSrc` at an svg file and recolours it with
// `brightness-0 invert` filters. No icon assets came with the style files, so the icon
// is a node here instead and takes its colour from `currentColor` — the same two states,
// without a filter stack.
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

const PlusIcon = icon(
  <>
    <path d="M12 5v14M5 12h14" />
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

// `roles` is the gate the sidebar filters on. An item with none is open to anyone
// signed in; a parent whose children are all filtered out disappears with them.
export const menuItems = [
  {
    href: "/",
    label: "جستجوی شغل",
    icon: SearchIcon,
  },
  {
    href: "/suggest",
    label: "پیشنهاد شغل",
    icon: PlusIcon,
  },
  {
    href: "/my-suggestions",
    label: "پیشنهادهای من",
    icon: ListIcon,
  },
  {
    label: "مدیریت",
    icon: ShieldIcon,
    roles: ADMIN_ROLES,
    submenuItems: [
      { label: "حساب‌ها و سازمان‌ها", href: "/manage", roles: ADMIN_ROLES, icon: UsersIcon },
      { label: "بررسی پیشنهادها", href: "/admin", roles: ["super_admin"] },
    ],
  },
];

export default menuItems;
