/** Icons for things the user does: add, edit, delete, search, download, sign in and out, and so on. */
import SvgIcon from "./SvgIcon";

export const PlusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </SvgIcon>
);

export const PlusCircleIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </SvgIcon>
);

export const PencilIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </SvgIcon>
);

export const TrashIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
  </SvgIcon>
);

export const XIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </SvgIcon>
);

export const SwapIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M7 7h13l-3-3M17 17H4l3 3" />
  </SvgIcon>
);

export const SearchIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </SvgIcon>
);

export const SlidersIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </SvgIcon>
);

export const DownloadIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3v12M7 12l5 5 5-5M4 20h16" />
  </SvgIcon>
);

export const StarIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
  </SvgIcon>
);

export const EyeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </SvgIcon>
);

export const EyeOffIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10.6 6.2A9.9 9.9 0 0112 6c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.6 6.6A17 17 0 002 13s3.6 7 10 7a9.9 9.9 0 004.2-.9" />
    <path d="M9.9 9.9a3 3 0 104.2 4.2M3 3l18 18" />
  </SvgIcon>
);

export const KeyIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="7.5" cy="15.5" r="3.5" />
    <path d="M10 13L20 3M17 6l2 2M14 9l2 2" />
  </SvgIcon>
);

export const LockIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </SvgIcon>
);

export const UnlockIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 017.5-2" />
  </SvgIcon>
);

export const UserPlusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M15 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </SvgIcon>
);

export const LogInIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M11 16l-4-4m0 0l4-4m-4 4h14M13 4h3a3 3 0 013 3v10a3 3 0 01-3 3h-3" />
  </SvgIcon>
);

export const LogOutIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </SvgIcon>
);
