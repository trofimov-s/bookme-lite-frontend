import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^node:'], ['^@?\\w'], ['^\\.']],
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          ignoreCase: true,
        },
      ],
    },
  },
]);
