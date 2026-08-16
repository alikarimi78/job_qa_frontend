// The two ways of searching, as one control. They used to be two sidebar items and are
// one page now: the same errand — «کدام شغل؟» — asked either as a sentence or as a list
// of what the person can do, so the choice belongs beside the search box rather than in
// the navigation.
//
// A segmented pill rather than two plain buttons: the pair is one setting with two
// values, and the raised white segment says which value is on without a legend.

const Magnifier = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const Sliders = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const MODES = [
  ["simple", "جستجوی معمولی", Magnifier],
  ["advanced", "جستجوی پیشرفته", Sliders],
];

export default function ModeSwitch({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="نوع جستجو"
      className="inline-flex flex-wrap justify-center items-center gap-1 p-1 max-w-full rounded-2xl
                 bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-900/5"
    >
      {MODES.map(([mode, label, glyph]) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(mode)}
            className={`
              inline-flex items-center gap-2 h-10 px-4 md:px-5 rounded-xl
              text-sm font-medium whitespace-nowrap cursor-pointer
              transition-all duration-200 ease-out
              ${
                active
                  ? "bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-white/80"
              }
            `}
          >
            {glyph}
            {label}
          </button>
        );
      })}
    </div>
  );
}
