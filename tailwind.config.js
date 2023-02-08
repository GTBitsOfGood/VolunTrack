/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html, js, jsx, ts, tsx}",
    './public/**/*.{html, js, jsx, ts, tsx}"',
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
