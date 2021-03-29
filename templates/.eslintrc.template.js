module.exports = {
  extends: [
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    '.eslintrc.js',
  ],
  rules: {
    /**
     * 아래 두 가지는 react17 부터는 더이상 필요하지 않음. 
     * https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
     */
    'react/react-in-jsx-scope': 'off',
    "react/jsx-uses-react": "off",
    /** I like it */
    'react/jsx-props-no-spreading': 'off',
    /** Typescript로 대체 */
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    'import/prefer-default-export': 'off',
    'prefer-arrow-callback': 'off',
    'no-plusplus': 'off',
  }
}
