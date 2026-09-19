// A chart wears the colour of what it counts, as its panel's heading and the tiles do: people violet,
// organizations sky, job records emerald (`fieldVisuals`' THEMES). Bars take the -600 step, which clears
// 3:1 on white where the badges' -500 does not; `line` is the shade darker that joins a series' bar tips
// and still reads where it crosses them, `track` the tint under a meter. Rose, the blocked accounts
// beside emerald's active ones, is -700: at -600 the pair is 5.8 ΔE apart for a deuteranope, at -700 8.0.
// Every pair a chart draws side by side was run through the dataviz validator; re-run it for a new one.
export const HUES = {
  blue: { bar: "#2a78d6", line: "#1b5aa8", track: "#cde2fb" },
  orange: { bar: "#eb6834", line: "#c24e1c", track: "#fde3d6" },
  indigo: { bar: "#4a3aa7", line: "#352985", track: "#e0e7ff" },
  violet: { bar: "#7c3aed", line: "#5b21b6", track: "#ede9fe" },
  sky: { bar: "#0284c7", line: "#075985", track: "#e0f2fe" },
  emerald: { bar: "#059669", line: "#065f46", track: "#d1fae5" },
  rose: { bar: "#be123c", line: "#881337", track: "#ffe4e6" },
};

// The order a series that names no hue falls back on.
export const SERIES = [HUES.blue, HUES.orange, HUES.indigo];

export const LINE = { width: 2, dot: 3.5 };

export const INK = {
  primary: "#0f172a",
  secondary: "#475569",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  surface: "#ffffff",
};

export const BAR = {
  maxBarSize: 24,
  columnRadius: [4, 4, 0, 0],
  rowRadius: [4, 0, 0, 4],
  gap: 2,
  categoryGap: "28%",
};

export const AXIS_TICK = { fill: INK.muted, fontSize: 12, fontFamily: "Vazirmatn, sans-serif" };
