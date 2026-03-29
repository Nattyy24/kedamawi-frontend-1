/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#1e1e1e",
        gold: "#D4AF37"
      }
    },
  },
  plugins: [],
};