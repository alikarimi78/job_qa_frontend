import { useFormContext } from "react-hook-form";

// Input's counterpart for the two prose columns of a job record (شرح شغل، وظایف).
export default function Textarea({
  name,
  label,
  placeholder,
  rows = 3,
  className = "",
  hint,
  registerProps = {},
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
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name, registerProps)}
        className={`
          w-full px-4 py-3 rounded-xl bg-white text-sm text-slate-800 leading-7
          border transition-all duration-200 outline-none resize-y
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
        <span className="text-xs text-red-600">{error.message || "تکمیل این فیلد الزامی است"}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </div>
  );
}
