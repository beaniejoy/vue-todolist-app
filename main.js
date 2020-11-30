import Vue from 'vue'
import App from './App'
import router from './router' // index.js (index는 생략가능)
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  // callback func
  // render (createElement) {
  //     return createElement(App)
  // },
  render: h => h(App)
})
