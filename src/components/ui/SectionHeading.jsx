import { icon } from "@components/ui/icon";

const LIST_GLYPH = icon(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />);

export default function SectionHeading({ title, note }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                   shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
      >
        {LIST_GLYPH}
      </span>
      <h3 className="text-base font-bold text-slate-800 m-0 leading-7">{title}</h3>
      {note && <span className="text-xs text-slate-500 shrink-0">{note}</span>}
      <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
    </div>
  );
}
