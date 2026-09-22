const PAD = "p-5 md:p-6";

export default function Card({ children, className = "", title, hint, actions, icon, tint }) {
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
          ? `px-5 md:px-6 py-4 rounded-t-2xl bg-gradient-to-l ${tint} to-transparent`
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
        ${tint ? "" : PAD}
        ${className}
      `}
    >
      {heading}
      {tint ? <div className={PAD}>{children}</div> : children}
    </section>
  );
}
