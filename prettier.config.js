module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  endOfLine: "lf",
  singleQuote: false,
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
};
