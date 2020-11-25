<template>
    <div class="todo-item">

        <!-- 수정모드 일 때 -->
        <div 
            v-if="isEditMode"
            class="item__inner item--edit"
        >
            <input 
                :value="editedTitle"
                type="text"
                @input="editedTitle = $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            />
            <div class="item__actions">
                <button @click="editedTodo">완료</button>
                <button @click="offEditMode">취소</button>
            </div>
        </div>
        <!-- 일반모드 일 때 -->
        <div 
            v-else
            class="item__inner item--normal"
        >
            <input
            v-model="done" 
            type="checkbox" 
            />
            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.title }}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>
            <div class="item__actions">
                <button @click="onEditMode">수정</button>
                <button @click="deleteTodo">삭제</button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    props: {
        todo: Object
    },
    data () {
        return {
            isEditMode: false, // 수정모드 인지 아닌지
            editedTitle: ''
        }
    },
    computed: {
        done: {
            get () {
                return this.todo.done
            },
            set (done) {
                this.updateTodo({
                    done
                })
            }
        },
        date () {
            const date = dayjs(this.todo.createdAt)
            const isSameDate = date.isSame(this.todo.updatedAt)

            if (isSameDate) {
                return date.format('YYYY년 MM월 DD일')
            } else {
                return `${date.format('YYYY년 MM월 DD일')} (edited)`
            }
        }
    },
    methods: {
        // 수정완료한 후 확인
        editedTodo () {

        },
        // 수정모드로 전환
        onEditMode () {

        },
        // 수정모드 취소
        offEditMode () {

        },
        // 부모 component인 TodoApp에 전달
        updateTodo (value) {
            this.$emit('update-todo', this.todo, value)
        },
        deleteTodo () {
            this.$emit('delete-todo', this.todo)
        }
    }
}
</script>