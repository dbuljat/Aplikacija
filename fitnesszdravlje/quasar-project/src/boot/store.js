import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

export default store(({ app }) => {
  app.use(createStore) 

  
  app.provide('$store', createStore({
    state: {
      user: null,
    },
    mutations: {
      setUser(state, user) {
        state.user = user;
      },
    },
    actions: {
      async fetchUser({ commit }) {
       
      },
    },
    modules: {},
  }))
})
