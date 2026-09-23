/** Binds a react-hook-form array field to add/remove/replace operations that skip duplicates and stop at a maximum, with an optional "at least N items" rule. */
import { useController, useFormContext } from "react-hook-form";
import { splitItems } from "@utils/itemCells";
import { faNumber } from "@utils/numbers";

const DEFAULT_MAX_ITEMS = 20;

const normalized = (item) => item.toLowerCase();

const minimumMessage = (min) => `دست‌کم ${min === 1 ? "یک" : faNumber(min)} مورد وارد نمایید`;

export default function useItemList(name, { required = false, min = 1, max = DEFAULT_MAX_ITEMS } = {}) {
  const { control } = useFormContext();
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      validate: (items) => !required || (items?.length ?? 0) >= min || minimumMessage(min),
    },
  });

  const append = (incomingItems) => {
    const seen = new Set(value.map(normalized));
    const nextItems = [...value];
    for (const item of incomingItems) {
      if (nextItems.length >= max) break;
      if (seen.has(normalized(item))) continue;
      seen.add(normalized(item));
      nextItems.push(item);
    }
    onChange(nextItems);
  };

  const remove = (index) => onChange(value.filter((_, itemIndex) => itemIndex !== index));

  const replace = (index, text, split = splitItems) => {
    const incomingItems = split(text);
    if (!incomingItems.length) return;

    const otherItems = new Set(
      value.filter((_, itemIndex) => itemIndex !== index).map(normalized)
    );
    const keptItems = [];
    for (const item of incomingItems) {
      if (otherItems.has(normalized(item))) continue;
      otherItems.add(normalized(item));
      keptItems.push(item);
    }
    const room = Math.max(max - (value.length - 1), 0);
    onChange([...value.slice(0, index), ...keptItems.slice(0, room), ...value.slice(index + 1)]);
  };

  return { value, error, max, isFull: value.length >= max, append, remove, replace };
}
