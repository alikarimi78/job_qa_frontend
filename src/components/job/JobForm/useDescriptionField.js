/** Binds the required job description to the form and tracks whether its text area is open for editing. */
import { useState } from "react";
import { useController } from "react-hook-form";

const REQUIRED_MESSAGE = "شرح شغل را وارد نمایید";

export default function useDescriptionField() {
  const { field, fieldState } = useController({
    name: "description",
    rules: { validate: (text) => Boolean(text?.trim()) || REQUIRED_MESSAGE },
  });
  const [isEditing, setIsEditing] = useState(false);

  const finishEditing = () => {
    field.onBlur();
    setIsEditing(false);
  };

  return {
    value: field.value,
    onChange: field.onChange,
    error: fieldState.error,
    isEditing,
    startEditing: () => setIsEditing(true),
    finishEditing,
    placeholder: REQUIRED_MESSAGE,
  };
}
