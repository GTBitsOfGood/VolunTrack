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
        darkGrey: "#8E8E8E",

        success: "#248F25",
        error: "#E02D3C",
        "secondary-grey": "#637381",
        tertiary: "#F9F9F9",
        quaternary: "#E7E6E4",
        "form-grey": "#F9F9F9",
        black: "#212B36",
      },
      fontFamily: {
        "open-sans": ["Open Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        aktiv: ["aktiv-grotesk", "sans-serif"], // Keep existing font as option
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
