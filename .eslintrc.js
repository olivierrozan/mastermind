module.exports = {
  root: false,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020
  },  
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    // 'plugin:vue/vue3-recommended',
    "plugin:vue/essential",
    "eslint:recommended"
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': 'off',
    'indent': ['warn', 2],
    'semi': ['error', 'always'],
    'no-prototype-builtins': 'off',
    "vue/multi-word-component-names": ["error", {
      "ignores": ['Home', 'Settings', 'Game']
    }]
  }
}