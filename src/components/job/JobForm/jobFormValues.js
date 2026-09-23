/** Pure conversions for the job form: record → form values (list cells become arrays, the owner becomes a select value), form values → request body, and the order the field boxes appear in. */
import { DETAIL_ORDER, LIST_KEYS } from "@constants/jobFields";
import { PUBLIC_OWNER } from "@constants/organizationScope";
import { cellFromItems, itemsFromCell } from "@utils/itemCells";

function initialOwner(initial, owners, allowPublic, defaultOwner) {
  if (initial?.organization_id != null) return String(initial.organization_id);
  if (defaultOwner != null) return String(defaultOwner);
  if (allowPublic) return PUBLIC_OWNER;
  return String(owners[0]?.id ?? PUBLIC_OWNER);
}

export function buildFormValues(initial, owners, allowPublic, defaultOwner = null) {
  const values = { job_title: initial?.job_title ?? "", description: initial?.description ?? "" };
  for (const key of LIST_KEYS) values[key] = itemsFromCell(initial?.[key] ?? "");
  values.organization_id = initialOwner(initial, owners, allowPublic, defaultOwner);
  return values;
}

export function buildRequestBody(values, hasOwnerChoice) {
  const body = { job_title: values.job_title.trim(), description: values.description.trim() };
  for (const key of LIST_KEYS) body[key] = cellFromItems(values[key]);
  if (hasOwnerChoice) {
    body.organization_id =
      values.organization_id === PUBLIC_OWNER ? null : Number(values.organization_id);
  }
  return body;
}

export function orderFormFields(primaryKeys) {
  const primarySet = new Set(primaryKeys);
  const isNotDescription = (field) => field.key !== "description";
  return DETAIL_ORDER.map((key) => ({ key, primary: primarySet.has(key) })).sort(
    (first, second) =>
      isNotDescription(first) - isNotDescription(second) || second.primary - first.primary
  );
}
