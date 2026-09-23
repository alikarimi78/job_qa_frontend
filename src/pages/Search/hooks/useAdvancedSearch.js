/** Logic of the advanced (profile) search: the item form, which required sections are still short, the database vocabulary for suggestions, and ranking the jobs that fit the entered profile. */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdvancedSearchMutation, useProfileVocabularyQuery } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";
import { PROFILE_FIELDS } from "../constants";

const BLANK_PROFILE = Object.fromEntries(PROFILE_FIELDS.map(({ key }) => [key, []]));
const REQUIRED_FIELDS = PROFILE_FIELDS.filter(({ min }) => min > 0);

const withoutEmptyFields = (profile) =>
  Object.fromEntries(Object.entries(profile).filter(([, items]) => items?.length));

export default function useAdvancedSearch() {
  const methods = useForm({ defaultValues: BLANK_PROFILE });
  const [result, setResult] = useState(null);
  const [advancedSearch, { isLoading: isSearching }] = useAdvancedSearchMutation();
  const { data: vocabulary } = useProfileVocabularyQuery();

  const values = methods.watch();
  const unmetFields = REQUIRED_FIELDS.filter(({ key, min }) => (values[key]?.length ?? 0) < min);

  const rankJobs = async (profile) => {
    setResult(null);
    try {
      setResult(await advancedSearch(withoutEmptyFields(profile)).unwrap());
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return {
    methods,
    submit: methods.handleSubmit(rankJobs),
    isSearching,
    result,
    unmetFields,
    isReady: unmetFields.length === 0,
    suggestionsFor: (key) => vocabulary?.fields?.[key],
  };
}
