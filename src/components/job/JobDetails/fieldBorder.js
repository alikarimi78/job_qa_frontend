/** Border of a field box: red ring when invalid, accent ring when it answers the question, a plain border otherwise. */
export function fieldBorderClass({ isInvalid, isPrimary, theme, plainBorder }) {
  if (isInvalid) return "ring-2 ring-red-300 border-transparent";
  if (isPrimary) return `ring-2 ${theme.ring} border-transparent`;
  return plainBorder;
}
