/** Validation rules shared by the account and organization forms (react-hook-form `rules` objects and the patterns behind them). */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

const PHONE_ALLOWED_CHARACTERS = /^[0-9۰-۹٠-٩+\-() ]+$/;
const PHONE_MIN_DIGITS = 7;

const countDigits = (value) => (value.match(/[0-9۰-۹٠-٩]/g) ?? []).length;

export const PASSWORD_HINT = "حداقل ۸ نویسه، شامل حرف بزرگ و کوچک و نویسه ویژه (مانند @)";

export const PASSWORD_RULES = {
  minLength: { value: 8, message: "حداقل ۸ نویسه" },
  pattern: {
    value: PASSWORD_PATTERN,
    message: "رمز باید شامل حرف بزرگ، حرف کوچک و نویسه ویژه (مانند @) باشد",
  },
};

export const PERSON_NAME_MAX_LENGTH = { value: 64, message: "حداکثر ۶۴ نویسه" };

export function validatePhone(value) {
  const trimmed = value.trim();
  if (!PHONE_ALLOWED_CHARACTERS.test(trimmed)) return "فقط رقم و + - ( ) و فاصله";
  if (countDigits(trimmed) < PHONE_MIN_DIGITS) return "حداقل ۷ رقم";
  return true;
}
