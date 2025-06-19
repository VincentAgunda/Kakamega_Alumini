module.exports = {
  env: {
    es6: true,
    node: true,
    browser: false,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "no-undef": "off",
    "require-jsdoc": "off",
    "max-len": ["error", {"code": 120}],
    "camelcase": "off",
    "no-unused-vars": ["error", {"args": "none"}],
    "no-console": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    "admin": "readonly",
    "process": "readonly",
    "require": "readonly",
    "module": "readonly",
    "exports": "readonly",
    "functions": "readonly",
  },
};