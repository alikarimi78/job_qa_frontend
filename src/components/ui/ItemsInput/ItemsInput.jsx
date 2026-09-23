/** Form field that collects a list of short items (skills, tools…) as chips, with an adder box, optional database suggestions and a minimum-count rule. */
import useItemList from "@hooks/useItemList";
import EditableChip from "./EditableChip";
import ItemAdder from "./ItemAdder";

function FieldLabel({ label, required }) {
  return (
    <span
      className={required ? "text-sm font-bold text-slate-900" : "text-sm font-medium text-slate-700"}
    >
      {label}
      {required && (
        <span className="text-red-600" title="تکمیل این بخش الزامی است">
          {" *"}
        </span>
      )}
    </span>
  );
}

export default function ItemsInput({
  name,
  label,
  placeholder,
  hint,
  required = false,
  min = 1,
  suggestions,
}) {
  const list = useItemList(name, { required, min });
  const isBelowMinimum = required && list.value.length < min;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel label={label} required={required} />}

      <ItemAdder list={list} label={label} placeholder={placeholder} suggestions={suggestions} />

      {list.value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {list.value.map((item, index) => (
            <EditableChip key={index} item={item} index={index} list={list} />
          ))}
        </div>
      )}

      {list.error ? (
        <span className="text-xs text-red-600">{list.error.message}</span>
      ) : (
        hint && (
          <span className={isBelowMinimum ? "text-xs text-red-600" : "text-xs text-slate-400"}>
            {hint}
          </span>
        )
      )}
    </div>
  );
}
