const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
require('@babel/polyfill') // 가져오기만 한다.

module.exports = {
    // 진입점
    entry: {
        app: [
            '@babel/polyfill', // 진입하기 전에 babel/polyfill을 실행
            path.join(__dirname, 'main.js')
        ]
    },
    // 결과물에 대한 설정
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/, //node_modules 내 js파일은 babel로 해석X
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [ // 순서 바꾸면 안된다.
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}