/** Colour sets (as Tailwind classes) shared by the job field boxes, the dashboard cards and their icon badges, one set per accent colour. */
export const PRIMARY_GRADIENT = "from-blue-600 to-indigo-600 shadow-indigo-600/25";

export const PRIMARY_THEME = {
  gradient: PRIMARY_GRADIENT,
  headerGradient: "from-blue-50",
};

export const ACCENT_THEMES = {
  emerald: {
    gradient: "from-emerald-500 to-teal-600 shadow-emerald-600/25",
    tint: "bg-emerald-100 text-emerald-700",
    headerGradient: "from-emerald-50",
    bodyBackground: "bg-emerald-50/40",
    ring: "ring-emerald-400/80",
    pill: "bg-emerald-700 text-white",
    toggleButton:
      "border-emerald-200 text-emerald-700 hover:bg-emerald-700 hover:border-emerald-700 hover:text-white",
    moreButton: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
    connector: "bg-emerald-200",
  },
  violet: {
    gradient: "from-violet-500 to-purple-600 shadow-violet-600/25",
    tint: "bg-violet-100 text-violet-700",
    headerGradient: "from-violet-50",
    bodyBackground: "bg-violet-50/40",
    ring: "ring-violet-400/80",
    pill: "bg-violet-700 text-white",
    toggleButton:
      "border-violet-200 text-violet-700 hover:bg-violet-700 hover:border-violet-700 hover:text-white",
    moreButton: "border-violet-300 text-violet-700 hover:bg-violet-50",
    connector: "bg-violet-200",
  },
  sky: {
    gradient: "from-sky-500 to-cyan-600 shadow-sky-600/25",
    tint: "bg-sky-100 text-sky-700",
    headerGradient: "from-sky-50",
    bodyBackground: "bg-sky-50/40",
    ring: "ring-sky-400/80",
    pill: "bg-sky-700 text-white",
    toggleButton: "border-sky-200 text-sky-700 hover:bg-sky-700 hover:border-sky-700 hover:text-white",
    moreButton: "border-sky-300 text-sky-700 hover:bg-sky-50",
    connector: "bg-sky-200",
  },
  orange: {
    gradient: "from-amber-500 to-orange-600 shadow-orange-600/25",
    tint: "bg-orange-100 text-orange-700",
    headerGradient: "from-orange-50",
    bodyBackground: "bg-orange-50/40",
    ring: "ring-orange-400/80",
    pill: "bg-orange-700 text-white",
    toggleButton:
      "border-orange-200 text-orange-700 hover:bg-orange-700 hover:border-orange-700 hover:text-white",
    moreButton: "border-orange-300 text-orange-700 hover:bg-orange-50",
    connector: "bg-orange-200",
  },
  slate: {
    gradient: "from-slate-500 to-slate-700 shadow-slate-600/25",
    tint: "bg-slate-100 text-slate-600",
    headerGradient: "from-slate-50",
    bodyBackground: "bg-slate-50/60",
    ring: "ring-slate-400/80",
    pill: "bg-slate-700 text-white",
    toggleButton:
      "border-slate-200 text-slate-600 hover:bg-slate-700 hover:border-slate-700 hover:text-white",
    moreButton: "border-slate-300 text-slate-500 hover:bg-slate-50",
    connector: "bg-slate-300",
  },
};
