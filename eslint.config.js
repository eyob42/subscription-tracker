import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier"; 

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Load the base ESLint recommended rules
  js.configs.recommended,

  // 2. Define your project settings
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser, 
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },

  // 3. Prettier config MUST be the last item in the array
  prettierConfig,
];
