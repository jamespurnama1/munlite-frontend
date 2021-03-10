import { profileType } from '@/types/api';
import axios from 'axios';

const global = {
  state: {
    widthWindow: 0 as number,
    heightWindow: 0 as number,
    notAuthorized: false as boolean,
    genericError: false as boolean,
    muted: false as boolean,
    showContext: false as boolean,
    item: [] as any[],
    contextPos: [0, 0] as number[],
    me: {} as profileType.getUserData,
  },

  mutations: {
    updateMe(state, i: profileType.getUserData) {
      state.me = i;
    },
    toggleMute(state) {
      state.muted = !state.muted;
    },
    getWidth(state, i: number) {
      state.widthWindow = i;
    },
    getHeight(state, i: number) {
      state.heightWindow = i;
    },
    noAuth(state, i: boolean) {
      state.notAuthorized = i;
    },
    error(state, i: boolean) {
      state.genericError = i;
    },
    setContext(state, i: boolean) {
      state.showContext = i;
    },
    setContextPos(state, i: number[]) {
      state.contextPos = i;
    },
    setItem(state, i: any[]) {
      state.item = i;
    },
  },
  actions: {
    context({ commit }, [data, actions, event]) {
      commit('setContext', actions);
      commit('setItem', data);
      commit('setContextPos', event);
    },
    resetContext({ commit }) {
      commit('setContext', null);
      commit('setItem', []);
      commit('setContextPos', [0, 0]);
    },
    async updateMe({ commit, getters }) {
      const fetch = axios.create({
        baseURL: process.env.VUE_APP_BASE_API,
        timeout: 7000,
        headers: {
          Authorization: `Bearer ${getters.jwt}`,
          'Content-Type': 'application/json',
        },
      });
      const profile = await fetch.get('/user/me');
      commit('updateMe', profile.data.data);
    },
  },
};

export default global;
