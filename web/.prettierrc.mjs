/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    trailingComma: "none",
    tabWidth: 4,
    printWidth: 120,
    semi: true,
    endOfLine: "lf",
    useTabs: false,
    singleQuote: false,
    arrowParens: "avoid",
    "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@shared/(.*)$", "^[./]"],
    "importOrderSeparation": true,
    "importOrderSortSpecifiers": true,
};
  
export default config;