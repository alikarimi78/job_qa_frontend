/** One item of an editable list: click to edit in place; while editing, buttons offer to delete it or (for aliases) swap it into the job title. An emptied item is removed. */
import { SwapIcon, XIcon } from "@components/icons";
import useInlineEdit from "@hooks/useInlineEdit";
import { splitLines } from "@utils/itemCells";
import LineBullet from "../JobDetails/LineBullet";
import { EDITOR_INPUT_CLASS } from "./editorStyles";
import ItemActionButton from "./ItemActionButton";

export default function EditableItem({ item, index, list, theme, onPromote, as: Tag = "li" }) {
  const edit = useInlineEdit((text) =>
    text.trim() ? list.replace(index, text, splitLines) : list.remove(index)
  );

  const promote = () => {
    edit.cancel();
    onPromote(item);
  };

  const remove = () => {
    edit.cancel();
    list.remove(index);
  };

  return (
    <Tag className="flex flex-1 min-w-0 items-start gap-2.5 leading-7">
      <LineBullet theme={theme} />
      {edit.isEditing ? (
        <span className="flex flex-1 min-w-0 items-center gap-1">
          <input
            type="text"
            {...edit.inputProps}
            aria-label={`ویرایش ${item}`}
            className={`${EDITOR_INPUT_CLASS} flex-1 min-w-0 rounded-lg`}
          />
          {onPromote && (
            <ItemActionButton title={`جایگزینی عنوان شغل با «${item}»`} onClick={promote}>
              <SwapIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
            </ItemActionButton>
          )}
          <ItemActionButton danger title={`حذف «${item}»`} onClick={remove}>
            <XIcon className="w-3 h-3" strokeWidth={3} />
          </ItemActionButton>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => edit.start(item)}
          title={`ویرایش «${item}»`}
          className="flex-1 min-w-0 text-start cursor-text rounded-md -mx-1 px-1 transition-colors
                     duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500/40"
        >
          {item}
        </button>
      )}
    </Tag>
  );
}
