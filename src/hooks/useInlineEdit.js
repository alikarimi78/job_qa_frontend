/** State for editing a piece of text in place: start with the current text, commit on Enter or blur, cancel on Escape; returns props to spread on the input. */
import { useEffect, useRef, useState } from "react";

export default function useInlineEdit(onCommit) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const wasCancelled = useRef(false);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    onCommit(draft);
  };

  const cancel = () => {
    wasCancelled.current = true;
    setIsEditing(false);
  };

  const start = (text) => {
    wasCancelled.current = false;
    setDraft(text);
    setIsEditing(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  const handleBlur = () => {
    if (wasCancelled.current) {
      wasCancelled.current = false;
      return;
    }
    commit();
  };

  return {
    isEditing,
    draft,
    start,
    cancel,
    inputProps: {
      ref: inputRef,
      value: draft,
      onChange: (event) => setDraft(event.target.value),
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
    },
  };
}
