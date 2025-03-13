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
    async fetchUser({ commit }) {
      try {
        // Wait for _getUser to resolve and fetch the user
        _getUser((error, user) => {
          if (error) {
            console.error('Error fetching user:', error);
            commit('setUser', null); // Set null if there is an error
          } else {
            commit('setUser', user); // Commit the user once fetched
          }
        });
      } catch (error) {
        console.error('Error in fetchUser action:', error);
      }
    },
    loginUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    user: (state) => state.user, // Simply return the user state
  },
});
