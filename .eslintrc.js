module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/typedef": [
      "error",
      {
        "arrowParameter": true,
        "variableDeclaration": true,
        "arrayDestructuring": true,
        "arrowParameter": true,
        "memberVariableDeclaration": true,
        "objectDestructuring": true,
        "parameter": true,
        "propertyDeclaration": true,
        "variableDeclaration": true,
      }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ]
  },
};
