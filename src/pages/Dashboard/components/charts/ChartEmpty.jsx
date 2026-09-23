/** Centred grey message shown in place of a chart that has nothing to draw. */
export default function ChartEmpty({ children }) {
  return <p className="text-sm text-slate-500 py-8 text-center leading-7">{children}</p>;
}
