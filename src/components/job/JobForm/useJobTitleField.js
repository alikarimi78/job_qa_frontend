/** Binds the required job title to the form and lets it be edited in place; an empty edit leaves the old title. */
import { useController } from "react-hook-form";
import useInlineEdit from "@hooks/useInlineEdit";

const REQUIRED_MESSAGE = "عنوان شغل را وارد نمایید";

export default function useJobTitleField() {
  const { field, fieldState } = useController({
    name: "job_title",
    rules: { validate: (text) => Boolean(text?.trim()) || REQUIRED_MESSAGE },
  });
  const edit = useInlineEdit((text) => {
    if (text.trim()) field.onChange(text.trim());
  });

  return {
    title: field.value,
    error: fieldState.error,
    edit,
    startEditing: () => edit.start(field.value ?? ""),
    placeholder: REQUIRED_MESSAGE,
  };
}
