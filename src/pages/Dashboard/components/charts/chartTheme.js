/** Colours and sizes shared by the dashboard charts: one colour set per series (bar, the darker trend line, and the light meter track), neutral inks, and bar/line geometry. */
export const CHART_COLORS = {
  blue: { bar: "#2a78d6", line: "#1b5aa8", track: "#cde2fb" },
  orange: { bar: "#eb6834", line: "#c24e1c", track: "#fde3d6" },
  indigo: { bar: "#4a3aa7", line: "#352985", track: "#e0e7ff" },
  violet: { bar: "#7c3aed", line: "#5b21b6", track: "#ede9fe" },
  sky: { bar: "#0284c7", line: "#075985", track: "#e0f2fe" },
  emerald: { bar: "#059669", line: "#065f46", track: "#d1fae5" },
  rose: { bar: "#be123c", line: "#881337", track: "#ffe4e6" },
};

export const CHART_NEUTRALS = {
  secondaryText: "#475569",
  mutedText: "#94a3b8",
  grid: "#e2e8f0",
  surface: "#ffffff",
};

export const CHART_FONT_FAMILY = "Vazirmatn, sans-serif";

export const LINE_STYLE = { width: 2, dotRadius: 3.5 };

export const BAR_STYLE = {
  maxBarSize: 24,
  columnRadius: [4, 4, 0, 0],
  rowRadius: [4, 0, 0, 4],
  gap: 2,
  categoryGap: "28%",
};

export const AXIS_TICK_STYLE = {
  fill: CHART_NEUTRALS.mutedText,
  fontSize: 12,
  fontFamily: CHART_FONT_FAMILY,
};

export const HOVER_CURSOR_STYLE = { fill: "rgba(15, 23, 42, 0.04)" };
