import js from '@eslint/js';
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginPrettier.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['react-native'],
        },
      ],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/ignore': ['react-native', '^eslint/config$'],
    },
    ignores: [
      'node_modules',
      'build',
      'dist',
      'coverage',
      'public, src/assets/',
    ],
  },
]);
