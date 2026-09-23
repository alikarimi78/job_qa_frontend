/** Settings of the job list: rows per page, how long typing pauses before filtering, and how many aliases a row shows. */
export const JOBS_PAGE_SIZE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
export const VISIBLE_ALIAS_COUNT = 2;
export const EMPTY_JOBS_PAGE = { items: [], total: 0, page: 1, page_size: JOBS_PAGE_SIZE };
