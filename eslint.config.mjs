import js from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import stylisticJsxPlugin from "@stylistic/eslint-plugin-jsx";
import eslintConfigPrettierRecommended from "eslint-config-prettier/flat";
import jsdocPlugin from "eslint-plugin-jsdoc";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    js.configs.recommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"],
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: {
            react: reactPlugin,
            jsdoc: jsdocPlugin,
            "@stylistic": stylisticPlugin,
            "@stylistic/jsx": stylisticJsxPlugin,
            "simple-import-sort": simpleImportSort,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaVersion: 2024,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
            jsdoc: {
                tagNamePreference: {
                    arg: "param",
                    argument: "param",
                    augments: "extends",
                    constructor: "class",
                    exception: "throws",
                    func: "function",
                    method: "function",
                    prop: "property",
                    return: "returns",
                    virtual: "abstract",
                    yield: "yields",
                },
                preferredTypes: {
                    array: "Array",
                    bool: "Boolean",
                    boolean: "Boolean",
                    number: "Number",
                    object: "Object",
                    str: "String",
                    string: "String",
                },
            },
        },
        rules: {
            // Imports
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            // Règles React
            "react/jsx-uses-vars": "error",
            // Règles stylistiques
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/jsx-quotes": ["error", "prefer-double"],
            // Règles JSDocs
            "jsdoc/check-tag-names": "warn",
            "jsdoc/check-types": "warn",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-return": "off",
            "jsdoc/require-return-description": "off",
            "jsdoc/require-return-type": "off",
        },
    },
    // Frontend
    {
        files: ["frontend/**/*.{js,jsx}"],
        rules: {
            "react/react-in-jsx-scope": "off", // Not needed with React 17+
            "react/jsx-uses-react": "off",
            "@stylistic/jsx-quotes": ["error", "prefer-double"],
        },
    },
    // Backend
    {
        files: ["backend/**/*.js"],
        rules: {
            "no-console": "off",
        },
    },
    // Ignore files and directories
    {
        ignores: ["**/node_modules/*", "dist/*", "build/*", "**/*.py", "**/__pycache__/*", "**/logs/*"],
    },
    // Prettier
    eslintConfigPrettierRecommended,
    // Prettier plugin
    eslintPluginPrettierRecommended,
];
