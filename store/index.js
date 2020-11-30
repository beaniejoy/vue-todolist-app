import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  // 배포할 때 true면 성능이슈가 발생 가능(배포 땐 false)
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    todoApp
  }
})
