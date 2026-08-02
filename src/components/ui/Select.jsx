// Not driven by react-hook-form: the only select in the app is the destination unit
// in the accounts table's inline move panel, which lives and dies with one open row.
export default function Select({ value, onChange, children, className = "", selectProps = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      {...selectProps}
      className={`
        h-10 px-3 rounded-xl bg-white text-sm text-slate-800
        border border-slate-200 outline-none cursor-pointer
        transition-all duration-200
        hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
        ${className}
      `}
    >
      {children}
    </select>
  );
}
