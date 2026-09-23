/** The two tabs of the personal-analysis page: file a new job suggestion, or follow the ones already filed. */
import { ListIcon, PlusIcon } from "@components/icons";

export const SUGGESTION_TABS = {
  new: "new",
  mine: "mine",
};

export const SUGGESTION_TAB_OPTIONS = [
  { value: SUGGESTION_TABS.new, label: "پیشنهاد شغل جدید", icon: PlusIcon },
  { value: SUGGESTION_TABS.mine, label: "پیشنهادهای من", icon: ListIcon },
];
