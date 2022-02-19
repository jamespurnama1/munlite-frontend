const conference = {
  state: [
    {
      _id: 'example',
      title: 'Example Conference',
      start_date: new Date(Date.now()).toISOString(),
      end_date: new Date(Date.now() + 9999).toISOString(),
      rules: {
        majority: '1/2 Delegates + 1',
        dr_vote: '2/3 Delegates',
        quorum: '2/3 Delegates',
        rounding: 'Round Down',
      },
      chairman: [{
        _id: 'john',
        email: 'johndoe@example.com',
      },
      {
        _id: 'admin',
        email: 'admin@example.com',
      }],
      delegates: [
        {
          _id: 'indonesia',
          country: 'Indonesia',
          status: 'present',
        },
        {
          _id: 'usa',
          country: 'USA',
          status: 'present & voting',
        },
      ],
      // gsl: {
      //   current: 0,
      //   length: 0,
      //   queue: []
      // },
    },
    {
      _id: 'future',
      title: 'Future Conference',
      start_date: new Date(Date.now() + 9999).toISOString(),
      end_date: new Date(Date.now() + 999999).toISOString(),
      rules: {
        majority: '1/2 Delegates + 1',
        dr_vote: '2/3 Delegates',
        quorum: '2/3 Delegates',
        rounding: 'Round Down',
      },
      chairman: [{
        _id: 'john',
        email: 'johndoe@example.com',
      },
      {
        _id: 'admin',
        email: 'admin@example.com',
      }],
      delegates: [
        {
          _id: 'germany',
          country: 'Germany',
          status: 'present',
        },
        {
          _id: 'usa',
          country: 'USA',
          status: 'present & voting',
        },
      ],
      // gsl: {
      //   current: 0,
      //   length: 0,
      //   queue: []
      // },
    },
  ],
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

export default conference;
