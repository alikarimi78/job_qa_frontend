import toast from "react-hot-toast";

const base = {
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

export const showMessage = {
  success: (text) => toast.success(text, base),
  error: (text) => toast.error(text, { ...base, duration: 6000 }),
  info: (text) => toast(text, base),
};
