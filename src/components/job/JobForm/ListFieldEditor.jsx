/** Editable box for one list field (responsibilities, tools, aliases…); at least one item is required. */
import { COLUMN_LABELS } from "@constants/jobFields";
import useItemList from "@hooks/useItemList";
import FieldShell from "../JobDetails/FieldShell";
import EditableItemList from "./EditableItemList";
import { itemCountLabel } from "./itemCountLabel";

export default function ListFieldEditor({ fieldKey, primary, onPromote }) {
  const list = useItemList(fieldKey, { required: true });

  return (
    <FieldShell
      fieldKey={fieldKey}
      label={COLUMN_LABELS[fieldKey]}
      primary={primary}
      count={itemCountLabel(list)}
      invalid={Boolean(list.error)}
    >
      <EditableItemList fieldKey={fieldKey} list={list} onPromote={onPromote} />
    </FieldShell>
  );
}
