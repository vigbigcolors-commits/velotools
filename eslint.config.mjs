import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    // Build output, vendored WASM codecs, and the protected local growth desk are
    // not authored application source. The generated tool-card bundle is checked
    // at its Vite source instead of after minification.
    ignores: [
      "node_modules/**",
      "dist-tool-cards/**",
      "js/tool-card-grid.js",
      "image-compress/vendor/**",
      "velo-growth-desk/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "no-undef": "off",
      "no-redeclare": "off",
      "no-empty": "off",
    },
  },
  eslintConfigPrettier,
];
