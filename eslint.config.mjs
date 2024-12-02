import pluginJs from '@eslint/js';
import pluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      parser: tsParser,
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
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': pluginTs,
    },
  },
  {
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginTs.configs.recommended.rules,
      'prettier/prettier': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-empty-interface': 'off',
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
