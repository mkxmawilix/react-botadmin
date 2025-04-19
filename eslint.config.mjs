import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import jsdocPlugin from "eslint-plugin-jsdoc";
import stylisticPlugin from "@stylistic/eslint-plugin";
import stylisticJsxPlugin from "@stylistic/eslint-plugin-jsx";
import eslintConfigPrettierRecommended from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: {
            react: reactPlugin,
            jsdoc: jsdocPlugin,
            "@stylistic": stylisticPlugin,
            "@stylistic/jsx": stylisticJsxPlugin,
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
            // Règles recommandées définies sur "warn" au lieu de "error"
            "no-invalid-regexp": "warn",
            "no-prototype-builtins": "warn",
            "no-unsafe-finally": "warn",
            "no-useless-escape": "warn",
            // Autres règles
            "accessor-pairs": "warn",
            "array-callback-return": "warn",
            "capitalized-comments": [
                "warn",
                "always",
                {
                    ignoreConsecutiveComments: true,
                    ignoreInlineComments: true,
                },
            ],
            complexity: ["warn", 15],
            "constructor-super": "warn",
            "dot-notation": "warn",
            eqeqeq: "warn",
            "id-match": "warn",
            "init-declarations": "error",
            "max-depth": "warn",
            "max-nested-callbacks": "warn",
            "no-alert": "warn",
            "no-array-constructor": "warn",
            "no-caller": "warn",
            "no-div-regex": "warn",
            "no-duplicate-imports": "error",
            "no-else-return": "warn",
            "no-empty-function": "error",
            "no-eq-null": "error",
            "no-eval": "error",
            "no-extend-native": "warn",
            "no-extra-bind": "warn",
            "no-extra-label": "warn",
            "no-implicit-coercion": ["warn", { allow: ["~"] }],
            "no-implicit-globals": "warn",
            "no-implied-eval": "warn",
            "no-inline-comments": "warn",
            "no-inner-declarations": "warn",
            "no-iterator": "warn",
            "no-label-var": "warn",
            "no-labels": "warn",
            "no-lone-blocks": "warn",
            "no-lonely-if": "error",
            "no-multi-str": "warn",
            "no-negated-condition": "warn",
            "no-new-func": "warn",
            "no-new-object": "warn",
            "no-new-wrappers": "warn",
            "no-new": "warn",
            "no-octal-escape": "warn",
            "no-param-reassign": "warn",
            "no-proto": "warn",
            "no-restricted-globals": "warn",
            "no-restricted-imports": "warn",
            "no-restricted-syntax": "warn",
            "no-return-assign": "error",
            "no-script-url": "warn",
            "no-self-compare": "warn",
            "no-sequences": "warn",
            "no-shadow": "warn",
            "no-throw-literal": "warn",
            "no-undef-init": "warn",
            "no-unmodified-loop-condition": "warn",
            "no-unneeded-ternary": "error",
            "no-unused-expressions": "error",
            "no-use-before-define": "error",
            "no-useless-call": "warn",
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "warn",
            "no-useless-rename": "warn",
            "no-var": "error",
            "no-void": "warn",
            "operator-assignment": ["error", "always"],
            "prefer-const": "warn",
            radix: "warn",
            "sort-imports": "warn",
            strict: ["error", "function"],
            yoda: "warn",
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
