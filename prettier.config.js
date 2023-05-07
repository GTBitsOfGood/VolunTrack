module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  endOfLine: "lf",
  singleQuote: false,
  plugins: [require("prettier-plugin-tailwindcss"), "prettier-plugin-jsdoc"],
  tailwindConfig: "./tailwind.config.js",
};
