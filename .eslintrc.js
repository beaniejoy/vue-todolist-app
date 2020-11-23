module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015, // ES6
        sourceType: 'module'
    },
    // 전역변수들을 사용할지 말지에 대한 설정
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard', // javascript 표준 규칙 검사
        'plugin:vue/essential' // vue 규칙 설정
    ],
    plugins: [
        'vue'
    ],
    // 예외규칙들 적용
    rules: {
        'no-new': 0 // 0: error X, 1: error, 2: warning
    }
}