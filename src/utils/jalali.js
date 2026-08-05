// Persian months, from the Gregorian days `/stats` returns.
//
// The backend deliberately sends one count per calendar *day* and leaves the grouping
// here: a Gregorian month is not a Persian one — فروردین straddles March and April — so
// a month bucketed on the server could only be relabelled wrongly on the way to the
// axis. The conversion is `Intl` with the persian calendar, which every target browser
// has; no date library is involved.

const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

const PERSIAN_PARTS = new Intl.DateTimeFormat("en-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  timeZone: "UTC",
});

// Read at midday UTC: the dates arrive as bare 'YYYY-MM-DD', and parsing one at
// midnight puts a viewer west of UTC on the day before.
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

/** The last `count` Persian months, oldest first, each with the key the buckets use. */
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

/** Sums a `[{date, count}]` series into the given months. Days outside them are dropped. */
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

/** Persian digits, which is what the rest of the interface uses. */
export const faNumber = (value) => Number(value ?? 0).toLocaleString("fa-IR");

export default lastPersianMonths;
