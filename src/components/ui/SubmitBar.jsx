import Button from "./Button";
import { Spinner } from "./Loader";

export default function SubmitBar({
  label,
  busy = false,
  busyLabel = "در حال ثبت...",
  disabled,
  hint,
  actions,
}) {
  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      {hint && <p className="text-xs text-slate-400 leading-6 mb-3">{hint}</p>}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 max-w-md">
          <Button
            variant="submit"
            size="lg"
            className="w-full"
            buttonProps={{ type: "submit", disabled: disabled ?? busy }}
          >
            {busy ? (
              <>
                <Spinner />
                {busyLabel}
              </>
            ) : (
              label
            )}
          </Button>
        </div>
        {actions}
      </div>
    </div>
  );
}
