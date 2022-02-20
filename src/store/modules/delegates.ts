const delegates = {
  state: {
    delegates: [
      {
        _id: 'indonesia',
        country: 'Indonesia',
        status: 'present',
      },
      {
        _id: 'usa',
        country: 'United States of America',
        status: 'present & voting',
      },
      {
        _id: 'germany',
        country: 'Germany',
        status: 'present',
      },
      {
        _id: 'canada',
        country: 'Canada',
        status: 'present & voting',
      },
      {
        _id: 'bulgaria',
        country: 'Bulgaria',
        status: 'not present',
      },
      {
        _id: 'cambodia',
        country: 'Cambodia',
        status: 'present & voting',
      },
      {
        _id: 'thailand',
        country: 'Thailand',
        status: 'present & voting',
      },
      {
        _id: 'china',
        country: 'China',
        status: 'present',
      },
      {
        _id: 'chile',
        country: 'Chile',
        status: 'not present',
      },
    ],
    countryList: [],
    gslList: [],
    caucusList: [],
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
    },
    delList(state, l) {
      state.delegates.length = 0;
      state.delegates.push(...l);
    },
    caucusList(state, l) {
      state.caucusList.length = 0;
      state.caucusList.push(...l);
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
