/** Filing a new job suggestion: which organizations it may belong to, sending it, and a success flag that shows the confirmation box and clears the form. */
import { useState } from "react";
import useSuggestionOwners from "@hooks/useSuggestionOwners";
import { useSuggestJobMutation } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export const FILED_MESSAGE = "پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.";

export default function useNewSuggestion() {
  const [isFiled, setIsFiled] = useState(false);
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();
  const { owners, defaultOwner, loading: areOwnersLoading } = useSuggestionOwners();

  const fileSuggestion = async (body, resetForm) => {
    setIsFiled(false);
    try {
      await suggestJob(body).unwrap();
      setIsFiled(true);
      resetForm();
      showMessage.success(FILED_MESSAGE);
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return { isFiled, isFiling, owners, defaultOwner, areOwnersLoading, fileSuggestion };
}
