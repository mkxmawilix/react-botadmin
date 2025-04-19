module.exports = {
    printWidth: 120, // Max 120 chars in line, code is easy to read
    useTabs: false, // Use spaces instead of tabs
    tabWidth: 4, // "visual width" of of the "tab"
    trailingComma: "es5", // Add trailing commas in objects, arrays, etc.
    semi: true, // Add ; when needed
    bracketSpacing: true, // Import { some } ... instead of import {some} ...
    arrowParens: "always", // Braces even for single param in arrow functions (a) => { }
    jsxSingleQuote: false, // "" for react props, like in html
    bracketSameLine: false, // Pretty JSX
    endOfLine: "lf", // 'lf' for linux, 'crlf' for windows, we need to use 'lf' for git
};
