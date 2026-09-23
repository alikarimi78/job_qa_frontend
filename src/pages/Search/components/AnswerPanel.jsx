/** The written answer of an analysis, split into paragraphs under a small sparkle heading. */
import { SparklesIcon } from "@components/icons";

const toParagraphs = (text) =>
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
          <SparklesIcon />
        </span>
        <h3 className="text-sm font-bold text-indigo-950 m-0">{label}</h3>
      </div>
      <div className="flex flex-col gap-3 text-[15px] leading-9 text-slate-700">
        {toParagraphs(text).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-wrap m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
