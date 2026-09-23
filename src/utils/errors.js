/** Turns an RTK Query error into one formal Persian sentence: known backend details are translated exactly or by pattern, anything else falls back to a generic message. */
import { COLUMN_LABELS } from "@constants/jobFields";
import { roleLabel } from "@constants/roles";
import { suggestionStatusLabel } from "@constants/suggestionStatus";
import { faNumber } from "./numbers";

const GENERIC_ERROR = "خطایی رخ داده است؛ لطفاً مجدداً تلاش نمایید.";
const SESSION_ENDED = "اعتبار ورود شما به پایان رسیده است؛ لطفاً مجدداً وارد شوید.";
const ENGINE_NOT_READY = "سرویس تحلیل هنوز آماده نیست؛ لطفاً دقایقی بعد مجدداً تلاش نمایید.";
const NETWORK_ERROR = "ارتباط با سرور برقرار نشد.";
const UNREADABLE_RESPONSE = "پاسخ سرور قابل خواندن نبود.";

const EXACT_MESSAGES = {
  "Invalid credentials": "نام کاربری یا رمز عبور اشتباه است.",
  "Current password is incorrect": "رمز عبور فعلی اشتباه است.",
  "Invalid or expired token": SESSION_ENDED,
  "Authentication required": SESSION_ENDED,

  "Account is blocked": "حساب کاربری شما مسدود شده است؛ برای پیگیری با مدیر سامانه تماس بگیرید.",
  "Insufficient role": "سطح دسترسی شما برای انجام این عملیات کافی نیست.",
  "Outside your organization": "این حساب خارج از سازمان شماست.",
  "Public records are admitted by the system administrator":
    "مشاغل عمومی تنها توسط مدیر سامانه تایید، ویرایش یا حذف می‌شوند.",
  "You cannot act on your own account": "انجام این عملیات روی حساب کاربری خودتان ممکن نیست.",

  "Account not found": "حساب کاربری موردنظر یافت نشد.",
  "Record not found": "رکورد موردنظر یافت نشد.",
  "Organization not found": "سازمان موردنظر یافت نشد.",
  "Username already taken": "این نام کاربری پیش‌تر ثبت شده است.",
  "Organization name already taken": "این نام سازمان پیش‌تر ثبت شده است.",
  "Organization name cannot be cleared": "نام سازمان نمی‌تواند خالی بماند.",
  "A rebuild is already running": "بازسازی پایگاه داده هم‌اکنون در جریان است؛ لطفاً تا پایان آن صبر نمایید.",
  "Engine is not ready": ENGINE_NOT_READY,

  "Logo must be a base64 data URI, e.g. data:image/png;base64,...":
    "نشان سازمان باید یک فایل تصویری معتبر باشد.",
  "Logo is not valid base64": "فایل نشان سازمان معتبر نیست.",
  "Logo is empty": "فایل نشان سازمان خالی است.",

  "Name cannot be blank": "این فیلد نمی‌تواند خالی باشد.",
  "Not a valid email address": "نشانی رایانامه معتبر نیست.",
  "Phone must be 7-20 digits, optionally with + - ( ) or spaces":
    "شماره تماس باید ۷ تا ۲۰ رقم باشد و می‌تواند شامل + - ( ) یا فاصله باشد.",
  "Password must contain an uppercase letter, a lowercase letter, and a special character (e.g. @)":
    "رمز عبور باید دست‌کم یک حرف بزرگ، یک حرف کوچک و یک نویسه غیرحرف و غیرعدد (مانند @) داشته باشد.",

  "Field required": "تکمیل این فیلد الزامی است.",
};

