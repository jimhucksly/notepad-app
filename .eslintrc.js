module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: "standard",
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  rules: {
    "no-console": "off",
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disallows multiple blank lines (no-multiple-empty-lines)
    "no-multiple-empty-lines": [2, {"max": 3, "maxBOF": 2, "maxEOF": 1}],
    // require or disallow a space before function parenthesis
    "space-before-function-paren": ["error", "never"],
    // enforce spacing before and after keywords (keyword-spacing)
    "keyword-spacing": [2, {
      "overrides": {
        "if": {"after": false},
        "for": {"after": false},
        "while": {"after": false},
        "switch": {"after": false},
        "import": {"after": true}
      }
    }],
    // disallow or enforce spaces inside of parentheses (space-in-parens)
    "space-in-parens": ["error", "never"],
    // disallow trailing whitespace at the end of lines (no-trailing-spaces)
    "no-trailing-spaces": ["error", { "skipBlankLines": true, "ignoreComments": true }],
    // disallow control characters in regular expressions (no-control-regex)
    "no-control-regex": "error",
    // disallow unnecessary escape usage (no-useless-escape)
    "no-useless-escape": "off"
  }
}
