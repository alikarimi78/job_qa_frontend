/** The question tab of the analysis page: the question form and, once answered, the result card (rebuilt from scratch for every new answer). */
import useQuestionSearch from "../../hooks/useQuestionSearch";
import QuestionForm from "./QuestionForm";
import SearchResultCard from "./SearchResultCard";

export default function QuestionSearch() {
  const search = useQuestionSearch();

  return (
    <>
      <QuestionForm
        question={search.question}
        onQuestionChange={search.changeQuestion}
        onSubmit={search.submit}
        isSearching={search.isSearching}
      />

      {search.result && (
        <SearchResultCard
          key={search.searchCount}
          result={search.result}
          askedQuestion={search.askedQuestion}
        />
      )}
    </>
  );
}
