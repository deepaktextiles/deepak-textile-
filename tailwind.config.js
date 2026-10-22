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
          DEFAULT: "#C00000",
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#E53E3E",
          500: "#C00000",
          600: "#A80000",
          700: "#8B0000",
          800: "#6B0000",
          900: "#4A0000",
        },
        sitebg: {
          DEFAULT: "#ffffff",
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
        card: "none",
        elevated: "none",
        gold: "none",
      },
      maxWidth: {
        "7xl": "106rem",
        container: "var(--container-width, 164rem)",
        site: "var(--container-width, 164rem)",
      },
      fontFamily: {
        sans: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
        heading: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
        poppins: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
        nunito: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
