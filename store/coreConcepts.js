export default {
  namespaced: true,
  // Data
  state: () => ({
    a: 123,
    b: []
  }),
  // Computed
  // params: (state, getters)
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  // params: (state, 전달받은 value)
  mutations: {
    someMutation (state, payload) {
      state.a = 123
      state.b.push(payload)
    }
  },
  // params: (context, 전달받은 인자)
  // context: { state, getters, commit(mutations실행), dispatch(actions실행) }
  actions: {
    someAction1 ({ state, getters, commit, dispatch }, payload) {
      //   state.a = 123 // Error
      //   state.b.push(payload) // Error
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation')
      context.dispatch('someAction1', payload)
    }
  }
}
