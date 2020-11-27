<template>
    <div
        :class="{ done }"
        class="todo-item"
    >

        <!-- 수정모드 일 때 -->
        <div
            v-if="isEditMode"
            class="item__inner item--edit"
        >
            <!-- ref: Vuejs에서 제공해주는 속성 -->
            <input
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle = $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            />
            <div class="item__actions">
                <!-- 수정모드, 일반모드일 때의 버튼 2개에 대해
                    고유key값을 설정해주어야 vue가 각각 고유의 요소라고 인식 -->
                <button
                    class="btn btn--primary"
                    key="complete"
                    @click="editedTodo">
                    <span class="material-icons">done</span>
                </button>
                <button
                    class="btn"
                    key="cancel"
                    @click="offEditMode">
                    <span class="material-icons">close</span>
                    </button>
            </div>
        </div>
        <!-- 일반모드 일 때 -->
        <div
            v-else
            class="item__inner item--normal"
        >
            <label>
              <input
                v-model="done"
                type="checkbox"
              />
              <span class="icon">
                <span class="material-icons">check</span>
              </span>
            </label>
            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.title }}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>
            <div class="item__actions">
                <button
                    class="btn"
                    key="update"
                    @click="onEditMode">
                    <span class="material-icons">create</span>
                </button>
                <button
                    class="btn btn--danger"
                    key="delete"
                    @click="deleteTodo">
                    <span class="material-icons">delete</span>
                    </button>
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
      // title 내용이 다른 경우에만 update 수행
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }

      this.offEditMode()
    },
    // 수정모드로 전환
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title

      // 수정모드 전환하자마자 input에 focusing
      // 하지만 여기서 하면 error (render하기 전에 적용하려하기 때문에)
      // this.$refs.titleInput.focus()

      // isEditMode 변경이 적용돼서 rendering이 마치면
      // callback형식으로 다음 메서드 수행
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    // 수정모드 취소
    offEditMode () {
      this.isEditMode = false
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
