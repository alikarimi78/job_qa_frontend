/** Picks the vocabulary suggestions that fit what the user has typed (every typed word starts a word of the suggestion, or the letters appear in order), skipping items already added. */
import { foldText } from "@utils/text";

const SUGGESTION_LIMIT = 8;

function fitsQuery(foldedOption, queryWords, compactQuery) {
  if (!queryWords.length) return true;
  const optionWords = foldedOption.split(" ");
  const matchesWordStarts = queryWords.every((word) =>
    optionWords.some((optionWord) => optionWord.startsWith(word))
  );
  return matchesWordStarts || foldedOption.replace(/ /g, "").includes(compactQuery);
}

export function matchSuggestions(suggestions, query, existingItems) {
  const queryWords = foldText(query).split(" ").filter(Boolean);
  const compactQuery = queryWords.join("");
  const matches = [];
  for (const option of suggestions) {
    const foldedOption = foldText(option.text);
    if (existingItems.has(foldedOption)) continue;
    if (!fitsQuery(foldedOption, queryWords, compactQuery)) continue;
    matches.push(option);
    if (matches.length >= SUGGESTION_LIMIT) break;
  }
  return matches;
}
