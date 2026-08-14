import Button from "./Button";
import { PlusGlyph } from "./IconButton";

// The strip above the card in admin_panel.mp4: where you are at the start of the row,
// and the one button that adds something at the end of it. Under `dir="rtl"` that puts
// the title on the right and the green «افزودن … جدید» on the left, which is where the
// reference has it.
//
// It sits *outside* the card on purpose. Creating is no longer a form on the page — it
// is a dialog — so there is nothing for the card to hold but the table, and a button
// floating inside a card headed «سازمان‌ها» reads as acting on the list rather than
// adding to it.
export default function PageToolbar({ title, hint, action, children }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        {hint && <p className="text-sm text-slate-500 mt-1 leading-6">{hint}</p>}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {children}
        {action && (
          <Button
            variant="submit"
            size="lg"
            buttonProps={{ onClick: action.onClick, disabled: action.disabled }}
          >
            {action.label}
            {PlusGlyph}
          </Button>
        )}
      </div>
    </div>
  );
}
