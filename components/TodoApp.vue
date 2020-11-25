<template>
    <div>
        <todo-item 
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"
        />
        <hr />

        <todo-creator @create-todo="createTodo" />
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep' // cloneDeep만 가져갈 것이기에(효율적으로 호출)
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
            todos: []
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

            if(hasTodos) {
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
                        todos: [], // Collection
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
                id: cryptoRandomString({length: 10}),
                title,
                createdAt: new Date(),
                updatedAt: new Date(), // 처음에는 최초 생성일과 같다.
                done: false
            }

            this.db
                .get('todos') // lodash
                .push(newTodo) // lodash
                .write() //lowdb
        },
        updateTodo () {
            console.log('Update todo')
        },
        deleteTodo () {
            console.log('Delete todo')
        }
    }
}
</script>