/** Small round button beside an item being edited (swap into title, delete); it keeps focus in the input so the edit is not committed by the click. */
export default function ItemActionButton({ title, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center cursor-pointer
                  border bg-white transition-colors duration-200 ${
                    danger
                      ? "border-red-200 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
                      : "border-slate-200 text-slate-500 hover:bg-slate-700 hover:border-slate-700 hover:text-white"
                  }`}
    >
      {children}
    </button>
  );
}
