import Button from "./Button";
import { PlusGlyph } from "./IconButton";

export default function PageToolbar({ title, hint, status, action, children }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          {status}
        </div>
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
