import SegmentedSwitch from "@components/ui/SegmentedSwitch";


const Magnifier = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const Sliders = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const MODES = [
  ["simple", "تحلیل معمولی", Magnifier],
  ["advanced", "تحلیل پیشرفته", Sliders],
];

export default function ModeSwitch({ value, onChange }) {
  return (
    <SegmentedSwitch options={MODES} value={value} onChange={onChange} label="نوع تحلیل" />
  );
}
