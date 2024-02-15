import { createStore } from 'vuex'
import { auth } from 'src/boot/firebase'  

export default createStore({
  state: {
    user: null,
    userRole: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserRole(state, role) { 
      state.userRole = role;
    }
  },
  actions: {
    fetchUser({ commit }) {
      auth.onAuthStateChanged(user => {  
        if (user) {
          commit('setUser', user);
        } else {
          commit('setUser', null);
        }
      });
    },
    setUserRole(context, role) { 
      context.commit('setUserRole', role);
    }
  },
  modules: {},
});
