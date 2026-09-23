/** One section of the profile form (e.g. skills): the items input with its required/optional hint and the database suggestions for that field. */
import ItemsInput from "@components/ui/ItemsInput/ItemsInput";
import { faNumber } from "@utils/numbers";

function hintFor(min, hasSuggestions) {
  return [
    min > 0 ? `الزامی — دست‌کم ${faNumber(min)} مورد` : "اختیاری",
    hasSuggestions ? "از فهرست پیشنهادی انتخاب نمایید" : null,
  ]
    .filter(Boolean)
    .join("؛ ");
}

export default function ProfileFieldInput({ field, suggestions }) {
  return (
    <ItemsInput
      name={field.key}
      label={field.label}
      placeholder={field.placeholder}
      required={field.min > 0}
      min={Math.max(field.min, 1)}
      hint={hintFor(field.min, Boolean(suggestions))}
      suggestions={suggestions}
    />
  );
}
