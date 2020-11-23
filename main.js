import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',

  // callback func
  // render (createElement) {
  //     return createElement(App)
  // },
  render: h => h(App)
})
