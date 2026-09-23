/** Square badge holding an icon, painted with an accent theme: solid gradient at the larger sizes, a soft tint at the small ones. */
const SIZES = {
  tile: "w-14 h-14 rounded-2xl [&>svg]:size-7",
  panel: "w-14 h-14 rounded-2xl [&>svg]:size-7",
  lg: "w-10 h-10 rounded-xl [&>svg]:size-5",
  md: "w-9 h-9 rounded-lg [&>svg]:size-[18px]",
  sm: "w-8 h-8 rounded-lg [&>svg]:size-4",
};

const SOLID_SIZES = new Set(["panel", "lg"]);

export default function IconBadge({ theme, icon: Icon, size = "lg" }) {
  const colors = SOLID_SIZES.has(size)
    ? `bg-gradient-to-br ${theme.gradient} text-white shadow-md`
    : theme.tint;

  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size] ?? SIZES.lg} ${colors} flex items-center justify-center shrink-0`}
    >
      <Icon />
    </span>
  );
}
