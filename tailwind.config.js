/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Geist'", "'DM Sans'", "sans-serif"],
        mono: ["'Geist Mono'", "monospace"],
      },
      colors: {
        surface: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e8e5e1",
          300: "#d6d3ce",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        accent: {
          DEFAULT: "#e85d2f",
          light: "#f87c55",
          dark: "#c44420",
        },
        blue: {
          soft: "#dbeafe",
          mid: "#3b82f6",
          deep: "#1d4ed8",
        },
        green: {
          soft: "#dcfce7",
          mid: "#22c55e",
        },
        yellow: {
          soft: "#fef9c3",
          mid: "#eab308",
        },
        purple: {
          soft: "#ede9fe",
          mid: "#8b5cf6",
        },
        red: {
          soft: "#fee2e2",
          mid: "#ef4444",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
        modal: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
      },
      animation: {
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.15s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateY(-8px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scaleIn: {
          from: { transform: "scale(0.96)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
