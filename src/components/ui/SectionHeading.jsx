/** Heading with a list icon, an optional note and a fading rule, placed above a group of result boxes. */
import { ListIcon } from "@components/icons";

export default function SectionHeading({ title, note }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                   shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
      >
        <ListIcon />
      </span>
      <h3 className="text-base font-bold text-slate-800 m-0 leading-7">{title}</h3>
      {note && <span className="text-xs text-slate-500 shrink-0">{note}</span>}
      <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
    </div>
  );
}
