import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-import-x";
import pluginReact from "eslint-plugin-react";
import pluginReactFC from "eslint-plugin-react-prefer-function-component/config";
import globals from "globals";
import eslintTypeScript from "typescript-eslint";

export default eslintTypeScript.config(
    eslint.configs.recommended,
    pluginReactFC.configs.recommended,
    eslintTypeScript.configs.recommended,
    pluginImport.flatConfigs.recommended,
    pluginImport.flatConfigs.typescript,
    pluginReact.configs.flat.recommended,
    {
        ignores: ["frontend/dist/*", "frontend/dist-electron/*", "node_modules/**/*"]
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
            parser: tsParser
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
