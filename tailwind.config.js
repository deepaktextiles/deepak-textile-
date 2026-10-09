/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14213D",
          50: "#EEF1F7",
          100: "#D4DCED",
          200: "#A9BADC",
          300: "#7E97CB",
          400: "#5375BA",
          500: "#14213D",
          600: "#101B32",
          700: "#0C1426",
          800: "#080E1B",
          900: "#04070D",
        },
        gold: {
          DEFAULT: "#D4A017",
          50: "#FCF8EC",
          100: "#F7EECE",
          200: "#EDDCA0",
          300: "#E3CB72",
          400: "#D9BA44",
          500: "#D4A017",
          600: "#B8860B",
          700: "#8C6608",
          800: "#5F4505",
          900: "#322403",
        },
        sitebg: {
          DEFAULT: "#F8F7F3",
        },
        txt: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        success: {
          DEFAULT: "#16803C",
        },
        danger: {
          DEFAULT: "#C62828",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 25px -5px rgba(20, 33, 61, 0.08), 0 8px 10px -6px rgba(20, 33, 61, 0.04)",
        gold: "0 4px 14px 0 rgba(212, 160, 23, 0.25)",
      },
      maxWidth: {
        "7xl": "106rem",
        container: "var(--container-width, 164rem)",
        site: "var(--container-width, 164rem)",
      },
      fontFamily: {
        sans: ["'Nunito Sans'", "var(--font-nunito-sans)", "sans-serif"],
        heading: ["'Nunito Sans'", "var(--font-nunito-sans)", "sans-serif"],
        nunito: ["'Nunito Sans'", "var(--font-nunito-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
