/** 404 page, shown for any URL the app does not know. */
import { CompassIcon } from "@components/icons";
import StatusScreen from "@components/ui/StatusScreen";
import useDocumentTitle from "@hooks/useDocumentTitle";
import { PATHS } from "@routes/paths";
import { faDigits } from "@utils/numbers";

export default function NotFoundPage() {
  useDocumentTitle("صفحه یافت نشد");

  return (
    <StatusScreen
      code={faDigits("404")}
      icon={CompassIcon}
      title="صفحه موردنظر یافت نشد"
      message="نشانی واردشده در سامانه وجود ندارد یا جابه‌جا شده است. لطفاً از صفحه اصلی ادامه دهید."
      actionLabel="بازگشت به صفحه اصلی"
      actionTo={PATHS.root}
    />
  );
}
