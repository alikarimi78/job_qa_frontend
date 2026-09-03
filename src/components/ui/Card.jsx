const SIZES = {
  small: "p-4 md:p-5",
  medium: "p-5 md:p-6",
  large: "p-6 md:p-8",
};

export default function Card({ children, size = "medium", className = "", title, hint, actions }) {
  return (
    <section
      className={`
        bg-white/95 backdrop-blur-sm rounded-2xl
        border border-white/40 shadow-xl shadow-slate-900/5
        ${SIZES[size] ?? SIZES.medium}
        ${className}
      `}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            {title && <h2 className="text-lg font-bold text-slate-800">{title}</h2>}
            {hint && <p className="text-sm text-slate-500 mt-1 leading-6">{hint}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
