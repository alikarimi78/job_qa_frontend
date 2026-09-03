import { useEffect } from "react";
import { createPortal } from "react-dom";


const SIZES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export default function Modal({
  open,
  title,
  hint,
  onClose,
  children,
  footer,
  size = "md",
  tone = "default",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999990] flex items-start justify-center overflow-y-auto p-4 md:p-8">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          relative w-full ${SIZES[size] ?? SIZES.md} my-auto
          bg-white rounded-2xl shadow-2xl shadow-slate-900/25
          border border-white/60 overflow-hidden
          animate-[modal-in_180ms_ease-out]
        `}
      >
        <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div className="min-w-0">
            <h2
              className={`text-base font-bold ${
                tone === "danger" ? "text-red-700" : "text-slate-800"
              }`}
            >
              {title}
            </h2>
            {hint && <p className="text-xs text-slate-500 mt-1 leading-6">{hint}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                       bg-red-500 hover:bg-red-600 text-white cursor-pointer
                       transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {footer && (
          <footer className="flex items-center gap-3 flex-wrap px-6 py-4 border-t border-slate-200 bg-slate-50">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
