import { useEffect, useRef, useState } from "react";
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

const PencilGlyph = (
  <svg
    className="w-3 h-3 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 20h4L18.5 9.5a2.12 2.12 0 00-3-3L5 17v3z" />
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
          `دست‌کم ${min === 1 ? "یک" : faNumber(min)} مورد وارد نمایید`
        );
      },
    },
  });

  const [draft, setDraft] = useState("");
  // The item being corrected in place, by position, and the text of it. Editing was a
  // delete followed by a retype until now: fixing one letter of a twelve-word duty meant
  // typing the whole statement again, and the item lost its place in the column while
  // that happened — which matters, because four of these columns are stored in a
  // deliberate order (see «Five per column» in the backend's CLAUDE.md).
  const [editing, setEditing] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const editRef = useRef(null);
  // Escape cancels, and the box then blurs — without this flag the blur handler would
  // commit the very edit that was just abandoned.
  const cancelled = useRef(false);

  const full = value.length >= max;

  useEffect(() => {
    if (editing === null) return;
    editRef.current?.focus();
    editRef.current?.select();
  }, [editing]);

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

  const remove = (index) => {
    if (editing === index) setEditing(null);
    onChange(value.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    cancelled.current = false;
    setEditDraft(value[index]);
    setEditing(index);
  };

  const cancelEdit = () => {
    cancelled.current = true;
    setEditing(null);
  };

  // The edited text replaces the item where it stands, so the column keeps its order.
  // Pasted separators split here exactly as they do in `add` — one item can become
  // several — and the position is what they take.
  const commitEdit = (index, text) => {
    setEditing(null);
    const incoming = splitItems(text);
    // An emptied box is an abandoned edit, not a deletion: the chip has its own «×», and
    // clearing the field by accident must not take the item with it.
    if (!incoming.length) return;

    const others = new Set(
      value.filter((_, i) => i !== index).map((item) => item.toLowerCase())
    );
    const kept = [];
    for (const item of incoming) {
      if (others.has(item.toLowerCase())) continue;
      others.add(item.toLowerCase());
      kept.push(item);
    }
    // Room is counted against the item being replaced, so an edit can never overflow the
    // column; `kept` empty means the text is already somewhere else in it, and the
    // duplicate is dropped rather than written twice.
    const room = Math.max(max - (value.length - 1), 0);
    const next = [
      ...value.slice(0, index),
      ...kept.slice(0, room),
      ...value.slice(index + 1),
    ];
    onChange(next);
  };

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
        // Keyed by position, not by text: two items can never be equal here (`add` and
        // `commitEdit` both drop duplicates) but position is what `remove` and the
        // in-place edit work on either way.
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((item, index) =>
            editing === index ? (
              <input
                key={index}
                ref={editRef}
                type="text"
                value={editDraft}
                onChange={(event) => setEditDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitEdit(index, editDraft);
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    cancelEdit();
                  }
                }}
                // The same rule the add box follows: what is typed and then clicked away
                // from is still the user's answer, so a blur commits rather than
                // discards — unless Escape has already said otherwise.
                onBlur={() => {
                  if (cancelled.current) {
                    cancelled.current = false;
                    return;
                  }
                  commitEdit(index, editDraft);
                }}
                aria-label={`ویرایش ${item}`}
                // Sized to its own text so the chip keeps roughly the width it had.
                // `ch` is the width of a «0» and Persian glyphs run wider than that, so
                // the count is scaled rather than taken literally; the cap is what stops
                // one long duty statement from pushing the field off the row.
                style={{
                  width: `${Math.min(Math.max(editDraft.length * 1.4 + 4, 12), 52)}ch`,
                }}
                className="max-w-full h-[30px] px-3 rounded-full bg-white text-[13px] text-slate-800
                           border border-blue-400 outline-none transition-all duration-200
                           focus:ring-2 focus:ring-blue-500/30"
              />
            ) : (
              <span
                key={index}
                className="inline-flex items-center gap-1 max-w-full
                           bg-blue-50 border border-blue-200 rounded-full
                           ps-3 pe-1.5 py-1 text-[13px] text-blue-900"
              >
                {/* The item's own text is the edit affordance — one target rather than a
                    pencil beside a label, which at chip size is two things to hit. */}
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  title={`ویرایش ${item}`}
                  aria-label={`ویرایش ${item}`}
                  className="inline-flex items-center gap-1.5 min-w-0 cursor-text
                             text-blue-900 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="truncate">{item}</span>
                  <span className="text-blue-400">{PencilGlyph}</span>
                </button>
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
            )
          )}
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
