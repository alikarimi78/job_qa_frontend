/** Stars or un-stars the current answer: saving it stores the question with the answer, un-starring deletes that saved copy. */
import { useState } from "react";
import { useDeleteSavedSearchMutation, useSaveSearchMutation } from "@services/savedApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export default function useStarredSearch(question, result) {
  const [savedSearchId, setSavedSearchId] = useState(null);
  const [saveSearch, { isLoading: isSaving }] = useSaveSearchMutation();
  const [deleteSavedSearch, { isLoading: isRemoving }] = useDeleteSavedSearchMutation();
  const isStarred = savedSearchId != null;

  const toggleStar = async () => {
    try {
      if (isStarred) {
        await deleteSavedSearch(savedSearchId).unwrap();
        setSavedSearchId(null);
        showMessage.info("از تحلیل‌های ستاره‌دار حذف شد.");
        return;
      }
      const savedSearch = await saveSearch({ question, result }).unwrap();
      setSavedSearchId(savedSearch.id);
      showMessage.success("در تحلیل‌های ستاره‌دار ذخیره شد.");
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return { isStarred, isBusy: isSaving || isRemoving, toggleStar };
}
