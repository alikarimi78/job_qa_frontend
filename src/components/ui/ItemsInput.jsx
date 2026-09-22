import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { faNumber } from "@utils/jalali";
import { foldText as fold } from "@utils/text";
import { icon } from "@components/ui/icon";

const SEPARATORS = /[،,;؛|\n\t]+/;

const SUGGESTION_LIMIT = 8;

const PlusGlyph = icon(<path d="M12 5v14M5 12h14" />, "w-4 h-4", 2.5);

export const PencilGlyph = icon(<path d="M4 20h4L18.5 9.5a2.12 2.12 0 00-3-3L5 17v3z" />, "w-3 h-3 shrink-0", 2.5);

export const SwapGlyph = icon(<path d="M7 7h13l-3-3M17 17H4l3 3" />, "w-3 h-3 shrink-0", 2.5);

function splitItems(text) {
  return String(text ?? "")
    .split(SEPARATORS)
    .map((part) => part.trim())
    .filter(Boolean);
}

const EMPTY_ITEMS = new Set(["-", "–", "—", "_"]);

export function splitLines(text) {
  return String(text ?? "")
    .split(/[|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function itemsFromCell(cell) {
  return String(cell ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part && !EMPTY_ITEMS.has(part));
}

export function cellFromItems(items) {
  return (items ?? []).join(" | ");
}

function suggest(suggestions, query, taken) {
  const words = fold(query).split(" ").filter(Boolean);
  const compact = words.join("");
  const found = [];
  for (const option of suggestions) {
    const text = fold(option.text);
    if (taken.has(text)) continue;
    if (words.length) {
      const optionWords = text.split(" ");
      const byWords = words.every((word) => optionWords.some((other) => other.startsWith(word)));
      if (!byWords && !text.replace(/ /g, "").includes(compact)) continue;
    }
    found.push(option);
    if (found.length >= SUGGESTION_LIMIT) break;
  }
  return found;
}

export function useItemList(name, { required = false, min = 1, max = 20 } = {}) {
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

  const append = (incoming) => {
    const seen = new Set(value.map((item) => item.toLowerCase()));
    const next = [...value];
    for (const item of incoming) {
      if (next.length >= max) break;
      if (seen.has(item.toLowerCase())) continue;
      seen.add(item.toLowerCase());
      next.push(item);
    }
    onChange(next);
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  const replace = (index, text, split = splitItems) => {
    const incoming = split(text);
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
    const room = Math.max(max - (value.length - 1), 0);
    onChange([...value.slice(0, index), ...kept.slice(0, room), ...value.slice(index + 1)]);
  };

  return { value, error, max, full: value.length >= max, append, remove, replace };
}

export function useInlineEdit(onCommit) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef(null);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!editing) return;
    ref.current?.focus();
    ref.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onCommit(draft);
  };

  return {
    editing,
    draft,
    cancel: () => {
      cancelled.current = true;
      setEditing(false);
    },
    start: (text) => {
      cancelled.current = false;
      setDraft(text);
      setEditing(true);
    },
    inputProps: {
      ref,
      value: draft,
      onChange: (event) => setDraft(event.target.value),
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        } else if (event.key === "Escape") {
          event.preventDefault();
          cancelled.current = true;
          setEditing(false);
        }
      },
      onBlur: () => {
        if (cancelled.current) {
          cancelled.current = false;
          return;
        }
        commit();
      },
    },
  };
}

