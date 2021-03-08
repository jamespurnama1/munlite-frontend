import {
  getJWT, login, signup, logout,
} from '@/api/user';

const UserModule = {
  state: {
    currentJWT: '',
    loggedIn: false,
  },

  getters: {
    jwt: (state) => state.currentJWT,
    loggedIn: (state) => state.loggedIn,
  },

  mutations: {
    setJWT(state, jwt) {
      state.currentJWT = jwt;
    },
    loginSuccess(state) {
      state.loggedIn = true;
    },
    loginFailure(state) {
      state.loggedIn = false;
    },
    logout(state) {
      state.loggedIn = false;
      state.currentJWT = '';
    },
    registerSuccess(state) {
      state.loggedIn = false;
    },
    registerFailure(state) {
      state.loggedIn = false;
    },
  },

  actions: {
    fetchJWT({ commit }) {
      return getJWT().then(
        (response) => {
          commit('loginSuccess');
          commit('setJWT', response.data.data.access_token);
          return Promise.resolve(response);
        },
        (error) => {
          commit('loginFailure');
          return Promise.reject(error);
        },
      );
    },
    login({ commit }, user) {
      return login(user).then(
        (response) => {
          commit('loginSuccess');
          commit('setJWT', response.data.data.access_token);
          return Promise.resolve(response);
        },
        (error) => {
          commit('loginFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      logout();
      commit('logout');
    },
    register({ commit }, user) {
      return signup(user).then(
        (response) => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        (error) => {
          commit('registerFailure');
          return Promise.reject(error);
        },
      );
    },
  },
};

export default UserModule;
