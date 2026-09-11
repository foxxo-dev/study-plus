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
      console.log('Creating Promise');
      try {
        // Czekamy na wynik z funkcji _getUser(), która zwraca Promise
        const user = await _getUser();

        console.log('Found user!', user);
        commit('setUser', user);
        console.log('Resolving Promise');
        return user;
      } catch (error) {
        // Tutaj trafią wszystkie reject() oraz błędy z _getUser()
        console.error('Error fetching user:', error);
        commit('setUser', null);
        return null; // Zwracamy null zamiast rzucać błąd, tak jak w oryginalnym kodzie
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
