module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  extends: ['standard'],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      env: {
        node: true
      },
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  rules: {}
}
