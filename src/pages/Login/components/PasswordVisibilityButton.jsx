/** Eye button inside the password box that shows or hides the typed password. */
import { EyeIcon, EyeOffIcon } from "@components/icons";

export default function PasswordVisibilityButton({ isVisible, onToggle }) {
  const label = isVisible ? "پنهان کردن کلمه عبور" : "نمایش کلمه عبور";
  const Icon = isVisible ? EyeOffIcon : EyeIcon;

  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      className="w-8 h-8 rounded-lg inline-flex items-center justify-center cursor-pointer
                 text-slate-400 hover:text-slate-700 transition-colors duration-200
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
