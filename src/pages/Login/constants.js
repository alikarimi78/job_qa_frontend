/** The three product features listed on the login page's showcase panel. */
import { FileTextIcon, SearchIcon, UserIcon } from "@components/icons";

export const LOGIN_FEATURES = [
  {
    title: "تحلیل شغل با نام آن",
    body: "وظایف، مهارت‌ها، دانش، ابزارها و مسیر پیشرفت هر شغل، در یک نگاه.",
    icon: SearchIcon,
  },
  {
    title: "تحلیل شخصی بر پایه توانمندی‌ها",
    body: "آنچه می‌دانید و می‌توانید را وارد نمایید تا نزدیک‌ترین مشاغل رتبه‌بندی شوند.",
    icon: UserIcon,
  },
  {
    title: "گزارش رسمی هر تحلیل",
    body: "نتیجه هر تحلیل را به‌صورت گزارش PDF دریافت و بایگانی نمایید.",
    icon: FileTextIcon,
  },
];
