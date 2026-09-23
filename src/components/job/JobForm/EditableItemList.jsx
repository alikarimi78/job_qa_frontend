/** Editable body of a list field: its items (or the career path drawn from the current title) followed by the add button, plus the alias hint and the field's error. */
import { useWatch } from "react-hook-form";
import { COLUMN_LABELS } from "@constants/jobFields";
import CareerPath from "../JobDetails/CareerPath";
import { ITEM_LIST_CLASS } from "../JobDetails/itemListStyle";
import { fieldTheme } from "../fieldTheme";
import AddItemButton from "./AddItemButton";
import EditableItem from "./EditableItem";

const ADD_ITEM_SLOT = {};

export default function EditableItemList({ fieldKey, list, onPromote }) {
  const theme = fieldTheme(fieldKey);
  const jobTitle = useWatch({ name: "job_title" });
  const items = list.value;
  const promote = fieldKey === "aliases" ? onPromote : undefined;

  const renderItem = (item, index, as) => (
    <EditableItem
      key={index}
      item={item}
      index={index}
      list={list}
      theme={theme}
      onPromote={promote}
      as={as}
    />
  );

  return (
    <>
      {fieldKey === "career_path_next" ? (
        <CareerPath
          root={jobTitle?.trim() || COLUMN_LABELS.job_title}
          steps={[...items, ADD_ITEM_SLOT]}
          theme={theme}
          renderStep={(step, index) =>
            step === ADD_ITEM_SLOT ? (
              <AddItemButton list={list} theme={theme} />
            ) : (
              renderItem(step, index, "div")
            )
          }
        />
      ) : (
        <ul className={ITEM_LIST_CLASS}>
          {items.map((item, index) => renderItem(item, index))}
          <li className="flex items-start leading-7">
            <AddItemButton list={list} theme={theme} wide />
          </li>
        </ul>
      )}
      {promote && items.length > 0 && (
        <p className="text-[11px] text-slate-500 mt-2.5 mb-0 leading-5">
          برای جایگزینی عنوان شغل با یکی از نام‌های دیگر، روی آن نام کلیک و دکمه جابه‌جایی را انتخاب
          نمایید.
        </p>
      )}
      {list.error && <p className="text-xs text-red-600 mt-2 mb-0">{list.error.message}</p>}
    </>
  );
}
