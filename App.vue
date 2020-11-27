<template>
    <todo-app />
</template>

<script>
import TodoApp from './components/TodoApp'

export default {
  components: {
    TodoApp // 'todo-app': TodoApp (dash-case < PascalCase)
  }
}
</script>
