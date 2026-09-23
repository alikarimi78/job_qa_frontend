/** The question box and its search request: the typed question, the latest answer with the question it answered, and a counter that changes on every new answer so the result card starts fresh. */
import { useState } from "react";
import { useSearchMutation } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export default function useQuestionSearch() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const [search, { isLoading: isSearching }] = useSearchMutation();

  const runSearch = async (text) => {
    const trimmedQuestion = text.trim();
    if (!trimmedQuestion) return;
    setResult(null);
    try {
      const answer = await search(trimmedQuestion).unwrap();
      setResult(answer);
      setAskedQuestion(trimmedQuestion);
      setSearchCount((count) => count + 1);
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  const submit = (event) => {
    event.preventDefault();
    runSearch(question);
  };

  return {
    question,
    changeQuestion: (event) => setQuestion(event.target.value),
    submit,
    isSearching,
    result,
    askedQuestion,
    searchCount,
  };
}
