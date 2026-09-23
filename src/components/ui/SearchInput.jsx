/** Plain text box used to filter lists and to type a question; every prop goes to the <input>, `className` sets its width. */
export default function SearchInput({ className = "w-56 md:w-72", ...inputProps }) {
  return (
    <input
      {...inputProps}
      className={`h-11 ${className} px-4 rounded-xl bg-white text-sm text-slate-800
                  border border-slate-200 outline-none transition-all duration-200
                  placeholder:text-slate-400
                  hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30`}
    />
  );
}
