/** Caption under a field's title: "N items", or "X of N items" while the list is collapsed. */
import { faNumber } from "@utils/numbers";

export function itemCountText(field, visibleItems) {
  if (!field.items.length) return null;
  return visibleItems.length < field.items.length
    ? `${faNumber(visibleItems.length)} از ${faNumber(field.items.length)} مورد`
    : `${faNumber(field.items.length)} مورد`;
}
