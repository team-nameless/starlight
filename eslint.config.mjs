import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        ignores: ["frontend/dist/*", "frontend/dist-electron/*", "node_modules/**/*"]
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off"
        }
    }
];
