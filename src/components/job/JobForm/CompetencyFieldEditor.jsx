/** Editable view of one competency (skills, knowledge or abilities) inside the competency block; at least one item is required. */
import { COLUMN_LABELS } from "@constants/jobFields";
import useItemList from "@hooks/useItemList";
import CompetencyItemShell from "../JobDetails/CompetencyItemShell";
import EditableItemList from "./EditableItemList";
import { itemCountLabel } from "./itemCountLabel";

export default function CompetencyFieldEditor({ fieldKey, primary }) {
  const list = useItemList(fieldKey, { required: true });

  return (
    <CompetencyItemShell
      fieldKey={fieldKey}
      label={COLUMN_LABELS[fieldKey]}
      primary={primary}
      count={itemCountLabel(list)}
      invalid={Boolean(list.error)}
    >
      <EditableItemList fieldKey={fieldKey} list={list} />
    </CompetencyItemShell>
  );
}
