import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/todos',
    component: TodoApp
  }
]

export default new VueRouter({
    // mode: 'history', // localhost:8080/로 접근가능
  routes
})
