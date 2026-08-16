// Pull a readable Persian message out of whatever RTK Query hands back.
//
// FastAPI puts its own message in `detail` — a string for the ones the handlers raise
// («شما اجازه این کار را ندارید», the 409 naming a sitting admin), and a list of
// {loc, msg} objects when a body fails validation. `fetchBaseQuery` wraps both as
// {status, data}; a network failure has no `data` at all.
export function errorMessage(err) {
  if (!err) return "خطایی رخ داده است؛ لطفاً مجدداً تلاش نمایید.";

  if (err.status === "FETCH_ERROR") return "ارتباط با سرور برقرار نشد.";
  if (err.status === "PARSING_ERROR") return "پاسخ سرور قابل خواندن نبود.";
  if (err.status === 401) return "اعتبار ورود شما به پایان رسیده است؛ لطفاً مجدداً وارد شوید.";
  if (err.status === 503) return "سرویس جستجو هنوز آماده نیست؛ لطفاً دقایقی بعد مجدداً تلاش نمایید.";

  const detail = err.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((x) => x.msg).join("، ");

  return "خطایی رخ داده است؛ لطفاً مجدداً تلاش نمایید.";
}

export default errorMessage;
