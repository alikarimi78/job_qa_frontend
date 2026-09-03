// Two (or three) values of one setting, as one control — the raised segment says which
// value is on without a legend.
//
// It began as `search/ModeSwitch` and was lifted here when «پیشنهادها» needed the same
// thing: a page that is one errand asked two ways puts the choice on the page rather
// than in the navigation, and there is now more than one such page. The options table
// stays with the caller, since the labels and the glyphs are what each page is about.
export default function SegmentedSwitch({ options, value, onChange, label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex flex-wrap justify-center items-center gap-1 p-1 max-w-full rounded-2xl
                 bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-900/5"
    >
      {options.map(([option, text, glyph]) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
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
            {text}
          </button>
        );
      })}
    </div>
  );
}
