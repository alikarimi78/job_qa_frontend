/** Toast notifications in the app's style (dark, right-to-left, Vazirmatn); errors stay on screen longer than successes. */
import toast from "react-hot-toast";

const BASE_TOAST_OPTIONS = {
  duration: 4000,
  style: {
    direction: "rtl",
    fontFamily: "Vazirmatn, sans-serif",
    fontSize: "14px",
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "12px",
    padding: "10px 16px",
    maxWidth: "460px",
  },
};

const ERROR_DURATION_MS = 6000;

export const showMessage = {
  success: (text) => toast.success(text, BASE_TOAST_OPTIONS),
  error: (text) => toast.error(text, { ...BASE_TOAST_OPTIONS, duration: ERROR_DURATION_MS }),
  info: (text) => toast(text, BASE_TOAST_OPTIONS),
};
