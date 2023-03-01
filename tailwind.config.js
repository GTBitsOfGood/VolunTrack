/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html, js, jsx, ts, tsx}",
    './public/**/*.{html, js, jsx, ts, tsx}"',
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primary: "var(--primary-color)",
      secondary: "var(--primary-color)",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
