const ListGlyph = (
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

// The heading over a run of cards: the brand badge, the title, an optional quiet note, and a rule
// that fades out across the rest of the line.
export default function SectionHeading({ title, note, glyph = ListGlyph }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                   shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
      >
        {glyph}
      </span>
      <h3 className="text-base font-bold text-slate-800 m-0 leading-7">{title}</h3>
      {note && <span className="text-xs text-slate-500 shrink-0">{note}</span>}
      <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
    </div>
  );
}
