/** Pill-shaped tab bar: one button per option (`{ value, label, icon }`), the chosen one highlighted. */
export default function SegmentedSwitch({ options, value, onChange, label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex flex-wrap justify-center items-center gap-1 p-1 max-w-full rounded-2xl
                 bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-900/5"
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
        const isActive = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(optionValue)}
            className={`
              inline-flex items-center gap-2 h-10 px-4 md:px-5 rounded-xl
              text-sm font-medium whitespace-nowrap cursor-pointer
              transition-all duration-200 ease-out
              ${
                isActive
                  ? "bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-white/80"
              }
            `}
          >
            {Icon && <Icon />}
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}
