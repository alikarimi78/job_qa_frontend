// Two Persian strings compared the way a reader means them: Arabic letter forms and hamza folded onto
// their Persian spellings, marks dropped, a half-space read as a space and case ignored. The suggestion
// list in `ui/ItemsInput` matches on it, and so do the searches over a panel's own rows — «سازمان
// آزمايشي» typed with Arabic ي still finds «سازمان آزمایشی», as `admin.service.title_filters` does for a
// job title on the server.
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

// Whether a row matches what was typed into a panel's search box; an empty query matches everything.
export const matchesQuery = (value, query) => !query || foldText(value).includes(query);

export default foldText;
