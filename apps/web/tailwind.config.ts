import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        servelect: {
          50: "#E8F8EF",
          100: "#CFF0DC",
          500: "#0B8F43",
          600: "#00843D",
          700: "#006B31",
          900: "#06391F"
        },
        navy: {
          900: "#071826",
          800: "#0B1F2A"
        }
      },
      boxShadow: {
        card: "0 14px 42px rgba(15, 23, 42, 0.06)",
        subtle: "0 8px 24px rgba(15, 23, 42, 0.05)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
