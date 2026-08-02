import { useFormContext } from "react-hook-form";

// Reads `register` off the surrounding FormProvider, exactly as login.tsx expects —
// the call site passes a `name` and validation through `registerProps`, never a
// value/onChange pair.
export default function Input({
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  hint,
  registerProps = {},
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
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        {...register(name, registerProps)}
        className={`
          w-full h-11 px-4 rounded-xl bg-white text-sm text-slate-800
          border transition-all duration-200 outline-none
          placeholder:text-slate-400
          focus:ring-2 focus:ring-blue-500/30
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
          }
        `}
      />
      {error ? (
        <span className="text-xs text-red-600">{error.message || "این فیلد لازم است"}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </div>
  );
}
