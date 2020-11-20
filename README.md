# Todo List (Vue.js)

`Vue.js`로 만들어보는 todo list
(vue fundamental)

<br>

## Project & Package 구성

### Project 시작

프로젝트 최초 구성 시 `package.json` 자동 생성
```cmd
$ npm init -y
```

### Package 설치

Vue Project 개발을 위한 패키지 설치

#### Webpack 관련 모듈 설치
```cmd
$ npm i -D webpack webpack-cli webpack-dev-server webpack-merge
```
bundling을 위한 Webpack 모듈 설치

#### Babel 설치

```cmd
$ npm i -D @babel/core @babel/preset-env babel-loader

$ npm i @babel/polyfill (Optional)
```
설치 후 `.babelrc` 설정 추가(`@babel/preset-env`)

#### Vue 설치

```cmd
$ npm i -D vue-template-compiler vue-loader vue-style-loader css-loader
```
`.vue` 파일 내 tag 해석을 위한 패키지 설치 
- `vue-template-compiler`: `<template>` 해석
- `vue-style-loader`: `<style>` 해석
- `<script>` 는 `babel-loader`로 해석

## Webpack Build

### Windows Base
```$cmd 
$ npx webpack --mode production
```
`npx`: `npm` registry에 올라가 있는 패키지를 쉽게 설치하고 관리할 수 있도록 도와주는 CLI 도구  
(`>=npm@5.2.0`)

### Linux Base 
```$cmd
$ webpack --mode production
```