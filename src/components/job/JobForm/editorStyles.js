/** Shared look of the job editor's in-place inputs, plus the width rule that makes a short input grow with its text. */
export const EDITOR_INPUT_CLASS =
  "max-w-full h-8 px-3 bg-white text-[13px] text-slate-800 border border-blue-400 outline-none " +
  "focus:ring-2 focus:ring-blue-500/30";

export const fitWidthStyle = (text) => ({
  width: `${Math.min(Math.max(text.length * 1.3 + 5, 12), 60)}ch`,
});
