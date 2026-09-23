/** 403 page, shown when a signed-in user opens a page their role is not allowed to see. */
import { LockIcon } from "@components/icons";
import StatusScreen from "@components/ui/StatusScreen";
import useDocumentTitle from "@hooks/useDocumentTitle";
import { PATHS } from "@routes/paths";
import { faDigits } from "@utils/numbers";

export default function UnauthorizedPage() {
  useDocumentTitle("دسترسی غیرمجاز");

  return (
    <StatusScreen
      code={faDigits("403")}
      icon={LockIcon}
      title="دسترسی به این صفحه مجاز نیست"
      message="سطح دسترسی حساب کاربری شما برای مشاهده این صفحه کافی نیست. در صورت نیاز با مدیر سامانه تماس بگیرید."
      actionLabel="بازگشت به صفحه اصلی"
      actionTo={PATHS.root}
    />
  );
}
