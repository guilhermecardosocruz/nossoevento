import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { background: "#ffffff", foreground: "#0a0a0a" },
      borderRadius: { '2xl': '1rem' }
    },
  },
  plugins: [],
} satisfies Config;
