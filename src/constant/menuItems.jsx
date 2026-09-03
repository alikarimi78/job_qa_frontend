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

// `roles` is the gate the sidebar filters on; an item with none is open to anyone
// signed in. `MenuItem` still knows how to draw a parent that expands (`submenuItems`,
// which `SideBar` filters on `roles` too) — the reference component was ported whole —
// but nothing here declares one: every section is one page, reached in one click.
//
// The management sections used to sit under one «مدیریت» parent. They are top level
// now, at the customer's request: each is a destination in its own right, and one
// accordion standing between the sidebar and every one of them meant two clicks to
// reach the page an admin spends the day on. A role that cannot enter a section does
// not see its item, so the list is short for everyone — an org_admin gets the dashboard
// and the users, and an ordinary user none at all.
export const menuItems = [
  // The dashboard leads for anyone who has one — it is the overview the other sections
  // are read from. An ordinary user is not in `ADMIN_ROLES`, so for them the list still
  // opens on «جستجوی شغل».
  {
    href: "/manage/dashboard",
    label: "داشبورد",
    icon: ChartIcon,
    roles: ADMIN_ROLES,
  },
  // One item for both ways of searching. «جستجوی پیشرفته» used to sit under this one and
  // is not a destination any more: it is the same errand asked a different way, so it is
  // now a switch on the search page itself rather than a second line in the sidebar.
  {
    href: "/search",
    label: "جستجوی شغل",
    icon: SearchIcon,
  },
  // «پیشنهاد شغل» and «پیشنهادهای من» were two items here and are one now, at the
  // customer's request: they are the two halves of the same errand — a record is filed
  // and then its decision is waited on — so they are one entry onto one page, where the
  // halves are a switch beside each other. Not a parent that expands: the ask was for
  // one section, and an accordion would be the two lines back with a click in front of
  // them. Same shape as «جستجوی شغل» above.
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
  // The two sections about the shared corpus, kept next to each other and last: one
  // decides what enters it, the other corrects what is already in it. Both are
  // super-admin-only, because the dataset belongs to no single organization.
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
