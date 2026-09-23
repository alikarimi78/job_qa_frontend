/** Dashed "+ add" button at the end of an editable list that becomes an input for the new item; hidden once the list is full. */
import { PlusIcon } from "@components/icons";
import { EDITOR_INPUT_CLASS, fitWidthStyle } from "./editorStyles";
import useAddItem from "./useAddItem";

export default function AddItemButton({ list, theme, wide = false }) {
  const adder = useAddItem(list);

  if (list.isFull) return null;

  if (adder.isOpen) {
    return (
      <input
        type="text"
        placeholder="مورد جدید"
        aria-label="مورد جدید"
        {...adder.inputProps}
        style={wide ? undefined : fitWidthStyle(adder.draft)}
        className={`${EDITOR_INPUT_CLASS} placeholder:text-slate-400 ${wide ? "w-full rounded-lg" : "rounded-full"}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={adder.open}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] leading-6 border
                  border-dashed bg-white/70 cursor-pointer transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${theme.moreButton}`}
    >
      <PlusIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
      افزودن
    </button>
  );
}
