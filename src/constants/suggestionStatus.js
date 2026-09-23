/** The review states of a job suggestion, with the Persian label and badge tone each one is shown with. */
export const SUGGESTION_STATUS = {
  pending: { label: "در انتظار بررسی", tone: "warning" },
  approved: { label: "تایید شده", tone: "success" },
  rejected: { label: "رد شده", tone: "danger" },
};

export const suggestionStatusLabel = (status) => SUGGESTION_STATUS[status]?.label ?? status;
