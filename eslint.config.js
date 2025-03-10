import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'global-require': 'off',
      'linebreak-style': 'off',
      'no-trailing-spaces': 'error',
      'no-use-before-define': 'error',
      'no-unused-vars': 'off',
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'semi': 'error',
      'indent': [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],
      'quotes': [
        'error',
        'single',
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],
    },
  },
];
