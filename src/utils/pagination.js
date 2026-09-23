/** Works out which page numbers a pager shows: all of them when few, otherwise the first, last and neighbours of the current page with gaps between. */
const VISIBLE_SLOTS = 7;

const range = (length, start) => Array.from({ length }, (_, index) => start + index);

export function pageSlots(currentPage, pageCount) {
  if (pageCount <= VISIBLE_SLOTS) return range(pageCount, 1);
  const runLength = VISIBLE_SLOTS - 2;
  if (currentPage <= runLength - 1) return [...range(runLength, 1), "end-gap", pageCount];
  if (currentPage >= pageCount - runLength + 2) {
    return [1, "start-gap", ...range(runLength, pageCount - runLength + 1)];
  }
  return [1, "start-gap", currentPage - 1, currentPage, currentPage + 1, "end-gap", pageCount];
}
