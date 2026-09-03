// The chart palette and the chrome every chart shares.
//
// The three series hues are assigned in fixed order and never cycled, so a series
// keeps its colour when another one is filtered out or sits at zero. The set was
// checked rather than eyeballed: against the card surface it clears the CVD gate on
// every pair (worst ΔE 13.0, deutan), the normal-vision floor (16.3) and 3:1 contrast,
// so nothing here leans on a viewer telling blue from green.
//
// Three is also the ceiling this dashboard needs — organizations, users, jobs. A
// fourth series would mean folding one into "other" or splitting the chart, never
// inventing a fourth hue.
export const SERIES = ["#2a78d6", "#eb6834", "#4a3aa7"];

// Text never wears a series colour: the marks carry identity, the labels stay ink.
export const INK = {
  primary: "#0f172a",
  secondary: "#475569",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  surface: "#ffffff",
};

// Mark specs, kept in one place so the charts cannot drift from each other:
// bars capped at 24px with a 4px rounded data-end, a 2px surface gap between
// neighbours, and a hairline solid grid that stays behind the data.
export const BAR = {
  maxBarSize: 24,
  columnRadius: [4, 4, 0, 0],
  // The axis is reversed for RTL, so a horizontal bar grows leftwards and its
  // rounded end is the left one.
  rowRadius: [4, 0, 0, 4],
  gap: 2,
  categoryGap: "28%",
};

export const AXIS_TICK = { fill: INK.muted, fontSize: 12, fontFamily: "Vazirmatn, sans-serif" };
