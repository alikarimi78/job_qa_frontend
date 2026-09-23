/** Text box plus green "+" button that adds one or more items to a list, with the database-suggestion dropdown when a vocabulary is given. */
import { PlusIcon } from "@components/icons";
import { faNumber } from "@utils/numbers";
import SuggestionList from "./SuggestionList";
import useItemAdder from "./useItemAdder";

export default function ItemAdder({ list, label, placeholder, suggestions }) {
  const adder = useItemAdder(list, suggestions);
  const hasVocabulary = Boolean(suggestions);
  const addLabel = `افزودن به ${label ?? "فهرست"}`;

  return (
    <div className="flex items-stretch gap-2">
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={adder.draft}
          disabled={list.isFull}
          placeholder={list.isFull ? `حداکثر ${faNumber(list.max)} مورد` : placeholder}
          role={hasVocabulary ? "combobox" : undefined}
          aria-autocomplete={hasVocabulary ? "list" : undefined}
          aria-expanded={hasVocabulary ? adder.isListVisible : undefined}
          aria-controls={hasVocabulary ? adder.listId : undefined}
          aria-activedescendant={
            adder.isListVisible && adder.activeIndex >= 0
              ? `${adder.listId}-${adder.activeIndex}`
              : undefined
          }
          {...adder.inputHandlers}
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

        {adder.isListVisible && (
          <SuggestionList
            listId={adder.listId}
            label={label}
            options={adder.options}
            activeIndex={adder.activeIndex}
            onHover={adder.setActiveIndex}
            onChoose={adder.chooseOption}
          />
        )}
      </div>
      <button
        type="button"
        onClick={adder.addDraft}
        disabled={list.isFull || !adder.draft.trim()}
        title={addLabel}
        aria-label={addLabel}
        className="shrink-0 w-11 h-11 rounded-xl inline-flex items-center justify-center
                   text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer
                   shadow-md shadow-emerald-600/20 transition-all duration-200
                   hover:-translate-y-0.5 active:translate-y-0
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                   disabled:hover:translate-y-0"
      >
        <PlusIcon strokeWidth={2.5} />
      </button>
    </div>
  );
}
