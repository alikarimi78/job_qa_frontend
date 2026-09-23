/** Formats numbers for Persian readers: grouped Persian numerals, digit-by-digit conversion of codes and phone numbers, and percentages. */
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const faNumber = (value) => Number(value ?? 0).toLocaleString("fa-IR");

export const faDigits = (value) =>
  String(value ?? "").replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[digit]);

export const faPercent = (ratio) => `${faNumber(Math.round(ratio * 100))}٪`;
