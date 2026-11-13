import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'assets/**/*', 'public/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
