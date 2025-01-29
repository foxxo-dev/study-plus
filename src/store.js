import { createStore } from 'vuex';

export const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    user: (state) => state.user,
  },
});
