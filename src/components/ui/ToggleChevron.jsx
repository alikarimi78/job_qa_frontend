/** Down-pointing chevron that turns upside down when its section is open. */
import { ChevronDownIcon } from "@components/icons";

export default function ToggleChevron({ isOpen }) {
  return (
    <ChevronDownIcon
      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
  );
}
