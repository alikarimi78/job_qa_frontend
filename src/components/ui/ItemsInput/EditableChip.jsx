/** One added item shown as a chip: click the text to edit it in place, click the × to remove it. */
import { PencilIcon, XIcon } from "@components/icons";
import useInlineEdit from "@hooks/useInlineEdit";

const editorWidth = (text) => `${Math.min(Math.max(text.length * 1.4 + 4, 12), 52)}ch`;

export default function EditableChip({ item, index, list }) {
  const edit = useInlineEdit((text) => list.replace(index, text));

  if (edit.isEditing) {
    return (
      <input
        type="text"
        {...edit.inputProps}
        aria-label={`ویرایش ${item}`}
        style={{ width: editorWidth(edit.draft) }}
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
        <span className="text-blue-400">
          <PencilIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => list.remove(index)}
        title={`حذف ${item}`}
        aria-label={`حذف ${item}`}
        className="shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center cursor-pointer
                   hover:text-white hover:bg-red-500 transition-colors duration-200 text-blue-400"
      >
        <XIcon className="w-3 h-3" strokeWidth={3} />
      </button>
    </span>
  );
}
