const global = {
  state: {
    widthWindow: 0,
  },

  mutations: {
    getWidth(state, i) {
      state.widthWindow = i;
    },
  },

  getters: {
    getWidthWindow: (state) => state.widthWindow,
  },
};

export default global;
