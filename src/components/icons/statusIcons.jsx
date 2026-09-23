/** Icons that report a state: done, failed, informational, needs help, blocked, waiting. */
import SvgIcon from "./SvgIcon";

export const CheckIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </SvgIcon>
);

export const CheckCircleIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 5-5" />
  </SvgIcon>
);

export const XCircleIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </SvgIcon>
);

export const InfoIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </SvgIcon>
);

export const HelpCircleIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" />
  </SvgIcon>
);

export const BanIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.7 5.7l12.6 12.6" />
  </SvgIcon>
);

export const ClockIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </SvgIcon>
);

export const ShieldCheckIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3l7 3v6c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </SvgIcon>
);
