/** Editable box for the job description: shows the text, and turns into a growing text area when clicked. */
import { COLUMN_LABELS } from "@constants/jobFields";
import FieldShell from "../JobDetails/FieldShell";
import useDescriptionField from "./useDescriptionField";

export default function DescriptionEditor({ primary }) {
  const description = useDescriptionField();

  return (
    <FieldShell
      fieldKey="description"
      label={COLUMN_LABELS.description}
      primary={primary}
      invalid={Boolean(description.error)}
    >
      {description.isEditing ? (
        <textarea
          autoFocus
          value={description.value}
          onChange={description.onChange}
          onBlur={description.finishEditing}
          onKeyDown={(event) => event.key === "Escape" && event.currentTarget.blur()}
          aria-label={COLUMN_LABELS.description}
          className="block w-full field-sizing-content min-h-24 -mx-1 px-1 leading-8 text-sm text-slate-700
                     bg-white rounded-lg border border-blue-400 outline-none resize-none
                     focus:ring-2 focus:ring-blue-500/30"
        />
      ) : (
        <button
          type="button"
          onClick={description.startEditing}
          title="ویرایش شرح شغل"
          className="block w-full text-justify leading-8 text-slate-700 cursor-text rounded-lg -mx-1 px-1
                     transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {description.value?.trim() || (
            <span className="text-slate-400">{description.placeholder}</span>
          )}
        </button>
      )}
      {description.error && (
        <p className="text-xs text-red-600 mt-2 mb-0">{description.error.message}</p>
      )}
    </FieldShell>
  );
}
