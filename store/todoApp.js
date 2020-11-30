import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep' // cloneDeep만 가져갈 것이기에(효율적으로 호출)
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  // 독립적으로 todoApp.js를 관리하고 싶을 때(혹은 재사용)
  namespaced: true,

  // data
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  // computed
  getters: {
    // 3개 항목에 따라 filter된 todos list항목
    filteredTodos (state) {
      // route에 들어가있는 params (filter name)으로 받아옴
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active': // 해야 할 항목
          return state.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  // methods
  // 실제 값(state)을 변경할 때(비동기 X)
  mutations: {
    // mutations에서는 actions와 다르게 context를 통해서말고
    // 직접 state 접근 가능
    assignDB (state, db) {
      state.db = db
    },
    createDB (state, newTodo) {
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex) // vue api
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  // methods
  // 일반 로직(비동기 O)
  actions: {
    // context: 이 안에는 해당 모듈의 state, getters, ... 접근 참조관계객체
    // const { state } = context
    initDB ({ state, commit }) {
      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter) // actions에서는 state 변경 허용 X
      commit('assignDB', lowdb(adapter)) // commit을 가지고 mutations를 실행 가능

      console.log(state.db)

      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write() // lowdb는 마지막에 write를 해주어야 한다.
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(), // 처음에는 최초 생성일과 같다.
        done: false
      }

      // Create DB Data
      commit('createDB', newTodo)

      // Create Client Data
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      // Update DB Data
      commit('updateDB', { todo, value })

      // lodash 문법 사용
      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    deleteTodo ({ state, commit }, todo) {
      // Delete DB
      commit('deleteDB', todo)

      // 반응성을 가지는 vue 메서드를 사용해야 한다.
      const foundIndex = _findIndex(state.todos, { id: todo.id })

      // Delete Clent
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // DB commit은 반환값을 만들 수 없다.
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // 여기를 commit으로 호출
          // todo.done = checked
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      // state.todos = _cloneDeep(newTodos)
      commit('assignTodos', _cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // this.deleteTodo(todo)
          dispatch('deleteTodo', todo)
        }
      })
    }

  }
}
