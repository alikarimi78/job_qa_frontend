import { icon } from "@components/ui/icon";

export const THEMES = {
  emerald: {
    badge: "from-emerald-500 to-teal-600 shadow-emerald-600/25",
    soft: "bg-emerald-100 text-emerald-700",
    header: "from-emerald-50",
    body: "bg-emerald-50/40",
    chip: "bg-emerald-50 border-emerald-200/80 text-emerald-950",
    pick: "hover:bg-emerald-700 hover:border-emerald-700 hover:text-white",
    ring: "ring-emerald-400/80",
    pill: "bg-emerald-700 text-white",
    toggle: "border-emerald-200 text-emerald-700 hover:bg-emerald-700 hover:border-emerald-700 hover:text-white",
    more: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
    line: "bg-emerald-200",
    arrow: "text-emerald-400",
  },
  violet: {
    badge: "from-violet-500 to-purple-600 shadow-violet-600/25",
    soft: "bg-violet-100 text-violet-700",
    header: "from-violet-50",
    body: "bg-violet-50/40",
    chip: "bg-violet-50 border-violet-200/80 text-violet-950",
    pick: "hover:bg-violet-700 hover:border-violet-700 hover:text-white",
    ring: "ring-violet-400/80",
    pill: "bg-violet-700 text-white",
    toggle: "border-violet-200 text-violet-700 hover:bg-violet-700 hover:border-violet-700 hover:text-white",
    more: "border-violet-300 text-violet-700 hover:bg-violet-50",
    line: "bg-violet-200",
    arrow: "text-violet-400",
  },
  sky: {
    badge: "from-sky-500 to-cyan-600 shadow-sky-600/25",
    soft: "bg-sky-100 text-sky-700",
    header: "from-sky-50",
    body: "bg-sky-50/40",
    chip: "bg-sky-50 border-sky-200/80 text-sky-950",
    pick: "hover:bg-sky-700 hover:border-sky-700 hover:text-white",
    ring: "ring-sky-400/80",
    pill: "bg-sky-700 text-white",
    toggle: "border-sky-200 text-sky-700 hover:bg-sky-700 hover:border-sky-700 hover:text-white",
    more: "border-sky-300 text-sky-700 hover:bg-sky-50",
    line: "bg-sky-200",
    arrow: "text-sky-400",
  },
  orange: {
    badge: "from-amber-500 to-orange-600 shadow-orange-600/25",
    soft: "bg-orange-100 text-orange-700",
    header: "from-orange-50",
    body: "bg-orange-50/40",
    chip: "bg-orange-50 border-orange-200/80 text-orange-950",
    pick: "hover:bg-orange-700 hover:border-orange-700 hover:text-white",
    ring: "ring-orange-400/80",
    pill: "bg-orange-700 text-white",
    toggle: "border-orange-200 text-orange-700 hover:bg-orange-700 hover:border-orange-700 hover:text-white",
    more: "border-orange-300 text-orange-700 hover:bg-orange-50",
    line: "bg-orange-200",
    arrow: "text-orange-400",
  },
  slate: {
    badge: "from-slate-500 to-slate-700 shadow-slate-600/25",
    soft: "bg-slate-100 text-slate-600",
    header: "from-slate-50",
    body: "bg-slate-50/60",
    chip: "bg-slate-50 border-slate-200 text-slate-800",
    pick: "hover:bg-slate-700 hover:border-slate-700 hover:text-white",
    ring: "ring-slate-400/80",
    pill: "bg-slate-700 text-white",
    toggle: "border-slate-200 text-slate-600 hover:bg-slate-700 hover:border-slate-700 hover:text-white",
    more: "border-slate-300 text-slate-500 hover:bg-slate-50",
    line: "bg-slate-300",
    arrow: "text-slate-400",
  },
};

const FIELD_THEME = {
  job_title: "emerald",
  responsibilities: "emerald",
  description: "emerald",
  skills: "violet",
  knowledge: "violet",
  abilities: "violet",
  tools: "sky",
  work_context: "sky",
  career_path_next: "orange",
  aliases: "slate",
};

export const themeOf = (key) => THEMES[FIELD_THEME[key]] ?? THEMES.slate;

export const FIELD_ICONS = {
  job_title: icon(
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
    </>
  ),
  responsibilities: icon(
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <path d="M9 14l2 2 4-4" />
    </>
  ),
  description: icon(
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </>
  ),
  tools: icon(
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 13h20M10 13v2h4v-2" />
    </>
  ),
  work_context: icon(
    <>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6M9 10h.01M15 10h.01" />
    </>
  ),
  career_path_next: icon(
    <>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </>
  ),
  aliases: icon(
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <path d="M7 7h.01" />
    </>
  ),
  skills: icon(
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
  ),
  knowledge: icon(
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
      <path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" />
    </>
  ),
  abilities: icon(<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />),
};

const FALLBACK_ICON = icon(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />);

const BADGE_SIZES = {
  tile: "w-14 h-14 rounded-2xl [&>svg]:size-7",
  panel: "w-14 h-14 rounded-2xl [&>svg]:size-7",
  lg: "w-10 h-10 rounded-xl [&>svg]:size-5",
  md: "w-9 h-9 rounded-lg [&>svg]:size-[18px]",
  sm: "w-8 h-8 rounded-lg [&>svg]:size-4",
};

const SOLID = new Set(["panel", "lg"]);

export function IconBadge({ theme, fieldKey, glyph, size = "lg" }) {
  const tone = SOLID.has(size) ? `bg-gradient-to-br ${theme.badge} text-white shadow-md` : theme.soft;
  return (
    <span
      aria-hidden="true"
      className={`${BADGE_SIZES[size] ?? BADGE_SIZES.lg} ${tone} flex items-center justify-center shrink-0`}
    >
      {glyph ?? FIELD_ICONS[fieldKey] ?? FALLBACK_ICON}
    </span>
  );
}
