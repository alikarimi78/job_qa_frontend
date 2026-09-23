/** Heading row of the job editor: the job title (click to edit in place), the owner select, and a fading rule. */
import { BriefcaseIcon, PencilIcon } from "@components/icons";
import { fitWidthStyle } from "./editorStyles";
import OwnerSelect from "./OwnerSelect";
import useJobTitleField from "./useJobTitleField";

export default function JobTitleEditor({ owners, allowPublic }) {
  const { title, error, edit, startEditing, placeholder } = useJobTitleField();

  return (
    <div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                     shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
        >
          <BriefcaseIcon />
        </span>
        {edit.isEditing ? (
          <input
            type="text"
            {...edit.inputProps}
            aria-label="عنوان شغل"
            style={fitWidthStyle(edit.draft)}
            className="max-w-full h-9 px-3 rounded-lg bg-white text-base font-bold text-slate-800
                       border border-blue-400 outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            title="ویرایش عنوان شغل"
            className="group inline-flex items-center gap-1.5 min-w-0 text-start cursor-text rounded-lg -mx-1.5
                       px-1.5 transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <span className="text-base font-bold text-slate-800 leading-7">
              {title?.trim() || <span className="text-slate-400">{placeholder}</span>}
            </span>
            <span className="text-slate-300 group-hover:text-slate-500">
              <PencilIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
            </span>
          </button>
        )}
        {owners.length > 0 && <OwnerSelect owners={owners} allowPublic={allowPublic} />}
        <span className="flex-1 min-w-8 h-px bg-gradient-to-l from-slate-200 to-transparent" />
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5 mb-0">{error.message}</p>}
    </div>
  );
}
