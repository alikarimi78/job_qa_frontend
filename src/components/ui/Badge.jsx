const TONES = {
  accent: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Badge({ children, tone = "accent", wrap = false, className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-3 py-0.5 rounded-full
        text-xs font-medium border
        ${wrap ? "whitespace-normal text-start leading-6 py-1" : "whitespace-nowrap"}
        ${TONES[tone] ?? TONES.accent}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
