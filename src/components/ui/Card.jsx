const SIZES = {
  small: "p-4 md:p-5",
  medium: "p-5 md:p-6",
  large: "p-6 md:p-8",
};

// A card given a `tint` (a `from-*` class) heads itself the way a job field's card does: the heading on
// a band fading from that tint, across the card's top, with the card's own side padding.
const BANDS = {
  small: "px-4 md:px-5 py-3",
  medium: "px-5 md:px-6 py-4",
  large: "px-6 md:px-8 py-5",
};

export default function Card({
  children,
  size = "medium",
  className = "",
  title,
  hint,
  actions,
  icon,
  tint,
}) {
  const pad = SIZES[size] ?? SIZES.medium;
  const text = (
    <div>
      {title && <h2 className="text-lg font-bold text-slate-800">{title}</h2>}
      {hint && <p className="text-sm text-slate-500 mt-1 leading-6">{hint}</p>}
    </div>
  );
  const heading = (title || actions) && (
    <div
      className={`flex ${icon ? "items-center" : "items-start"} justify-between gap-4 flex-wrap ${
        tint
          ? `${BANDS[size] ?? BANDS.medium} rounded-t-2xl bg-gradient-to-l ${tint} to-transparent`
          : "mb-4"
      }`}
    >
      {icon ? (
        <div className="flex items-center gap-4">
          {icon}
          {text}
        </div>
      ) : (
        text
      )}
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );

  return (
    <section
      className={`
        bg-white/95 backdrop-blur-sm rounded-2xl
        border border-white/40 shadow-xl shadow-slate-900/5
        ${tint ? "" : pad}
        ${className}
      `}
    >
      {heading}
      {tint ? <div className={pad}>{children}</div> : children}
    </section>
  );
}
