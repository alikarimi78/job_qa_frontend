export default function Loader({ label = "در حال بارگذاری...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
      <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
  );
}

// The inline version, for a button that is mid-request.
export function Spinner({ className = "" }) {
  return (
    <span
      className={`w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin ${className}`}
    />
  );
}
