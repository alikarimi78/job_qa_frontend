/** Read-only box for one job field, with a collapsible item list. */
import { fieldTheme } from "../fieldTheme";
import ExpandButton from "./ExpandButton";
import FieldItems from "./FieldItems";
import FieldShell from "./FieldShell";
import { itemCountText } from "./itemCountText";
import useExpandableItems from "./useExpandableItems";

export default function FieldCard({ field, jobTitle, onPickAlias }) {
  const theme = fieldTheme(field.key);
  const { isExpanded, toggleExpanded, visibleItems, hiddenCount, canCollapse } =
    useExpandableItems(field);

  return (
    <FieldShell
      fieldKey={field.key}
      label={field.label}
      primary={field.primary}
      count={itemCountText(field, visibleItems)}
      aside={
        canCollapse && (
          <ExpandButton
            isExpanded={isExpanded}
            total={field.items.length}
            theme={theme}
            onToggle={toggleExpanded}
          />
        )
      }
    >
      <FieldItems
        field={field}
        theme={theme}
        visibleItems={visibleItems}
        hiddenCount={hiddenCount}
        onExpand={toggleExpanded}
        jobTitle={jobTitle}
        onPickAlias={onPickAlias}
      />
    </FieldShell>
  );
}
