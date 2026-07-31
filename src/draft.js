// A generated job draft has to survive the hop from the search page to the
// suggestion form — and a login detour in between, since /search is public while
// /jobs/suggestions is not. sessionStorage rather than localStorage on purpose:
// an offer belongs to the tab the user accepted it in, not to the browser forever.
const KEY = "pending_job_draft";

export function stashDraft(draft) {
  sessionStorage.setItem(KEY, JSON.stringify(draft));
}

export function readDraft() {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;                     // corrupted stash: fall back to a blank form
  }
}

export function clearDraft() {
  sessionStorage.removeItem(KEY);
}
