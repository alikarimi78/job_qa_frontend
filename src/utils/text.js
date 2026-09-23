/** Text matching for the client-side list filters: folds Arabic/Persian letter variants, diacritics and half-spaces so a search finds a name however it was typed. */
const CHARACTER_FOLDS = [
  [/[ً-ٰٟـ]/g, ""],
  [/[يى]/g, "ی"],
  [/ك/g, "ک"],
  [/ؤ/g, "و"],
  [/[أإٱ]/g, "ا"],
  [/ئ/g, "ی"],
  [/[ةۀ]/g, "ه"],
  [/‌/g, " "],
];

export function foldText(text) {
  let folded = String(text ?? "").toLowerCase();
  for (const [pattern, replacement] of CHARACTER_FOLDS) folded = folded.replace(pattern, replacement);
  return folded.replace(/\s+/g, " ").trim();
}

export const matchesQuery = (value, foldedQuery) => !foldedQuery || foldText(value).includes(foldedQuery);
