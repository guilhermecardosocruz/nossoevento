import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}", // opcional: se você tiver funções de UI lá
  ],
  darkMode: "class", // habilita dark mode via classe
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        primary: {
          DEFAULT: "#2563eb", // azul padrão
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          foreground: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // melhora inputs e selects
    require("@tailwindcss/typography"), // tipografia melhorada (prose)
    require("@tailwindcss/aspect-ratio"), // para vídeos/imagens responsivas
  ],
} satisfies Config;

