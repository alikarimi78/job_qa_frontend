import { useEffect } from "react";
import { createPortal } from "react-dom";

// The dialog the management sections do their work in. The customer's admin_panel.mp4
// files every create and edit through one of these rather than through a card sitting
// on the page, and the shape is taken from it: title at the start of a ruled header,
// a round ✕ at the end, the fields in the body, and the actions in a ruled footer.
//
// Two things are worth keeping when editing.
//
// It renders through a **portal onto <body>**. `MainLayout` scrolls the content area
// rather than the page (`overflow-y-auto` on the div around the outlet), so a dialog
// declared inside a page would be clipped by that box and would scroll away with the
// row it was opened from. On body it covers the sidebar too — which is the point, and
// why its z-index has to clear the sidebar's `z-[9999999]`. The toaster is above it in
// turn, at 99999999: a failed submit reports itself over the dialog it failed in.
//
// The **footer is the form's SubmitBar**, not a substitute for it. The app's rule is
// that a form ends in a rule across its width and one green button at the start of it;
// a footer is exactly that, moved to the bottom of the panel so it stays put while a
// long body scrolls. The button reaches its <form> through the HTML `form` attribute
// (see `formId` at the call sites), so the fields do not have to live inside it.

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
  // Escape closes, and the page behind does not scroll under the overlay. Both are
  // wired only while a dialog is actually open — this component is mounted per call
  // site, so an always-on listener would be one per closed dialog on the page.
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
      {/* The scrim is the close target as well as the dimmer */}
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
