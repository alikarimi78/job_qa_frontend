/** Tailwind theme for the whole client: the Vazirmatn font, the named z-index layers, the modal animation and the `fa-nums` utility. Loaded from `src/styles.css` through `@config`. */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      zIndex: {
        "sidebar-backdrop": "99",
        sidebar: "9999999",
        modal: "99999990",
      },
      keyframes: {
        "modal-in": {
          from: { opacity: "0", transform: "translateY(-8px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "modal-in": "modal-in 180ms ease-out",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".fa-nums": { "font-feature-settings": '"ss02"' },
      });
    }),
  ],
};
