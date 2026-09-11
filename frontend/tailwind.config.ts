import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          50: "#fdf8f4",
          100: "#f9eee4",
          200: "#f4dac7",
          300: "#ecc1a3",
          400: "#e19e74",
          500: "#d77d4c",
          600: "#c9643d",
          700: "#a74e33",
          800: "#86412f",
          900: "#6d382a",
        },
        tea: {
          50: "#f2f8f3",
          100: "#e0efe3",
          200: "#c2dfc8",
          300: "#98c7a3",
          400: "#6ba979",
          500: "#498c58",
          600: "#367044",
          700: "#2d5938",
          800: "#26482f",
          900: "#203c28",
        },
        ner: {
          gamusa: "#c5161d",
          muga: "#cfa55b",
          tea: "#2d5938",
          sky: "#0284c7"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
