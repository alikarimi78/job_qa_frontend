/** Logic of the starred tab: the current page of starred analyses, which one is open, and removing one after confirmation (stepping back a page when the last row goes). */
import { useState } from "react";
import { useDeleteSavedSearchMutation, useSavedSearchesQuery } from "@services/savedApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";
import { SAVED_SEARCHES_PAGE_SIZE } from "../constants";

export default function useSavedSearches() {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const { data, isLoading, isFetching } = useSavedSearchesQuery({
    page,
    pageSize: SAVED_SEARCHES_PAGE_SIZE,
  });
  const [deleteSavedSearch, { isLoading: isRemoving }] = useDeleteSavedSearchMutation();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const confirmRemoval = async () => {
    const savedSearch = pendingRemoval;
    try {
      await deleteSavedSearch(savedSearch.id).unwrap();
      setPendingRemoval(null);
      if (openId === savedSearch.id) setOpenId(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      showMessage.success("از تحلیل‌های ستاره‌دار حذف شد.");
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return {
    items,
    total,
    isLoading,
    isFetching,
    pagination: {
      page: data?.page ?? page,
      pageSize: data?.page_size ?? SAVED_SEARCHES_PAGE_SIZE,
      total,
      onPage: setPage,
    },
    openId,
    open: setOpenId,
    close: () => setOpenId(null),
    pendingRemoval,
    askToRemove: setPendingRemoval,
    cancelRemoval: () => setPendingRemoval(null),
    confirmRemoval,
    isRemoving,
  };
}
