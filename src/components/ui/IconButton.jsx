/** Round coloured button holding only an icon, used for row actions; `title` doubles as its accessible name. */
const TONES = {
  danger: "bg-red-500 hover:bg-red-600 shadow-red-500/25",
  view: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
  edit: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25",
  neutral: "bg-slate-500 hover:bg-slate-600 shadow-slate-500/25",
  warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
};

export default function IconButton({ children, title, tone = "neutral", disabled = false, onClick }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`
        shrink-0 w-9 h-9 rounded-full inline-flex items-center justify-center
        text-white shadow-md cursor-pointer
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        disabled:hover:translate-y-0
        ${TONES[tone] ?? TONES.neutral}
      `}
    >
      {children}
    </button>
  );
}
