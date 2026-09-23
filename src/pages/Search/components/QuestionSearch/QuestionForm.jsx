/** Card at the top of the analysis tab: heading, the question box with its AI-analysis button, and a note on what can be asked. */
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import SearchInput from "@components/ui/SearchInput";
import Spinner from "@components/ui/Spinner";
import { QUESTION_MAX_LENGTH } from "../../constants";

export default function QuestionForm({ question, onQuestionChange, onSubmit, isSearching }) {
  return (
    <Card className="text-center">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">
        پرسش درباره مشاغل
      </h1>
      <p className="text-sm text-slate-500 mt-2">
        وظایف، مهارت‌ها، ابزارها، محیط کاری و مسیر ارتقای بیش از ۱۰۰۰ شغل
      </p>

      <form onSubmit={onSubmit} className="flex gap-2 max-w-2xl mx-auto mt-5">
        <SearchInput
          value={question}
          onChange={onQuestionChange}
          placeholder="مثلاً: یک حسابدار برای ورود به حوزه تحلیل داده به چه مهارت‌هایی نیاز دارد؟"
          maxLength={QUESTION_MAX_LENGTH}
          className="flex-1"
        />
        <Button variant="primary" size="lg" type="submit" disabled={isSearching}>
          {isSearching ? <Spinner /> : "تحلیل مبتنی بر AI"}
        </Button>
      </form>

      <p className="text-xs text-slate-400 mt-4 leading-6">
        می‌توانید شغل مورد نظر خود را نیز توصیف کنید؛ چنانچه در پایگاه داده موجود نباشد، شغلی
        متناسب با آن پیشنهاد می‌شود و امکان ویرایش و ثبت آن در همین صفحه فراهم است.
      </p>
    </Card>
  );
}
