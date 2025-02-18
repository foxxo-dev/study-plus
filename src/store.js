import { createStore } from 'vuex';
import { _getUser } from '@/assets/js/firebase';

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
    user: (state) => {
      console.log(_getUser());
      return _getUser();
    },
  },
});
