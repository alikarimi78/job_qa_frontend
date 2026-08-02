// The Button the reference pages import but that was not among the style files.
// Its API is taken from the calls in login.tsx and the two header modes:
// `variant`, `className` for per-call overrides, and everything else through
// `buttonProps` rather than spread props.
const VARIANTS = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 border border-blue-600",
  secondary:
    "bg-slate-600 hover:bg-slate-500 text-white border border-slate-500",
  outline:
    "bg-white/80 hover:bg-white text-slate-700 border border-slate-300 hover:border-slate-400",
  ghost:
    "bg-transparent hover:bg-slate-200/60 text-slate-600 border border-transparent",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 border border-red-600",
  // The button that *opens* a delete confirmation, as against the one that carries it
  // out. A row of solid red triggers reads as though the page were mid-destruction.
  "danger-outline":
    "bg-white/80 hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 border border-emerald-600",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  buttonProps = {},
}) {
  return (
    <button
      {...buttonProps}
      className={`
        inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl
        text-sm font-medium whitespace-nowrap cursor-pointer
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
