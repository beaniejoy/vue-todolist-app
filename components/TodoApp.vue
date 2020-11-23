<template>
    <div>
        <todo-item />
        <todo-creator />
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import TodoCreator from './TodoCreator'
import todoItem from './TodoItem'

export default {
    components: {
        TodoCreator,
        todoItem
    },
    data () {
        return {
            db: null
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
        }
    }
}
</script>