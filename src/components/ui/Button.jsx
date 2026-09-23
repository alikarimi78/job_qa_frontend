/** The app's button in its colour variants and sizes; any other prop (onClick, disabled, type, form, title…) goes straight to the <button>. */
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
  "danger-outline":
    "bg-white/80 hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 border border-emerald-600",
  submit:
    "bg-gradient-to-l from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 " +
    "text-white font-semibold shadow-lg shadow-emerald-700/25 border border-emerald-700/60",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
  xl: "h-12 md:h-13 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...buttonProps
}) {
  return (
    <button
      type={type}
      {...buttonProps}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl
        font-medium whitespace-nowrap cursor-pointer
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${SIZES[size] ?? SIZES.md}
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
