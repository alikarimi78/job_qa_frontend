import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { faNumber } from "@utils/jalali";

// One list column, collected one item at a time.
//
// The dataset stores these columns as a single «|»-joined string, and this field used
// to ask the user to type that string. That put the separator on them — «،» or «,» or
// «|»? — and every wrong guess became one long item that matched nothing on either side
// of the system: the record went into the corpus as a single unsplittable cell, and the
// same guess in a search matched no record at all. Items are entered here and joined by
// the caller, so what the user sees is what the model stores.
//
// Text that arrives with a separator in it anyway is split rather than refused — that is
// what pasting from a document does, and it is the one place the old habit still shows
// up. A space is deliberately not a separator: «حل مسئله» is one item.
const SEPARATORS = /[،,;؛|\n\t]+/;

const PlusGlyph = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function splitItems(text) {
  return String(text ?? "")
    .split(SEPARATORS)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** A «|»-joined cell as the dataset stores it, back into items. */
export function itemsFromCell(cell) {
  return splitItems(cell);
}

/** Items back into the cell the dataset stores. */
export function cellFromItems(items) {
  return (items ?? []).join(" | ");
}

export default function ItemsInput({
  name,
  label,
  placeholder,
  hint,
  required = false,
  min = 1,
  max = 20,
  className = "",
}) {
  const { control } = useFormContext();
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      validate: (items) => {
        if (!required) return true;
        return (
          (items?.length ?? 0) >= min ||
          `دست‌کم ${min === 1 ? "یک" : faNumber(min)} مورد وارد کنید`
        );
      },
    },
  });

  const [draft, setDraft] = useState("");
  const full = value.length >= max;

  const add = (text) => {
    const incoming = splitItems(text);
    if (!incoming.length) return;
    const seen = new Set(value.map((item) => item.toLowerCase()));
    const next = [...value];
    for (const item of incoming) {
      if (next.length >= max) break;
      if (seen.has(item.toLowerCase())) continue;
      seen.add(item.toLowerCase());
      next.push(item);
    }
    onChange(next);
    setDraft("");
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}

      <div className="flex items-stretch gap-2">
        <input
          type="text"
          value={draft}
          disabled={full}
          placeholder={full ? `حداکثر ${faNumber(max)} مورد` : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          // Enter adds an item and must not reach the form: this field sits in a form
          // with a submit button, and the browser's default would file the whole record
          // the first time someone finishes typing a skill.
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            }
          }}
          // What is typed but not yet added is still the user's answer. Without this,
          // typing the last skill and going straight for the green button silently drops
          // it — the click blurs the box before the submit reads the value.
          onBlur={() => add(draft)}
          className={`
            flex-1 h-11 px-4 rounded-xl bg-white text-sm text-slate-800
            border transition-all duration-200 outline-none
            placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400
            focus:ring-2 focus:ring-blue-500/30
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }
          `}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          disabled={full || !draft.trim()}
          title={`افزودن به ${label ?? "فهرست"}`}
          aria-label={`افزودن به ${label ?? "فهرست"}`}
          className="shrink-0 w-11 h-11 rounded-xl inline-flex items-center justify-center
                     text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer
                     shadow-md shadow-emerald-600/20 transition-all duration-200
                     hover:-translate-y-0.5 active:translate-y-0
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                     disabled:hover:translate-y-0"
        >
          {PlusGlyph}
        </button>
      </div>

      {value.length > 0 && (
        // Keyed by position, not by text: two items can never be equal here (`add`
        // drops duplicates) but position is what `remove` works on either way.
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 max-w-full
                         bg-blue-50 border border-blue-200 rounded-full
                         ps-3 pe-1.5 py-1 text-[13px] text-blue-900"
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                title={`حذف ${item}`}
                aria-label={`حذف ${item}`}
                className="shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center
                           text-blue-400 hover:text-white hover:bg-red-500 cursor-pointer
                           transition-colors duration-200"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {error ? (
        <span className="text-xs text-red-600">{error.message}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </div>
  );
}
