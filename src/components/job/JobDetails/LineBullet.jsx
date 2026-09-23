/** Round tinted check mark that starts each item of a field's list. */
import { CheckIcon } from "@components/icons";

export default function LineBullet({ theme }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 w-5 h-5 rounded-full ${theme.tint} flex items-center justify-center shrink-0`}
    >
      <CheckIcon className="w-3 h-3" />
    </span>
  );
}
