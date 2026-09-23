/** The account menu panel that fades in under the header's account button. */
import AccountActions from "./AccountActions";
import AccountSummary from "./AccountSummary";

export default function AccountDropdown({ isOpen, widthClass, account, actions }) {
  return (
    <div
      data-active={isOpen || undefined}
      className={`
        absolute left-0 mt-2 ${widthClass} rounded-lg bg-slate-800 z-40 overflow-hidden
        border border-slate-600/40 shadow-xl opacity-0 scale-95 -translate-y-1 pointer-events-none
        transition-all duration-200 origin-top
        data-active:opacity-100 data-active:scale-100 data-active:translate-y-0 data-active:pointer-events-auto
      `}
    >
      <AccountSummary {...account} />
      <AccountActions {...actions} />
    </div>
  );
}
