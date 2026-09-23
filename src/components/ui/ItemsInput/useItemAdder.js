/** Logic of the "add an item" box: the typed draft, the suggestion dropdown and its keyboard navigation (arrows, Enter, Escape), and adding on Enter, click or blur. */
import { useId, useMemo, useState } from "react";
import { foldText } from "@utils/text";
import { splitItems } from "@utils/itemCells";
import { matchSuggestions } from "./matchSuggestions";

export default function useItemAdder(list, suggestions) {
  const [draft, setDraft] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const hasSuggestions = Boolean(suggestions?.length);

  const existingItems = useMemo(() => new Set(list.value.map(foldText)), [list.value]);
  const options = useMemo(
    () => (hasSuggestions && isListOpen ? matchSuggestions(suggestions, draft, existingItems) : []),
    [hasSuggestions, suggestions, isListOpen, draft, existingItems]
  );
  const isListVisible = isListOpen && !list.isFull && options.length > 0;

  const closeList = () => {
    setIsListOpen(false);
    setActiveIndex(-1);
  };

  const addItems = (items) => {
    if (!items.length) return;
    list.append(items);
    setDraft("");
  };

  const addDraft = () => addItems(splitItems(draft));

  const chooseOption = (text) => {
    addItems([text]);
    closeList();
  };

  const handleKeyDown = (event) => {
    if (hasSuggestions && event.key === "ArrowDown") {
      event.preventDefault();
      if (!isListVisible) {
        setIsListOpen(true);
        return;
      }
      setActiveIndex((index) => (index + 1) % options.length);
      return;
    }
    if (isListVisible && event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? options.length - 1 : index - 1));
      return;
    }
    if (isListVisible && event.key === "Escape") {
      event.preventDefault();
      closeList();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (isListVisible && activeIndex >= 0) chooseOption(options[activeIndex].text);
      else addDraft();
    }
  };

  const handleChange = (event) => {
    setDraft(event.target.value);
    setIsListOpen(true);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    closeList();
    addDraft();
  };

  return {
    draft,
    options,
    activeIndex,
    setActiveIndex,
    listId,
    isListVisible,
    addDraft,
    chooseOption,
    inputHandlers: {
      onFocus: () => setIsListOpen(true),
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
    },
  };
}
