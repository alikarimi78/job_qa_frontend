/** Labelled text input registered with the surrounding react-hook-form form; shows the field's validation error or a hint underneath. */
import { useFormContext } from "react-hook-form";

const DEFAULT_ERROR = "تکمیل این فیلد الزامی است";

export default function Input({
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  hint,
  suffix,
  rules = {},
  inputProps = {},
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...inputProps}
          {...register(name, rules)}
          className={`
            w-full h-11 px-4 rounded-xl bg-white text-sm text-slate-800
            border transition-all duration-200 outline-none
            placeholder:text-slate-400
            focus:ring-2 focus:ring-blue-500/30
            ${suffix ? "pe-11" : ""}
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }
          `}
        />
        {suffix && (
          <span className="absolute inset-y-0 end-1.5 flex items-center">{suffix}</span>
        )}
      </div>
      {error ? (
        <span className="text-xs text-red-600">{error.message || DEFAULT_ERROR}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </div>
  );
}
