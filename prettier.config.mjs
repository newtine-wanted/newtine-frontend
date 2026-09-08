/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
};

export default config;
