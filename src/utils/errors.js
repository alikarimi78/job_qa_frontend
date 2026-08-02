// Pull a readable Persian message out of whatever RTK Query hands back.
//
// FastAPI puts its own message in `detail` — a string for the ones the handlers raise
// («شما اجازه این کار را ندارید», the 409 naming a sitting admin), and a list of
// {loc, msg} objects when a body fails validation. `fetchBaseQuery` wraps both as
// {status, data}; a network failure has no `data` at all.
export function errorMessage(err) {
  if (!err) return "خطایی رخ داد؛ دوباره تلاش کنید.";

  if (err.status === "FETCH_ERROR") return "ارتباط با سرور برقرار نشد.";
  if (err.status === "PARSING_ERROR") return "پاسخ سرور قابل خواندن نبود.";
  if (err.status === 401) return "دسترسی شما منقضی شده است؛ دوباره وارد شوید.";
  if (err.status === 503) return "سرویس جستجو هنوز آماده نیست؛ کمی بعد دوباره تلاش کنید.";

  const detail = err.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((x) => x.msg).join("، ");

  return "خطایی رخ داد؛ دوباره تلاش کنید.";
}

export default errorMessage;
