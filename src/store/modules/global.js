const global = {
  state: {
    widthWindow: 0,
    current: 0,
  },

  mutations: {
    getWidth(state, i) {
      state.widthWindow = i;
    },
    changeCurrent(state, i) {
      state.current = i;
    },
  },

  getters: {
    getWidthWindow: (state) => state.widthWindow,
  },
};

export default global;
