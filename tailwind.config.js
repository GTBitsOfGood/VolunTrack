/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{html, js, jsx, ts, tsx}",
    './public/**/*.{html, js, jsx, ts, tsx}"',
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    colors: {
      black: colors.black,
      primary: "var(--primary-color)",
      secondary: "var(--primary-color)",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
