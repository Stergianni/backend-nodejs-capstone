module.exports = {
  languageOptions: {
    globals: {
      browser: true,
      commonjs: true,
      es2021: true,
    },
    ecmaVersion: 'latest',
  },
  extends: 'standard',
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
};
