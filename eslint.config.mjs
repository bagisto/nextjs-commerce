import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    plugins: ["unicorn", "react", "jsx-a11y", "unused-imports"],
    extends: ["next", "prettier"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          caughtErrors: "none",
          ignoreRestSiblings: true,
          vars: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "error",
      "react-hooks/exhaustive-deps": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
    },
  },
]);
