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
        presence: 'Not Present',
      },
      {
        id: 'be',
        short: 'BEL',
        name: 'Belgium',
        presence: 'Not Present',
      },
      {
        id: 'cn',
        short: 'CHN',
        name: 'China',
        presence: 'Not Present',
      },
      {
        id: 'eg',
        short: 'EGY',
        name: 'Egypt',
        presence: 'Not Present',
      },
      {
        id: 'hk',
        short: 'HKG',
        name: 'Hong Kong',
        presence: 'Not Present',
      },
      {
        id: 'in',
        short: 'IND',
        name: 'India',
        presence: 'Not Present',
      },
      {
        id: 'jp',
        short: 'JPN',
        name: 'Japan',
        presence: 'Not Present',
      },
      {
        id: 'lr',
        short: 'LBR',
        name: 'Liberia',
        presence: 'Not Present',
      },
      {
        id: 'nz',
        short: 'NZL',
        name: 'New Zealand',
        presence: 'Not Present',
      },
      {
        id: 'th',
        short: 'THA',
        name: 'Thailand',
        presence: 'Not Present',
      },
      {
        id: 'us',
        short: 'USA',
        name: 'United States of America',
        presence: 'Not Present',
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
      state.delegates[i - 1].presence = j;
    },
    getWidth(state, i) {
      state.widthWindow = i;
    },
    reset(state) {
      state.info.Present = 0;
      state.info['Present & Voting'] = 0;
      state.info['Total Present'] = 0;
    },
  },
  actions: {},
  modules: {},
});
