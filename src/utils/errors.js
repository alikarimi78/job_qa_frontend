import { ROLE_LABELS } from "@routes/roles";

const GENERIC = "خطایی رخ داده است؛ لطفاً مجدداً تلاش نمایید.";
const SESSION_ENDED = "اعتبار ورود شما به پایان رسیده است؛ لطفاً مجدداً وارد شوید.";
const ENGINE_COLD = "سرویس جستجو هنوز آماده نیست؛ لطفاً دقایقی بعد مجدداً تلاش نمایید.";

const fa = (value) => Number(value).toLocaleString("fa-IR");

const STATUS_LABELS = {
  pending: "در انتظار بررسی",
  approved: "تایید شده",
  rejected: "رد شده",
};

// `src/` answers in English by design — the rate limiter's 429 is the single exception —
// so the Persian the customer reads is written here. Every key below is a `detail` the
// backend can actually produce, or a pydantic `msg` behind its "Value error, " prefix.
// Anything unrecognised is printed as it arrived, which is what lets the rate limiter's
// own Persian through untouched.
const EXACT = {
  // The backend answers 401 for three different things and only one is a dead session:
  // `/auth/login` and `/auth/password` use it for a wrong password too.
  "Invalid credentials": "نام کاربری یا رمز عبور اشتباه است.",
  "Current password is incorrect": "رمز عبور فعلی اشتباه است.",
  "Invalid or expired token": SESSION_ENDED,
  "Authentication required": SESSION_ENDED,

  "Account is blocked": "حساب کاربری شما مسدود شده است؛ برای پیگیری با مدیر سامانه تماس بگیرید.",
  "Insufficient role": "سطح دسترسی شما برای انجام این عملیات کافی نیست.",
  "Outside your organization": "این حساب خارج از سازمان شماست.",
  "You cannot act on your own account": "انجام این عملیات روی حساب کاربری خودتان ممکن نیست.",

  "Account not found": "حساب کاربری موردنظر یافت نشد.",
  "Record not found": "رکورد موردنظر یافت نشد.",
  "Organization not found": "سازمان موردنظر یافت نشد.",
  "Username already taken": "این نام کاربری پیش‌تر ثبت شده است.",
  "Organization name already taken": "این نام سازمان پیش‌تر ثبت شده است.",
  "Organization name cannot be cleared": "نام سازمان نمی‌تواند خالی بماند.",
  "A rebuild is already running": "بازسازی پایگاه داده هم‌اکنون در جریان است؛ لطفاً تا پایان آن صبر نمایید.",
  "Engine is not ready": ENGINE_COLD,

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

// The details that carry a value the reader needs. Each rewrites what it captured, and
// the role and status names are given the same labels the tables use.
const PATTERNS = [
  [/^Record is already (\w+)$/,
    ([, status]) => `این رکورد پیش‌تر بررسی شده است؛ وضعیت فعلی آن «${STATUS_LABELS[status] ?? status}» است.`],
  [/^Record is (\w+); a suggestion is edited through/,
    ([, status]) => `این رکورد یک پیشنهاد «${STATUS_LABELS[status] ?? status}» است و از بخش پیشنهادها ویرایش می‌شود.`],
  [/^Organization still has (\d+) account\(s\)/,
    ([, count]) => `این سازمان هنوز ${fa(count)} حساب کاربری دارد؛ ابتدا آن‌ها را حذف نمایید.`],
  [/^A (\w+) does not belong to an organization$/,
    ([, role]) => `نقش «${ROLE_LABELS[role] ?? role}» به سازمان تعلق نمی‌گیرد.`],
  [/^Organization already has an admin \((.+)\)$/,
    ([, username]) => `این سازمان هم‌اکنون ادمین دارد: «${username}».`],
  [/^Unsupported logo type (.+); use (.+)$/,
    ([, mime, allowed]) => `قالب تصویر ${mime} پشتیبانی نمی‌شود؛ از ${allowed} استفاده نمایید.`],
  [/^Logo is (\d+) KB; the limit is (\d+) KB$/,
    ([, size, limit]) => `حجم نشان سازمان ${fa(size)} کیلوبایت است؛ حداکثر مجاز ${fa(limit)} کیلوبایت است.`],
  [/^Logo content does not look like (.+)$/,
    ([, mime]) => `محتوای فایل با قالب اعلام‌شده (${mime}) هم‌خوانی ندارد.`],

  [/^Unknown profile fields: (.+)$/,
    ([, fields]) => `این فیلدها در پروفایل شناخته نمی‌شوند: ${fields}`],
  [/^\w+: at most (\d+) items$/,
    ([, limit]) => `برای هر فیلد حداکثر ${fa(limit)} مورد می‌توانید وارد نمایید.`],
  [/^skills: at least (\d+) items are required$/,
    ([, min]) => `برای جست‌وجوی پیشرفته باید دست‌کم ${fa(min)} مهارت وارد نمایید.`],
  [/^At least (\d+) fields must be filled in$/,
    ([, min]) => `دست‌کم ${fa(min)} فیلد باید تکمیل شود.`],

  // pydantic's own messages, which arrive for ordinary typing mistakes — a username left
  // empty or a password one character short — and were reaching the reader in English.
  [/^String should have at least (\d+) characters?$/,
    ([, min]) => `این فیلد باید دست‌کم ${fa(min)} نویسه داشته باشد.`],
  [/^String should have at most (\d+) characters?$/,
    ([, max]) => `این فیلد حداکثر ${fa(max)} نویسه می‌تواند داشته باشد.`],
  [/^List should have at least (\d+) items?/,
    ([, min]) => `دست‌کم ${fa(min)} مورد وارد نمایید.`],
  [/^List should have at most (\d+) items?/,
    ([, max]) => `حداکثر ${fa(max)} مورد می‌توانید وارد نمایید.`],
  [/^Input should be a valid (integer|number)/, () => "مقدار واردشده باید عدد باشد."],
  [/^Input should be a valid (string|list|array)/, () => "قالب مقدار واردشده درست نیست."],
  [/^Input should be /, () => "مقدار واردشده مجاز نیست."],
];

// pydantic prefixes a validator's own message with "Value error, ".
const stripPrefix = (text) => text.replace(/^Value error, /, "");

function translate(text) {
  if (typeof text !== "string") return null;
  const detail = stripPrefix(text);
  if (EXACT[detail]) return EXACT[detail];
  for (const [pattern, render] of PATTERNS) {
    const found = detail.match(pattern);
    if (found) return render(found);
  }
  return null;
}

export function errorMessage(err) {
  if (!err) return GENERIC;

  if (err.status === "FETCH_ERROR") return "ارتباط با سرور برقرار نشد.";
  if (err.status === "PARSING_ERROR") return "پاسخ سرور قابل خواندن نبود.";
  if (err.status === 503) return ENGINE_COLD;

  const detail = err.data?.detail;
  // An unrecognised 401 is still a dead session, that being the only one a signed-in user
  // can reach without having just typed a password.
  if (err.status === 401) return translate(detail) ?? SESSION_ENDED;
  if (typeof detail === "string") return translate(detail) ?? detail;
  if (Array.isArray(detail)) {
    // Whole sentences now, so they are joined with a space rather than a comma, and a
    // body missing ten fields says it once.
    const seen = detail.map((item) => translate(item.msg) ?? item.msg);
    return [...new Set(seen)].join(" ");
  }

  return GENERIC;
}

export default errorMessage;
