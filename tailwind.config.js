/** @type {import("tailwindcss").Config} */

module.exports = {
  important: "#app",
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: "#f3f3f3",
        primaryColor: "var(--primary-color)",
        secondaryColor: "var(--secondary-color)",
        hoverColor: "var(--hover-color)",
        darkGrey: "#8E8E8E",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
