/** Logic of the dashed "add" button: turns into a focused input, adds the typed lines on Enter or blur, and closes on Escape. */
import { useEffect, useRef, useState } from "react";
import { splitLines } from "@utils/itemCells";

export default function useAddItem(list) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const addDraft = () => {
    const items = splitLines(draft);
    if (items.length) list.append(items);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addDraft();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft("");
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    addDraft();
    setIsOpen(false);
  };

  return {
    isOpen,
    draft,
    open: () => setIsOpen(true),
    inputProps: {
      ref: inputRef,
      value: draft,
      onChange: (event) => setDraft(event.target.value),
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
    },
  };
}
