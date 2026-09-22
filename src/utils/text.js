const FOLDS = [
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
  for (const [pattern, replacement] of FOLDS) folded = folded.replace(pattern, replacement);
  return folded.replace(/\s+/g, " ").trim();
}

export const matchesQuery = (value, query) => !query || foldText(value).includes(query);
