// Importing eslint-config-standard
const eslintConfigStandard = require('eslint-config-standard');

module.exports = {
  languageOptions: {
    globals: {
      browser: true,
      commonjs: true,
      es2021: true,
    },
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      languageOptions: {
        globals: {
          node: true,
        },
        sourceType: 'script',
      },
    },
  ],
  rules: {},
  // Include the eslint-config-standard rules directly
  ...eslintConfigStandard,
};
