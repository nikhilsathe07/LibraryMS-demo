/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#f9fafb",
        foreground: "#111827",
        border: "#e5e7eb",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.05)",
        hover: "0 6px 15px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

