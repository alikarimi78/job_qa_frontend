import { icon } from "@components/ui/icon";

const SparklesGlyph = icon(
  <>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </>
);

const paragraphs = (text) =>
  String(text ?? "")
    .split(/\n\s*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

export default function AnswerPanel({ label, text }) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-gradient-to-bl from-indigo-50/80 via-white to-white p-4 md:p-5">
      <div className="flex items-center gap-2 mb-2">
        <span
          aria-hidden="true"
          className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0"
        >
          {SparklesGlyph}
        </span>
        <h3 className="text-sm font-bold text-indigo-950 m-0">{label}</h3>
      </div>
      <div className="flex flex-col gap-3 text-[15px] leading-9 text-slate-700">
        {paragraphs(text).map((paragraph, i) => (
          <p key={i} className="whitespace-pre-wrap m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
