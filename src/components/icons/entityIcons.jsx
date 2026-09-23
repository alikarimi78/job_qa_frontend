/** Icons for the things the app talks about: jobs and their fields, people, organizations, the database and the analysis results. */
import SvgIcon from "./SvgIcon";

export const BriefcaseIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
  </SvgIcon>
);

export const ToolboxIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 13h20M10 13v2h4v-2" />
  </SvgIcon>
);

export const ClipboardCheckIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <path d="M9 14l2 2 4-4" />
  </SvgIcon>
);

export const FileTextIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </SvgIcon>
);

export const DocumentIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </SvgIcon>
);

export const WorkplaceIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6M9 10h.01M15 10h.01" />
  </SvgIcon>
);

export const BuildingIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M3 21h18" />
    <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
    <path d="M19 21V11a2 2 0 00-2-2h-2" />
    <path d="M9 7h2M9 11h2M9 15h2" />
  </SvgIcon>
);

export const TrendingUpIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </SvgIcon>
);

export const TagIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <path d="M7 7h.01" />
  </SvgIcon>
);

export const WrenchIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
  </SvgIcon>
);

export const BookIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
    <path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" />
  </SvgIcon>
);

export const ZapIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </SvgIcon>
);

export const AwardIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M8.2 13.2L7 22l5-3 5 3-1.2-8.8" />
  </SvgIcon>
);

export const UserIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);

export const UsersIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </SvgIcon>
);

export const UserCheckIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M16 11l2 2 4-4" />
  </SvgIcon>
);

export const GlobeIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </SvgIcon>
);

export const DatabaseIcon = (props) => (
  <SvgIcon {...props}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </SvgIcon>
);

export const DatabasePlusIcon = (props) => (
  <SvgIcon {...props}>
    <ellipse cx="11" cy="5" rx="7" ry="3" />
    <path d="M4 5v6c0 1.7 3.1 3 7 3M18 5v4M4 11v6c0 1.7 3.1 3 7 3" />
    <path d="M18 14v6M15 17h6" />
  </SvgIcon>
);

export const CompassIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </SvgIcon>
);

export const LightbulbIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
  </SvgIcon>
);

export const GitMergeIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 009 9" />
  </SvgIcon>
);

export const SparkleIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
  </SvgIcon>
);

export const SparklesIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </SvgIcon>
);
