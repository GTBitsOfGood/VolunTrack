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
        grey: "#F9F9F9",
        primaryColor: "var(--primary-color)",
        secondaryColor: "var(--secondary-color)",
        hoverColor: "var(--hover-color)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
