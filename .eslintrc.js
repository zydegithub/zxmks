// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    mapboxgl: true,
    MeasureControl: true,
    CONFIG: true
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    //off:0,warn:1,error:2
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-extra-semi': "error",
    'semi': ["error", "always"],
    "semi-style": ["error", "last"],
    "semi-spacing": ["error", {
      "before": false,
      "after": true
    }],
    "quotes": ["error", "single", {
      "avoidEscape": true
    }],
    // "curly": "error"
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": ["error", {
      "int32Hint": true
    }],
    "spaced-comment": ["error", "always", {
      "exceptions": ["-", "+"]
    }],
    "camelcase": ["warn", {
      "properties": "never"
    }],
    "eqeqeq": ["off", "always"],
    "one-var": "off",
    "no-self-assign": "error",
    "no-multiple-empty-lines": ["error", {
      "max": 2,
      "maxEOF": 1,
      "maxBOF": 1
    }],
    "object-curly-spacing": ["error", "always"],
    "no-tabs": "off",
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    "no-useless-return": "off",
    "eol-last": ["error", "always"],
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": false
    }]

  }
}
