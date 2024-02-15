/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#212638",
        "primary-content": "#F9FBFF",
        secondary: "#323f61",
        "secondary-content": "#F9FBFF",
        accent: "#4969A6",
        "accent-content": "#F9FBFF",
        neutral: "#F9FBFF",
        "neutral-content": "#385183",
        "base-100": "#385183",
        "base-200": "#2A3655",
        "base-300": "#212638",
        "base-content": "#F9FBFF",
        info: "#385183",
        success: "#34EEB6",
        warning: "#FFCF72",
        error: "#FF8863",

        "--rounded-btn": "9999rem",

        ".tooltip": {
          "--tooltip-tail": "6px",
          "--tooltip-color": "hsl(var(--p))",
        },
        ".link": {
          textUnderlineOffset: "2px",
        },
        ".link:hover": {
          opacity: "80%",
        },
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        custom: "0 0 4px rgba(0, 0, 0, .1), 0 1px 2px rgba(0, 0, 0, .25)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
