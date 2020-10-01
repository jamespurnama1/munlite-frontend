import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    delegates: [
      {
        id: 'au',
        short: 'AUS',
        name: 'Australia',
        presence: 'N/A',
      },
      {
        id: 'be',
        short: 'BEL',
        name: 'Belgium',
        presence: 'N/A',
      },
      {
        id: 'cn',
        short: 'CHN',
        name: 'China',
        presence: 'N/A',
      },
      {
        id: 'eg',
        short: 'EGY',
        name: 'Egypt',
        presence: 'N/A',
      },
      {
        id: 'hk',
        short: 'HKG',
        name: 'Hong Kong',
        presence: 'N/A',
      },
      {
        id: 'in',
        short: 'IND',
        name: 'India',
        presence: 'N/A',
      },
      {
        id: 'jp',
        short: 'JPN',
        name: 'Japan',
        presence: 'N/A',
      },
      {
        id: 'lr',
        short: 'LBR',
        name: 'Liberia',
        presence: 'N/A',
      },
      {
        id: 'nz',
        short: 'NZL',
        name: 'New Zealand',
        presence: 'N/A',
      },
      {
        id: 'th',
        short: 'THA',
        name: 'Thailand',
        presence: 'N/A',
      },
      {
        id: 'us',
        short: 'USA',
        name: 'United States of America',
        presence: 'N/A',
      },
    ],
    info: {
      Present: 0,
      'Present & Voting': 0,
      'Total Present': 0,
      'DR Sponsors': 3,
    },
    widthWindow: 0,
  },
  mutations: {
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
    getWidth(state, i) {
      state.widthWindow = i;
    },
    reset(state) {
      state.info.Present = 0;
      state.info['Present & Voting'] = 0;
      state.info['Total Present'] = 0;
      state.delegates.map((e) => ({ ...e, presence: 'N/A' }));
    },
  },
  getters: {},
  modules: {},
});
