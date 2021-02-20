const global = {
  state: {
    widthWindow: 0,
    heightWindow: 0,
    current: 0,
    notAuthorized: false,
    genericError: false,
    muted: false,
    showContext: null,
    item: [],
    contextPos: [0, 0],
    me: {},
  },

  mutations: {
    updateMe(state, i) {
      state.me = i;
    },
    toggleMute(state) {
      state.muted = !state.muted;
    },
    getWidth(state, i) {
      state.widthWindow = i;
    },
    getHeight(state, i) {
      state.heightWindow = i;
    },
    changeCurrent(state, i) {
      state.current = i;
    },
    noAuth(state, i) {
      state.notAuthorized = i;
    },
    error(state, i) {
      state.genericError = i;
    },
    setContext(state, i) {
      state.showContext = i;
    },
    setContextPos(state, i) {
      state.contextPos = i;
    },
    setItem(state, i) {
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
  },
};

export default global;
