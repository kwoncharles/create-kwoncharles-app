module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    /* 이하 Typescript */
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
    /* 이하 Typescript */
    '@typescript-eslint',
  ],
  settings: {
    'import/parsers': {
      /* 이하 Typescript */
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  globals: {
    gtag: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'tailwind.config.js',
    'postcss.config.js',
  ],
  rules: {
    /**
     * 아래 두 가지는 react17 부터는 더이상 필요하지 않음. 
     * https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
     */
    'react/react-in-jsx-scope': 'off',
    "react/jsx-uses-react": "off",
    /* I like it */
    'react/jsx-props-no-spreading': 'off',
    /* Typescript로 대체 */
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    'import/prefer-default-export': 'off',
    'prefer-arrow-callback': 'off',
    'no-plusplus': 'off',

    /* next.js Link 기능과 충돌 */
    'jsx-a11y/anchor-is-valid': 'off',

    /* 이하 Typescript */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-namespace': 'off',
  }
}
