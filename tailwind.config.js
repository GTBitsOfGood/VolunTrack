/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primaryColor: "var(--primary-color)",
      secondaryColor: "var(--secondary-color)",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
