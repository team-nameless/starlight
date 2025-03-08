import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintPluginImportX from "eslint-plugin-import-x";
import pluginReact from "eslint-plugin-react";
import preferFC from "eslint-plugin-react-prefer-function-component/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    preferFC.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    eslintPluginImportX.flatConfigs.typescript,
    pluginReact.configs.flat.recommended,
    {
        ignores: ["eslint.config.mjs", "frontend/dist/*", "frontend/dist-electron/*", "node_modules/**/*"]
    },
    {
        settings: {
            react: {
                version: "19"
            }
        },
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: { ...globals.browser, ...globals.node },
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "commonjs"
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "import-x/no-duplicates": "error",
            "import-x/default": "off",
            "import-x/no-named-as-default-member": "off",
            "import-x/no-named-as-default": "off"
        }
    }
);
