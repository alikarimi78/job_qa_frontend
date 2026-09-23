/** Amber information box with a title and a short explanation. */
import { InfoIcon } from "@components/icons";

export default function Notice({ title, children }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-orange-50/40">
      <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <InfoIcon />
      </span>
      <div className="min-w-0">
        <strong className="block text-sm text-amber-900 leading-6">{title}</strong>
        <p className="text-xs text-amber-800/90 mt-0.5 mb-0 leading-6">{children}</p>
      </div>
    </div>
  );
}