const PATTERN_MESSAGES = [
  [/^Record is already (\w+)$/,
    ([, status]) => `این رکورد پیش‌تر بررسی شده است؛ وضعیت فعلی آن «${suggestionStatusLabel(status)}» است.`],
  [/^Record is (\w+); a suggestion is edited through/,
    ([, status]) => `این رکورد یک پیشنهاد «${suggestionStatusLabel(status)}» است و از بخش پیشنهادها ویرایش می‌شود.`],
  [/^Organization still has (\d+) account\(s\)/,
    ([, count]) => `این سازمان هنوز ${faNumber(count)} حساب کاربری دارد؛ ابتدا آن‌ها را حذف نمایید.`],
  [/^A (\w+) does not belong to an organization$/,
    ([, role]) => `نقش «${roleLabel(role)}» به سازمان تعلق نمی‌گیرد.`],
  [/^Organization already has an admin \((.+)\)$/,
    ([, username]) => `این سازمان هم‌اکنون ادمین دارد: «${username}».`],
  [/^Unsupported logo type (.+); use (.+)$/,
    ([, mime, allowed]) => `قالب تصویر ${mime} پشتیبانی نمی‌شود؛ از ${allowed} استفاده نمایید.`],
  [/^Logo is (\d+) KB; the limit is (\d+) KB$/,
    ([, size, limit]) => `حجم نشان سازمان ${faNumber(size)} کیلوبایت است؛ حداکثر مجاز ${faNumber(limit)} کیلوبایت است.`],
  [/^Logo content does not look like (.+)$/,
    ([, mime]) => `محتوای فایل با قالب اعلام‌شده (${mime}) هم‌خوانی ندارد.`],

  [/^Unknown profile fields: (.+)$/,
    ([, fields]) => `این فیلدها در پروفایل شناخته نمی‌شوند: ${fields}`],
  [/^\w+: at most (\d+) items$/,
    ([, limit]) => `برای هر فیلد حداکثر ${faNumber(limit)} مورد می‌توانید وارد نمایید.`],
  [/^(\w+): at least (\d+) items are required$/,
    ([, field, min]) =>
      `برای تحلیل پیشرفته، «${COLUMN_LABELS[field] ?? field}» باید دست‌کم ${faNumber(min)} مورد داشته باشد.`],

  [/^String should have at least (\d+) characters?$/,
    ([, min]) => `این فیلد باید دست‌کم ${faNumber(min)} نویسه داشته باشد.`],
  [/^String should have at most (\d+) characters?$/,
    ([, max]) => `این فیلد حداکثر ${faNumber(max)} نویسه می‌تواند داشته باشد.`],
  [/^List should have at least (\d+) items?/,
    ([, min]) => `دست‌کم ${faNumber(min)} مورد وارد نمایید.`],
  [/^List should have at most (\d+) items?/,
    ([, max]) => `حداکثر ${faNumber(max)} مورد می‌توانید وارد نمایید.`],
  [/^Input should be a valid (integer|number)/, () => "مقدار واردشده باید عدد باشد."],
  [/^Input should be a valid (string|list|array)/, () => "قالب مقدار واردشده درست نیست."],
  [/^Input should be /, () => "مقدار واردشده مجاز نیست."],
];

const stripValueErrorPrefix = (text) => text.replace(/^Value error, /, "");

function translateDetail(text) {
  if (typeof text !== "string") return null;
  const detail = stripValueErrorPrefix(text);
  if (EXACT_MESSAGES[detail]) return EXACT_MESSAGES[detail];
  for (const [pattern, render] of PATTERN_MESSAGES) {
    const match = detail.match(pattern);
    if (match) return render(match);
  }
  return null;
}

export function errorMessage(error) {
  if (!error) return GENERIC_ERROR;

  if (error.status === "FETCH_ERROR") return NETWORK_ERROR;
  if (error.status === "PARSING_ERROR") return UNREADABLE_RESPONSE;
  if (error.status === 503) return ENGINE_NOT_READY;

  const detail = error.data?.detail;
  if (error.status === 401) return translateDetail(detail) ?? SESSION_ENDED;
  if (typeof detail === "string") return translateDetail(detail) ?? detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => translateDetail(item.msg) ?? item.msg);
    return [...new Set(messages)].join(" ");
  }

  return GENERIC_ERROR;
}
