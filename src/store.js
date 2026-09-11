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
    setUserPhoto(state, photoURL) {
      if (state.user) {
        state.user.photoURL = photoURL;
      }
    },
  },
  actions: {
    async fetchUser({ commit }) {
      console.log('Creating Promise');
      try {
        const user = await _getUser();
        console.log('Found user!', user);
        commit('setUser', user);
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        commit('setUser', null);
        return null;
      }
    },

    loginUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    user: (state) => state.user,
  },
});
