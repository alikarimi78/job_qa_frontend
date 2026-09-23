/** Polls the embedding rebuild status every few seconds while the tab is focused, for pages that show whether a rebuild is running. */
import { useRebuildStatusQuery } from "@services/adminApi";

const POLL_INTERVAL_MS = 3000;

export default function useRebuildStatus() {
  const { data: rebuildStatus } = useRebuildStatusQuery(undefined, {
    pollingInterval: POLL_INTERVAL_MS,
    skipPollingIfUnfocused: true,
  });
  return { rebuildStatus, isRebuilding: rebuildStatus?.running ?? false };
}
