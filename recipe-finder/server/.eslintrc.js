// .eslintrc.js – ESLint configuration for the server
"use strict";

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "commonjs",
  },
  rules: {
    // Warn on console (allowed here for server logging)
    "no-console": "off",
    // Require strict mode in CommonJS modules
    strict: ["error", "global"],
    // Disallow unused variables except those prefixed with _
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Prefer const
    "prefer-const": "warn",
    // Guard against == vs ===
    eqeqeq: ["error", "always"],
    // No callback-based error swallowing
    "handle-callback-err": "warn",
  },
};
