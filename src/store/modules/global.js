const global = {
  state: {
    widthWindow: 0,
    heightWindow: 0,
    current: 0,
    notAuthorized: false,
    genericError: false,
    muted: false,
  },

  mutations: {
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
  },
};

export default global;
