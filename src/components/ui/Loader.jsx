export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      <span className="text-sm text-slate-500">در حال بارگذاری...</span>
    </div>
  );
}

export function Spinner() {
  return <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />;
}
