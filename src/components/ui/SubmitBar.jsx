import Button from "./Button";
import { Spinner } from "./Loader";

// How every form in the app ends: a rule across the width, then one green button under
// it. It is a component rather than a class string repeated at each call so the eight
// submits — login, the five provisioning forms, the job form and the direct add —
// cannot drift apart, and so «where do I confirm this» has one answer everywhere.
//
// The *rule* is what spans the form; the button is capped at `max-w-md` and sits at the
// start of it (the right, under `dir="rtl"`). It used to be `w-full`, which on the job
// form meant a 1000px green bar — past roughly 450px a button stops reading as a button
// and starts reading as a banner. The cap is deliberately a maximum rather than a fixed
// width: the login card is narrower than it, so that form still ends in a button filling
// its card, which is what a login is supposed to look like. `md` and not `sm` for exactly
// that reason — at `sm` the cap landed 14px short of the login card's inputs, which reads
// as a misalignment rather than as a decision.
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
        size="lg"
        className="w-full max-w-md"
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
