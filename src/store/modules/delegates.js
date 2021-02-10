const delegates = {
  state: {
    countryList: [],
    gslList: [],
    info: {
      Present: 0,
      'Present & Voting': 0,
      'Total Present': 0,
      'DR Sponsors': 3,
    },
  },
  mutations: {
    countryList(state, l) {
      state.countryList.length = 0;
      state.countryList.push(...l);
    },
    gslList(state, l) {
      state.gslList.length = 0;
      state.gslList.push(...l);
      // Vue.set(state, item.id, ...l);
    },
    present(state) {
      state.info.Present += 1;
      state.info['Total Present'] += 1;
    },
    presentVoting(state) {
      state.info['Present & Voting'] += 1;
      state.info['Total Present'] += 1;
    },

    presence(state, { i, j }) {
      state.delegates[i].presence = j;
    },
  },
  modules: {},
};

export default delegates;