function ItemAdder({ list, label, placeholder, suggestions }) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();

  const taken = useMemo(() => new Set(list.value.map(fold)), [list.value]);
  const options = useMemo(
    () => (suggestions?.length && open ? suggest(suggestions, draft, taken) : []),
    [suggestions, open, draft, taken],
  );
  const showList = open && !list.full && options.length > 0;

  const add = (items) => {
    if (!items.length) return;
    list.append(items);
    setDraft("");
  };

  const choose = (text) => {
    add([text]);
    setActive(-1);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (suggestions?.length && event.key === "ArrowDown") {
      event.preventDefault();
      if (!showList) {
        setOpen(true);
        return;
      }
      setActive((index) => (index + 1) % options.length);
      return;
    }
    if (showList && event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? options.length - 1 : index - 1));
      return;
    }
    if (showList && event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActive(-1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (showList && active >= 0) choose(options[active].text);
      else add(splitItems(draft));
    }
  };

  return (
    <div className="flex items-stretch gap-2">
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={draft}
          disabled={list.full}
          placeholder={list.full ? `حداکثر ${faNumber(list.max)} مورد` : placeholder}
          role={suggestions ? "combobox" : undefined}
          aria-autocomplete={suggestions ? "list" : undefined}
          aria-expanded={suggestions ? showList : undefined}
          aria-controls={suggestions ? listId : undefined}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setDraft(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setOpen(false);
            setActive(-1);
            add(splitItems(draft));
          }}
          className={`
            w-full h-11 px-4 rounded-xl bg-white text-sm text-slate-800
            border transition-all duration-200 outline-none
            placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400
            focus:ring-2 focus:ring-blue-500/30
            ${
              list.error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }
          `}
        />

        {showList && (
          <div
            className="absolute z-30 inset-x-0 top-full mt-1.5 rounded-xl border border-slate-200
                       bg-white shadow-xl shadow-slate-900/10 overflow-hidden"
          >
            <p className="px-3.5 pt-2 pb-1 m-0 text-[11px] text-slate-400">
              عبارت‌های موجود در پایگاه داده
            </p>
            <ul
              id={listId}
              role="listbox"
              aria-label={`پیشنهادهای ${label ?? ""}`}
              className="list-none m-0 p-0 pb-1.5 max-h-64 overflow-y-auto"
            >
              {options.map((option, index) => (
                <li
                  key={option.text}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(option.text);
                  }}
                  onMouseEnter={() => setActive(index)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2 text-sm cursor-pointer
                              transition-colors duration-150 ${
                                index === active ? "bg-blue-50 text-blue-900" : "text-slate-700"
                              }`}
                >
                  <span className="min-w-0 truncate">{option.text}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {faNumber(option.count)} شغل
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => add(splitItems(draft))}
        disabled={list.full || !draft.trim()}
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
  );
}

export const CrossGlyph = icon(<path d="M6 6l12 12M18 6L6 18" />, "w-3 h-3", 3);

function EditableChip({ item, index, list }) {
  const edit = useInlineEdit((text) => list.replace(index, text));

  if (edit.editing) {
    return (
      <input
        type="text"
        {...edit.inputProps}
        aria-label={`ویرایش ${item}`}
        style={{ width: `${Math.min(Math.max(edit.draft.length * 1.4 + 4, 12), 52)}ch` }}
        className="max-w-full h-[30px] px-3 rounded-full bg-white text-[13px] text-slate-800
                   border border-blue-400 outline-none transition-all duration-200
                   focus:ring-2 focus:ring-blue-500/30"
      />
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 max-w-full border rounded-full ps-3 pe-1.5 py-1
                 text-[13px] bg-blue-50 border-blue-200 text-blue-900"
    >
      <button
        type="button"
        onClick={() => edit.start(item)}
        title={`ویرایش ${item}`}
        aria-label={`ویرایش ${item}`}
        className="inline-flex items-center gap-1.5 min-w-0 cursor-text transition-colors duration-200 text-blue-900 hover:text-blue-700"
      >
        <span className="truncate">{item}</span>
        <span className="text-blue-400">{PencilGlyph}</span>
      </button>
      <button
        type="button"
        onClick={() => list.remove(index)}
        title={`حذف ${item}`}
        aria-label={`حذف ${item}`}
        className="shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center cursor-pointer
                   hover:text-white hover:bg-red-500 transition-colors duration-200 text-blue-400"
      >
        {CrossGlyph}
      </button>
    </span>
  );
}

export default function ItemsInput({
  name,
  label,
  placeholder,
  hint,
  required = false,
  min = 1,
  suggestions,
}) {
  const list = useItemList(name, { required, min });
  const unmet = required && list.value.length < min;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span
          className={
            required ? "text-sm font-bold text-slate-900" : "text-sm font-medium text-slate-700"
          }
        >
          {label}
          {required && (
            <span className="text-red-600" title="تکمیل این بخش الزامی است">
              {" *"}
            </span>
          )}
        </span>
      )}

      <ItemAdder list={list} label={label} placeholder={placeholder} suggestions={suggestions} />

      {list.value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {list.value.map((item, index) => (
            <EditableChip key={index} item={item} index={index} list={list} />
          ))}
        </div>
      )}

      {list.error ? (
        <span className="text-xs text-red-600">{list.error.message}</span>
      ) : (
        hint && (
          <span className={unmet ? "text-xs text-red-600" : "text-xs text-slate-400"}>{hint}</span>
        )
      )}
    </div>
  );
}
