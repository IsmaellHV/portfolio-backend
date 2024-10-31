import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'build', 'dist', '*.js'],
  },
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      // '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-inferrable-types': 'off',
      // '@typescript-eslint/ban-types': 'off',
      // 'no-useless-catch': 'off',
      // 'react/prop-types': 'off',
      // 'react/display-name': 'off',
      // 'react/react-in-jsx-scope': 'off',
      // 'no-unused-vars': 'off',
      // 'no-console': [0],
    },
  },
];
