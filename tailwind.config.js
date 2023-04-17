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
        grey: "#f5f5f5",
        primaryColor: "var(--primary-color)",
        secondaryColor: "var(--secondary-color)",
        hoverColor: "var(--hover-color)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
