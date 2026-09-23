/** Stacks a label, a control that is not a react-hook-form Input (such as a Select) and an optional note under it. */
export default function FormField({ label, note, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {note}
    </div>
  );
}
