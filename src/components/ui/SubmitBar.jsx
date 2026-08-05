import Button from "./Button";
import { Spinner } from "./Loader";

// How every form in the app ends: a rule across the width, then one tall green button
// filling it. It is a component rather than a class string repeated at each call so the
// eight submits — login, the five provisioning forms, the job form and the direct add —
// cannot drift apart, and so «where do I confirm this» has one answer everywhere.
//
// Always the last child of its <form>, and always type=submit: the bar is the form's
// end, not a floating action, so it scrolls with the fields it belongs to.
export default function SubmitBar({
  label,
  busy = false,
  busyLabel = "در حال ثبت...",
  disabled,
  icon,
  hint,
  className = "",
}) {
  return (
    <div className={`mt-6 pt-5 border-t border-slate-200 ${className}`}>
      {hint && <p className="text-xs text-slate-400 leading-6 mb-3">{hint}</p>}
      <Button
        variant="submit"
        size="xl"
        className="w-full"
        buttonProps={{ type: "submit", disabled: disabled ?? busy }}
      >
        {busy ? (
          <>
            <Spinner />
            {busyLabel}
          </>
        ) : (
          <>
            {label}
            {icon}
          </>
        )}
      </Button>
    </div>
  );
}
