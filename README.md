# ☑️ Todo List (Vue.js)

`Vue.js`로 만들어보는 todo list
(vue fundamental)

<br>

## 🏷️ Project & Package 구성

### Project 시작

프로젝트 최초 구성 시 `package.json` 자동 생성
```cmd
$ npm init -y
```

### Package 설치

Vue Project 개발을 위한 패키지 설치  
(package 변경사항에 대한 내용은 issue 기록)


#### ✔️ Webpack 관련 모듈 설치
```cmd
$ npm i -D webpack@^4 webpack-cli webpack-dev-server webpack-merge
```
- bundling을 위한 Webpack 모듈 설치
- `webpack@^4`: polyfill과 충돌 에러 발생을 방지(downgrade)


#### ✔️ Babel 설치

```cmd
$ npm i -D @babel/core @babel/preset-env babel-loader

$ npm i @babel/polyfill (Optional)
```
설치 후 `.babelrc` 설정 추가(`@babel/preset-env`)


#### ✔️ Vue 설치

```cmd
$ npm i -D vue-template-compiler vue-loader vue-style-loader css-loader
```
`.vue` 파일 내 tag 해석을 위한 패키지 설치 
- `vue-template-compiler`: `<template>` 해석
- `vue-style-loader`: `<style>` 해석
- `<script>` 는 `babel-loader`로 해석


#### ✔️ CSS 관련 설치

> Preprocessor - CSS - Postcss

```cmd
$ npm i -D sass-loader@^4 node-sass
$ npm i -D autoprefixer postcss-loader postcss
```
- `preprocessor`
  - `node-sass`: sass를 compile을 할 수 있게 해준다.  
    - (sass를 node 환경에서 binding해서 사용할 수 있게 한다.)
    - `@^4` 버전을 사용해야 충돌 발생X
  - `sass-loader`: webpack에서 `.scss`를 처리하기 위한 loader
- `postcss`
  - `autoprefixer`: 공급업체 접두사를 붙여주는 모듈(IE, Chrome, Firefox...에 해당하는 접두사 > `-webkit-`, `-ms-`, `-o-`, ...)
  - `postcss-loader`: webkit에서 `.css`, `.scss`에 붙여야 한다.(**순서 중요**)
  - `postcss.config.js`: postcss에 대한 설정파일로 `autoprefixer` 설정
  - `package.json`: `browserslist` 속성 설정필요


#### ✔️ localStorage 관련 설치

```cmd
$ npm i lodash lowdb
```
- [`lowdb`](https://github.com/typicode/lowdb)
  - Small JSON database for Node, Electron and the browser. Powered by Lodash.
  - JSON형태의 간단한 DB (browser localStorage 지원)
- [`lodash`](https://lodash.com/docs/#defaults)
  - lowdb를 다룰 수 있게 해주는 일종의 도구
  - `cloneDeep`


#### ✔️ Date 데이터 제어를 위한 모듈

```cmd
$ npm i dayjs
```
- `Moment.js` > 무거운 library
- `Day.js` > `Moment.js`의 문법을 그대로 사용하되 경량화해서 사용 가능


<br>

## 🏷️ Webpack Build

### Windows Base
```$cmd 
$ npx webpack --mode production

(webpack-dev-server 실행)
$ npx webpack serve --mode production 
```
`npx`: `npm` registry에 올라가 있는 패키지를 쉽게 설치하고 관리할 수 있도록 도와주는 CLI 도구  
(`>=npm@5.2.0`)

### Linux Base 
```$cmd
$ webpack --mode production
```
