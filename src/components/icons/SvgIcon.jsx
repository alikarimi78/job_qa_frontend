/** Base outline icon: a 24×24 stroke-drawn SVG that takes the current text colour; every icon in this folder is a thin wrapper around it. */
export default function SvgIcon({ className = "w-4 h-4", strokeWidth = 2, children }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}
