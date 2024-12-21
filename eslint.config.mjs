import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: {
            "@stylistic/jsx": stylisticJsx,
        },
    },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
];
