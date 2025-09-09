import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./@/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      },

      spacing: {
        30: "120px",
        7.5: "30px",
        92.5: "23.125rem",
      },
      screens: {
        xs: "425px",
        xss: "525px",
        sm: "640px",
        400: "400px",

        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1610px",
        // => @media (min-width: 1536px) { ... }

        "3xl": "1640px",
        // => @media (min-width: 1920px) { ... }
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("tailwind-scrollbar")],
};

module.exports = config;
