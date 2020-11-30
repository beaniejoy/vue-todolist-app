<template>
    <div>
        <button @click="createTodo">
          <i class="material-icons">add</i>
        </button>
        <!-- v-model="title"
            한글 입력을 위해 -->
        <input
            :value="title"
            :placeholder="placeholder"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
            type="text" />
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      // 입력 값의 유효성 검사
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다!')
        this.title = this.title.trim()
        return
      }

      // 생성
      // this.$emit('create-todo', this.title) // 부모 component로 올림 (event 이름)
      // Module 이름까지 넣어야 한다.
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      // mouse point를 맨 아래로
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
