/** Card listing the jobs the user has suggested and where each one stands in review. */
import Card from "@components/ui/Card";
import ErrorAlert from "@components/ui/ErrorAlert";
import Loader from "@components/ui/Loader";
import useMySuggestions from "../hooks/useMySuggestions";
import MySuggestionRow from "./MySuggestionRow";

export default function MySuggestions() {
  const { suggestions, isLoading, error, isEmpty } = useMySuggestions();

  return (
    <Card title="پیشنهادهای من" hint="وضعیت مشاغلی که پیشنهاد داده‌اید">
      {isLoading && <Loader />}
      {error && <ErrorAlert error={error} />}
      {isEmpty && <p className="text-sm text-slate-500">تاکنون پیشنهادی ثبت نکرده‌اید.</p>}

      <div className="flex flex-col">
        {suggestions.map((suggestion) => (
          <MySuggestionRow key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
    </Card>
  );
}
