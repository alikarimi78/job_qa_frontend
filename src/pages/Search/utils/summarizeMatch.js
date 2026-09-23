/** Totals for one ranked job in the advanced search: the fields worth showing, and how many of the user's items were found, entered and unknown to the database. */
const unknownItems = (field) => field.unknown ?? [];

export function summarizeMatch(match) {
  const fields = match.fields.filter(
    (field) => field.matched.length || field.missing.length || unknownItems(field).length
  );
  const sum = (count) => fields.reduce((total, field) => total + count(field), 0);

  return {
    fields,
    foundCount: sum((field) => field.matched.length),
    enteredCount: sum((field) => field.matched.length + field.missing.length),
    unknownCount: sum((field) => unknownItems(field).length),
  };
}
