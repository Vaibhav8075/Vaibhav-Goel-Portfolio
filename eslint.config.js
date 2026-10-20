import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // ESLint 9 core does not count <motion.div> as a use of `motion`
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z_]|motion$)' }],
    },
  },
  {
    // The pre-render entry exports functions, not components; fast refresh never loads it
    files: ['src/entry-server.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // Inlined into the standalone explainer page after the kit and the figure data it reads
    files: ['scripts/figures/explainer.js'],
    languageOptions: {
      globals: { ...globals.browser, mountProtocolBench: 'readonly', lineOnTop: 'readonly', geometry: 'readonly', PROTOCOLS: 'readonly', STEPS: 'readonly' },
    },
  },
])
