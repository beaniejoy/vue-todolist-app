<template>
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <!-- all == /todos/all
                    여기선 안됨 -->
                <router-link
                    to="/todos/all"
                    tag="button">
                    모든 항목 ({{ total }})
                </router-link>
                <router-link
                    to="/todos/active"
                    tag="button">
                    해야 할 항목 ({{ activeCount }})
                </router-link>
                <router-link
                  to="/todos/completed"
                  tag="button">
                  완료된 항목 ({{ completedCount }})
                </router-link>
                <!-- <button
                    :class="{ active: filter==='completed' }"
                    @click="changeFilter('completed')">
                    완료된 항목 ({{ completedCount }})
                </button> -->
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                  <label>
                    <input
                    v-model="allDone"
                    type="checkbox" />
                    <span class="icon"><i class="material-icons">done_all</i></span>
                  </label>
                </div>
                <div class="float--right clearfix">
                  <button
                    class="btn float--left"
                    @click="scrollToTop">
                    <i class="material-icons">expand_less</i>
                  </button>
                  <button
                    class="btn float--left"
                    @click="scrollToBottom">
                    <i class="material-icons">expand_more</i>
                  </button>
                  <button
                    class="btn btn--danger float--left"
                    @click="clearCompleted">
                    <i class="material-icons">delete_sweep</i>
                  </button>
                </div>
            </div>
        </div>

        <div class="todo-app__list">
          <!-- 이제는 자식컴퍼넌트에서 이벤트를 받아올 필요가 없어짐. -->
            <todo-item
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
            />
        </div>

        <todo-creator class="todo-app__creator" />
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  computed: {
    // Helpers
    // (namespace, [가져올 데이터이름(state)])
    ...mapState('todoApp', [
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    // total () {
    //   return this.$store.getters.todoApp.total
    // },
    // activeCount () {
    //   return this.$store.getters.todoApp.activeCount
    // },

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
  watch: {
    $route () {
      // 이렇게 하면 store의 state값을 바꿔줄 수 없다.
      // state.filter = this.$route.params.id
      // 1.
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
      // 2.
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    // mutations, actions도 helper로 접근 가능
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    // initDB () {
    //   this.$store.dispatch('todoApp/initDB')
    // },
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear', // 스크롤 강도 조절
        duration: 1000 // 스크롤 속도 조절(default: 1000)
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss">
    @import "scss/style";

    .filters button.router-link-active {
      background: royalblue;
      color: white;
    }
</style>
