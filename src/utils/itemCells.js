/** Converts between a list column as stored («item | item | item») and the array of items the forms edit, and splits typed text into items. */
const TYPED_ITEM_SEPARATORS = /[،,;؛|\n\t]+/;
const LINE_SEPARATORS = /[|\n]+/;
const CELL_SEPARATOR = "|";
const PLACEHOLDER_ITEMS = new Set(["-", "–", "—", "_"]);

const trimmedParts = (text, separator) =>
  String(text ?? "")
    .split(separator)
    .map((part) => part.trim());

export const splitItems = (text) => trimmedParts(text, TYPED_ITEM_SEPARATORS).filter(Boolean);

export const splitLines = (text) => trimmedParts(text, LINE_SEPARATORS).filter(Boolean);

export const itemsFromCell = (cell) =>
  trimmedParts(cell, CELL_SEPARATOR).filter((part) => part && !PLACEHOLDER_ITEMS.has(part));

export const cellFromItems = (items) => (items ?? []).join(` ${CELL_SEPARATOR} `);
