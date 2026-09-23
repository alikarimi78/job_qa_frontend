/** Responsive grid for stat tiles whose column count depends on how many tiles are shown and how wide the card is. */
const COLUMNS_BY_TILE_COUNT = {
  3: "grid-cols-1 @min-[36.75rem]:grid-cols-3",
  4: "grid-cols-1 @min-[24.25rem]:grid-cols-2 @min-[49.25rem]:grid-cols-4",
  5: "grid-cols-1 @min-[24.25rem]:grid-cols-2 @min-[36.75rem]:grid-cols-3 @min-[61.75rem]:grid-cols-5",
};

export default function StatTileGrid({ children, className = "" }) {
  const tileCount = [children].flat().filter(Boolean).length;
  return (
    <div className={`@container ${className}`}>
      <div className={`grid gap-3 ${COLUMNS_BY_TILE_COUNT[tileCount] ?? COLUMNS_BY_TILE_COUNT[4]}`}>
        {children}
      </div>
    </div>
  );
}
