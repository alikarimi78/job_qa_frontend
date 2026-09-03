const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

const PERSIAN_PARTS = new Intl.DateTimeFormat("en-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  timeZone: "UTC",
});

function persianYearMonth(isoDate) {
  const parts = PERSIAN_PARTS.formatToParts(new Date(`${isoDate}T12:00:00Z`));
  const value = (type) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month") };
}

function todayInPersian() {
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  return persianYearMonth(iso);
}

export function lastPersianMonths(count) {
  const { year, month } = todayInPersian();
  const months = [];
  let y = year;
  let m = month;
  for (let i = 0; i < count; i += 1) {
    months.unshift({
      key: `${y}-${m}`,
      label: MONTH_NAMES[m - 1],
      full: `${MONTH_NAMES[m - 1]} ${y.toLocaleString("fa-IR", { useGrouping: false })}`,
    });
    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
  }
  return months;
}

export function bucketByMonth(series, months) {
  const slot = new Map(months.map((month, index) => [month.key, index]));
  const counts = new Array(months.length).fill(0);
  for (const point of series ?? []) {
    const { year, month } = persianYearMonth(point.date);
    const index = slot.get(`${year}-${month}`);
    if (index !== undefined) counts[index] += point.count;
  }
  return counts;
}

const PERSIAN_DATE = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

export function faDate(value) {
  if (!value) return "—";
  const raw = String(value);
  const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/.test(raw) ? raw : `${raw}Z`);
  return Number.isNaN(date.getTime()) ? "—" : PERSIAN_DATE.format(date);
}

export const faNumber = (value) => Number(value ?? 0).toLocaleString("fa-IR");

export const faDigits = (value) =>
  String(value ?? "").replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);

export default lastPersianMonths;
