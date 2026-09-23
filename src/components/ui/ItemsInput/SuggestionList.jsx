/** Dropdown under the item box listing matching phrases from the database, each with how many jobs use it. */
import { faNumber } from "@utils/numbers";

export default function SuggestionList({ listId, label, options, activeIndex, onHover, onChoose }) {
  return (
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
            aria-selected={index === activeIndex}
            onMouseDown={(event) => {
              event.preventDefault();
              onChoose(option.text);
            }}
            onMouseEnter={() => onHover(index)}
            className={`flex items-center justify-between gap-3 px-3.5 py-2 text-sm cursor-pointer
                        transition-colors duration-150 ${
                          index === activeIndex ? "bg-blue-50 text-blue-900" : "text-slate-700"
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
  );
}
