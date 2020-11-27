<template>
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <button 
                    :class="{ active: filter ==='all' }"
                    @click="changeFilter('all')">
                    모든 항목 ({{ total }})
                </button>
                <button 
                    :class="{ active: filter === 'active' }"
                    @click="changeFilter('active')">
                    해야 할 항목 ({{ activeCount }})
                </button>
                <button 
                    :class="{ active: filter==='completed' }"
                    @click="changeFilter('completed')">
                    완료된 항목 ({{ completedCount }})
                </button>
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                  <input
                    v-model="allDone" 
                    type="checkbox" />
                </div>
                <div class="float--right">
                  <button @click="clearCompleted">
                    완료된 항목 삭제
                  </button>
                </div>
            </div>
        </div>

        <div class="todo-app__list">
            <todo-item
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                @update-todo="updateTodo"
                @delete-todo="deleteTodo"
            />
        </div>

        <hr />

        <todo-creator
            class="todo-app__creator"
            @create-todo="createTodo" />
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep' // cloneDeep만 가져갈 것이기에(효율적으로 호출)
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  computed: {
      // 3개 항목에 따라 filter된 todos list항목
    filteredTodos () {
      switch (this.filter) {
        case 'all':
        default:
          return this.todos
        case 'active': // 해야 할 항목
          return this.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return this.todos.filter(todo => todo.done)
      }
    },
    total () {
        return this.todos.length
    },
    activeCount() {
        return this.todos.filter(todo => !todo.done).length
    },
    completedCount() {
        return this.total - this.activeCount
    },
    // 모든 항목 완료 체크 (일괄처리)
    allDone: {
      get () {
        // total개수 == 완료된 항목 개수 and todo 항목 1개 이상
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app') // DB
      this.db = lowdb(adapter) // localStorage - lowdb를 연결

      console.log(this.db)

      const hasTodos = this.db.has('todos').value()

      if (hasTodos) {
        // db에 있는 모든 내용을 가져온다.
        // this.todos = this.db.getState().todos
        // 이렇게 하면 참조관계가 DB에 직접 형성
        // DB 데이터를 한번 복사해서 화면에 뿌리는 과정이 있어야 한다.

        // deep copy(DB 데이터에 영향을 안주기 위해)
        this.todos = _cloneDeep(this.db.getState().todos)
      } else {
        // Local DB 초기화
        this.db
          .defaults({
            todos: [] // Collection
            // users: [],
            // date: new Data() 이런 식으로 활용 가능
          })
          .write() // lowdb는 마지막에 write를 해주어야 한다.

        // _.defaults(object, [sources])
        // _.defaults(this.db, {}); 이런 셈
      }
    },
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(), // 처음에는 최초 생성일과 같다.
        done: false
      }

      // Create DB Data
      this.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb

      // Create Client Data
      this.todos.push(newTodo)
    },
    updateTodo (todo, value) {
      // Update DB Data
      this.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()

      // Update Client Data
      // 이렇게 해도 된다.
      // const foundTodo = this.todos.find(data => data.id === todo.id)
      // Object.assign(foundTodo, value)

      // lodash 문법 사용
      const foundTodo = _find(this.todos, { id: todo.id })
      _assign(foundTodo, value)
    },
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()

      // 화면 갱신이 안된다.
      // _remove(this.todos, { id: todo.id }) lodash 메서드는 반응X

      // 반응성을 가지는 vue 메서드를 사용해야 한다.
      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex) // vue api
    },
    changeFilter (filter) {
      this.filter = filter
    },
    completeAll (checked) {
      // DB 데이터 모든 done 변경
      // 갱신된 새 리스트 객체 데이터
      const newTodos = this.db
        .get('todos')
        .forEach(todo => {
          todo.done = checked
        })
        .write()

      // Local todos Data도 일괄 변경
      // 1)
      // this.todos.forEach(todo => {
      //   todo.done = checked
      // })

      // 2) 이런 식으로 db 갱신된 결과값을 그대로 deep copy하는 방식도 있다.
      this.todos = _cloneDeep(newTodos)
    },
    clearCompleted () {
      // array 앞에서부터 제거하려한다면 밀리면서 문제 발생 가능
      // this.todos.forEach(todo => {
      //   if(todo.done) {
      //     this.deleteTodo(todo)
      //   }
      // })

      // 뒤에서부터 제거
      // 1) js native 문법 사용
      // this.todos
      //   .reduce((list, todo, index) => {
      //     if (todo.done) {
      //       list.push(index)
      //     }
      //     return list
      //   }, [])
      //   .reverse()
      //   .forEach(index => {
      //     this.deleteTodo(this.todos[index])
      //   })

      // 2) lodash 문법 사용
      _forEachRight(this.todos, todo => {
        if(todo.done) {
          this.deleteTodo(todo)
        }
      })
    }
  }
}
</script>

<style lang="scss">
    @import "../scss/style"
</style>