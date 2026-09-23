/** Persian (Jalali) calendar helpers: formats backend timestamps as Tehran dates and groups dated series into the last few Persian months for the dashboard charts. */
const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

const PERSIAN_YEAR_MONTH_FORMAT = new Intl.DateTimeFormat("en-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  timeZone: "UTC",
});

const PERSIAN_DATE_FORMAT = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const PERSIAN_DATE_TIME_FORMAT = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Tehran",
});

const HAS_TIMEZONE = /(?:Z|[+-]\d{2}:?\d{2})$/;
const MISSING_DATE = "—";

function persianYearMonth(isoDate) {
  const parts = PERSIAN_YEAR_MONTH_FORMAT.formatToParts(new Date(`${isoDate}T12:00:00Z`));
  const partValue = (type) => Number(parts.find((part) => part.type === type)?.value);
  return { year: partValue("year"), month: partValue("month") };
}

function currentPersianYearMonth() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return persianYearMonth(`${now.getFullYear()}-${month}-${day}`);
}

export function lastPersianMonths(count) {
  const { year: currentYear, month: currentMonth } = currentPersianYearMonth();
  const months = [];
  let year = currentYear;
  let month = currentMonth;
  for (let step = 0; step < count; step += 1) {
    months.unshift({
      key: `${year}-${month}`,
      label: MONTH_NAMES[month - 1],
      full: `${MONTH_NAMES[month - 1]} ${year.toLocaleString("fa-IR", { useGrouping: false })}`,
    });
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return months;
}

export function bucketByMonth(series, months) {
  const indexByMonthKey = new Map(months.map((month, index) => [month.key, index]));
  const counts = new Array(months.length).fill(0);
  for (const point of series ?? []) {
    const { year, month } = persianYearMonth(point.date);
    const index = indexByMonthKey.get(`${year}-${month}`);
    if (index !== undefined) counts[index] += point.count;
  }
  return counts;
}

const formatWith = (format) => (value) => {
  if (!value) return MISSING_DATE;
  const raw = String(value);
  const date = new Date(HAS_TIMEZONE.test(raw) ? raw : `${raw}Z`);
  return Number.isNaN(date.getTime()) ? MISSING_DATE : format.format(date);
};

export const faDate = formatWith(PERSIAN_DATE_FORMAT);
export const faDateTime = formatWith(PERSIAN_DATE_TIME_FORMAT);
