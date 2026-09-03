const TONES = {
  danger: "bg-red-500 hover:bg-red-600 shadow-red-500/25",
  view: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
  edit: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25",
  neutral: "bg-slate-500 hover:bg-slate-600 shadow-slate-500/25",
  warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
};

export default function IconButton({
  children,
  title,
  tone = "neutral",
  disabled = false,
  onClick,
  className = "",
}) {
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
        ${className}
      `}
    >
      {children}
    </button>
  );
}

const glyph = (path) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

export const TrashGlyph = glyph(
  <>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
  </>
);

export const EyeGlyph = glyph(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const PencilGlyph = glyph(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </>
);

export const UserPlusGlyph = glyph(
  <>
    <path d="M15 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </>
);

export const LockGlyph = glyph(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </>
);

export const UnlockGlyph = glyph(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 017.5-2" />
  </>
);

export const KeyGlyph = glyph(
  <>
    <circle cx="7.5" cy="15.5" r="3.5" />
    <path d="M10 13L20 3M17 6l2 2M14 9l2 2" />
  </>
);

export const PlusGlyph = glyph(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </>
);
