/** Dialog rendered into <body> over a dimmed backdrop; closes on Escape or a backdrop click (when `onClose` is given) and locks page scrolling while open. */
import { createPortal } from "react-dom";
import { XIcon } from "@components/icons";
import useModalBehaviour from "./useModalBehaviour";

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
  useModalBehaviour(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-start justify-center overflow-y-auto p-4 md:p-8">
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
          animate-modal-in
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
            <XIcon strokeWidth={2.5} />
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
