const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill') // 가져오기만 한다.

// env, opts(options)
module.exports = (env, opts) => {
  const config = {
    // 중복되는 옵션들...
    resolve: {
      extensions: ['.vue', '.js'], // import할 때 확장자 생략 가능
      // 절대 경로 별칭 설정 가능(alias)
      alias: {
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss') // 스타일 전용 경로
      }

      // fallback: {
      //   util: require.resolve('util/'),
      //   crypto: require.resolve('crypto-browserify'),
      //   buffer: require.resolve('buffer/'),
      //   stream: false
      // } // webpack@^5 issue
    },
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
          test: /\.css$/,
          use: [
            'vue-style-loader', // 순서 바꾸면 안된다.
            {
              loader: 'css-loader',
              options: { esModule: false } // css-loader@4.x 이상되면서 수정
            },
            // 후처리를 위한 postcss설정
            'postcss-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // node_modules 내 js파일은 babel로 해석X
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: [
            // scss에서도 style, css loader 같이 적용해야 한다. (순서도 중요)
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { esModule: false } // css-loader@4.x 이상되면서 수정
            },
            // postcss가 sass보다 먼저 실행이 되어야한다.
            'postcss-loader',
            'sass-loader'
          ]
        }

      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      // file을 copy해서 넣어주는 역할
      // patterns 속성을 넣어줘야한다.
      new CopyPlugin({
        patterns: [
          { from: 'assets/', to: '' }
        ]
      })
    ]
  }

  // dev(개발용)
  if (opts.mode === 'development') {
    return merge(config, {
      // 추가 dev용 옵션

      // build를 할 때 webpack이 돌아감
      // build시간을 최대한 축소하고 debugging이 가능하도록 번들 생성(build시간 단축, debug가능)
      // 단점: 파일 크기가 커진다. (배포용으로는 부적격, 개발용으로는 가능)
      devtool: 'eval',
      devServer: {
        open: false, // 브라우저에 바로 실행
        // hot module replacement(hot reload)
        // 수정사항이 바로 반영이 돼서 브라우저에 확인(default true)
        hot: true
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
      ]
    })
  }

  // prod(제품, 배포용)
  if (opts.mode === 'production') {
    return merge(config, {
      // build시간이 길고 debugging 약화
      // 용량이 적고 최적화된 번들
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
